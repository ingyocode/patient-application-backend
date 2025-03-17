import { Controller, Get, HttpException, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientsService } from './patients.service';
import { CreatePatientsResponseDto, GetPatientListRequestDto, GetPatientListResponseDto } from './dtos/patients.dto';
import { PaginationDto } from '../common/pagination.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/decorators/response-data.dto';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
  ) {}

  @ApiOperation({
    summary: 'get patients',
    description: 'get patients'
  })
  @PaginationResponseDto(GetPatientListResponseDto)
  @Get()
  async getPatientList(
    @Query() query: GetPatientListRequestDto
  ): Promise<PaginationDto<GetPatientListResponseDto[]>> {
    return this.patientsService.getPatientList(query.page, query.limit)
  }

  @ApiOperation({
    summary: 'excel file upload',
    description: 'insert patient info, file extension must xlsx'
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type:'string',
          format: 'binary',
          nullable: false
        },
      },
    },
  })
  @ApiOkResponse({
    type: CreatePatientsResponseDto
  })
  async uploadPatientFile(@UploadedFile() file: Express.Multer.File): Promise<CreatePatientsResponseDto> {
    if (!file) {
      throw new HttpException('can not get file', 400);
    }
    const [, extension] = file.originalname.split('.');
    if (extension !== 'xlsx') {
      throw new HttpException('invalid file extension', 400);
    }

    const result = await this.patientsService.savePatientListInFile(file.buffer);

    if (!result.result) {
      throw new HttpException('failed to save patient data', 409);
    }

    return result;
  }
}