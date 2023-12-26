import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ItemImageDto } from './item-image.dto'
import { Expose, Type } from 'class-transformer'
import { ItemTranslationDto } from './item-response.dto'

export class ItemListItemDto {
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

export class ItemListDto {
  @ApiProperty({ type: () => ItemListDto, isArray: true })
  @Expose()
  data: ItemListItemDto[]

  @ApiPropertyOptional()
  @Expose()
  page?: number

  @ApiPropertyOptional()
  @Expose()
  perPage?: number

  @ApiProperty()
  @Expose()
  total: number
}
