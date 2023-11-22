import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { PropertyDto } from './property.dto'

export class ArticleDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Expose()
  model3d: string

  @ApiProperty()
  @Expose()
  pdf: string

  @ApiProperty()
  @Expose()
  price: number

  @ApiProperty()
  @Expose()
  discount: number

  @ApiProperty()
  @Expose()
  weight: number

  @ApiProperty()
  @Expose()
  weightUnit: string

  @ApiProperty({ type: () => PropertyDto, isArray: true })
  @Expose()
  properties: PropertyDto[]
}
