import type { Type } from '@nestjs/common';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types
export const PaginationResponseDto = <TModel extends Type<unknown>>(model: TModel, status = HttpStatus.OK) =>
  applyDecorators(
    HttpCode(status),
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              totalCount: {
                type: 'number',
                example: 0,
              },
              items: {
                type: 'array',
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
