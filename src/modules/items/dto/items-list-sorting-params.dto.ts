import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator'
import { SortingOrder } from 'src/modules/common/enums/sorting-order-enum'

export class ItemsListSortingParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['createdAt'])
  column?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(SortingOrder)
  order?: SortingOrder
}
