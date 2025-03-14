import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsEntity } from '../database/entities/patients/patients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientsEntity
    ])
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService]
})
export class PatientsModule {}