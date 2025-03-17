import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
  constructor(data: T, totalPage?: number) {
    if (totalPage) {
      this.totalPage = totalPage;
    }
    this.items = data;
  }

  @ApiProperty({
    description:'total Page',
  })
  totalPage: number;

  @ApiProperty({ description: 'items is limited by limit value' })
  items: T;
}