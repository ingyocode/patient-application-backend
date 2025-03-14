import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientsEntity } from '../database/entities/patients/patients.entity';
import { Transactional } from 'typeorm-transactional';
import { CreatePatientsIneterface } from '../database/entities/patients/patients.interface';
import { PatientsJsonInterface } from './interfaces/patients.interface';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientsEntity)
    private readonly patientsRepository: Repository<PatientsEntity>
  ) {}

  async savePatientListInFile(fileBuffer: Buffer): Promise<boolean> {
    try {
      const rawData = xlsx.read(fileBuffer, { type: 'buffer' });

      const sheetName = rawData.SheetNames[0];
      const worksheet = rawData.Sheets[sheetName];

      const jsonDataList: PatientsJsonInterface[] = xlsx.utils.sheet_to_json(worksheet);
      const formatedDataList = this.formatRawPatientList(jsonDataList)

      const bulkSize = 500;
      for (let i = 0; i < formatedDataList.length; i+=bulkSize) {
        const chunk = formatedDataList.slice(i, i + bulkSize);

        await this.patientsRepository.save(chunk);
      }

      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

  formatRawPatientList(patientList: PatientsJsonInterface[]): CreatePatientsIneterface[] {
    const formatedDataList: CreatePatientsIneterface[] = [];
    patientList.forEach((data: PatientsJsonInterface) => {
      if (!data.이름 ||data.이름?.length < 1 || data.이름?.length > 16) {
        return;
      }

      const formatedData: CreatePatientsIneterface = {
        name: data.이름,
        phoneNumber: String(data.전화번호).replace(/-/g, ''),
        chartNumber: data?.차트번호,
        address: data?.주소,
        memo: data?.메모
      };

      const residentNumberSuffix = '-0******'
      if (data?.주민등록번호) {
        const residentNumber = String(data.주민등록번호).replace(/-/g, '');
        if (residentNumber.length === 6) {
          Object.assign(formatedData, {
            residentNumber: residentNumber+residentNumberSuffix
          });
        } else {
          Object.assign(formatedData, {
            residentNumber: residentNumber.slice(0,6)+'-'+residentNumber[7]+'******'
          })
        }
      }
      formatedDataList.push(formatedData);
    });

    return formatedDataList;
  }

  private async bulkInsertPatients(patients: CreatePatientsIneterface[]): Promise<void> {
    await this.patientsRepository.save(patients);
  }
}