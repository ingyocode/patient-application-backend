import { Controller, Get, HttpException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
  ) {}

  @Get()
  async getPatientList() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPatientFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('can not get file', 400);
    }
    const [, extension] = file.originalname.split('.');
    if (extension !== 'xlsx') {
      throw new HttpException('invalid file extension', 400);
    }

    const result = await this.patientsService.savePatientListInFile(file.buffer);

    if (!result) {
      throw new HttpException('failed to save patient data', 409);
    }
  }
}