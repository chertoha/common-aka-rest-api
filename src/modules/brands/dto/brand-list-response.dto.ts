import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { BrandDto } from './brand.dto'

export class BrandListResponseDto {
  @ApiProperty({ type: [BrandDto] })
  @Expose()
  data: BrandDto[]
}
