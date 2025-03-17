import { IsDefined, IsNumber, Max, Min } from 'class-validator';
import { CreatePatientsResponseInterface } from '../interfaces/patients.interface';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PatientsEntity } from 'src/modules/database/entities/patients/patients.entity';

export class CreatePatientsResponseDto implements CreatePatientsResponseInterface {
  @ApiProperty({
    description: 'api result'
  })
  result: boolean;

  @ApiProperty({
    description: 'total effected row count'
  })
  effectedRawCount?: number;
}

export class GetPatientListRequestDto {
  @ApiProperty({
    description: 'page, minimum is 1'
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'limit, minimum is 1 and maximum is 100'
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;
}

export class GetPatientListResponseDto implements PatientsEntity {
  @ApiProperty({
    description: 'patient id'
  })
  id: number;

  @ApiProperty({
    description: 'patient name'
  })
  name: string;

  @ApiProperty({
    description: 'patient phone number'
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'patient chart number'
  })
  chartNumber?: number;

  @ApiPropertyOptional({
    description: 'patient address'
  })
  address?: string;

  @ApiProperty({
    description: 'patient resident number'
  })
  residentNumber: string;

  @ApiPropertyOptional({
    description: 'memo'
  })
  memo?: string;
}