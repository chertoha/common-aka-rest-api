import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ItemImageDto } from './item-image.dto'
import { ItemTranslationDto } from './item-response.dto'

export class AlternativeItemDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ isArray: true, type: ItemTranslationDto })
  @Type(() => ItemTranslationDto)
  @Expose()
  translations: ItemTranslationDto[]

  @ApiProperty({ type: () => ItemImageDto })
  @Expose()
  images: ItemImageDto

  @ApiProperty()
  @Expose()
  purchaseName: string

  @ApiProperty()
  @Expose()
  publicName: string

  @ApiProperty()
  @Expose()
  discount?: number

  @ApiProperty()
  @Expose()
  brandId: number

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date
}
