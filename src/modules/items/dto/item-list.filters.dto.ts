import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class ItemListFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  brandId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  itemsIds?: number[]
}
