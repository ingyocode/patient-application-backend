import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientsEntity } from '../database/entities/patients/patients.entity';
import { CreatePatientsIneterface } from '../database/entities/patients/patients.interface';
import { CreatePatientsResponseInterface, PatientsJsonInterface } from './interfaces/patients.interface';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientsEntity)
    private readonly patientsRepository: Repository<PatientsEntity>
  ) {}

  async getPatientList(page: number, limit: number): Promise<PaginationDto<PatientsEntity[]>> {
    const count = await this.patientsRepository.count();
    const totalPage = count % limit === 0
      ? count / limit
      : Math.ceil(count / limit);
    if (page > totalPage) {
      throw new HttpException('current page is more than total page', 400);
    }

    const items = await this.patientsRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        id: 'ASC'
      }
    });


    return new PaginationDto(items, totalPage);
  }

  async savePatientListInFile(fileBuffer: Buffer): Promise<CreatePatientsResponseInterface> {
    try {
      const rawData = xlsx.read(fileBuffer, { type: 'buffer' });

      const sheetName = rawData.SheetNames[0];
      const worksheet = rawData.Sheets[sheetName];

      const jsonDataList: PatientsJsonInterface[] = xlsx.utils.sheet_to_json(worksheet);
      const formatedDataList = this.formatRawPatientList(jsonDataList)

      const bulkSize = 1000;
      for (let i = 0; i < formatedDataList.length; i+=bulkSize) {
        const chunk = formatedDataList.slice(i, i + bulkSize);

        await this.patientsRepository.upsert(
          chunk,
          ['name', 'phoneNumber', 'chartNumber'],
        );
      }

      // TODO: upate query

      return {
        result: true,
        effectedRawCount: formatedDataList.length
      };
    } catch (err) {
      console.log(err)
      return {
        result: false
      };
    }
  }

  formatRawPatientList(patientList: PatientsJsonInterface[]): CreatePatientsIneterface[] {
    const formatedDataList: CreatePatientsIneterface[] = [];
    patientList.forEach((data: PatientsJsonInterface) => {
      if (!data.이름 ||data.이름?.length < 1 || data.이름?.length > 16) {
        return;
      }

      let residentNumber;
      const residentNumberSuffix = '-0******'
      const numberResidentNum = String(data.주민등록번호).replace(/-/g, '');
      if (numberResidentNum.length === 6) {
        residentNumber = numberResidentNum+residentNumberSuffix;
      } else {
        residentNumber= numberResidentNum.slice(0,6)+'-'+numberResidentNum[7]+'******'
      }

      const formatedData: CreatePatientsIneterface = {
        name: data.이름,
        phoneNumber: String(data.전화번호).replace(/-/g, ''),
        chartNumber: data?.차트번호,
        address: data?.주소,
        memo: data?.메모,
        residentNumber
      };
      formatedDataList.push(formatedData);
    });

    return formatedDataList;
  }

  private async bulkInsertPatients(patients: CreatePatientsIneterface[]): Promise<void> {
    await this.patientsRepository.save(patients);
  }
}