import { Controller, Get, Post } from '@nestjs/common';

@Controller('patients')
export class PatientsController {
  constructor() {}

  @Get()
  async getPatient() {}

  @Post()
  async uploadPatientFile() {}
}