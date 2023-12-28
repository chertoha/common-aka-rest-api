import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { CreatedPropertyResponseDto } from 'src/modules/items/dto/created-property-response.dto'

export class ArticleResponseDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  name: string

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

  @ApiProperty()
  @Expose()
  model3d: string

  @ApiProperty()
  @Expose()
  pdf: string

  @ApiProperty({ type: () => CreatedPropertyResponseDto })
  @Expose()
  @Type(() => CreatedPropertyResponseDto)
  properties: CreatedPropertyResponseDto[]
}
