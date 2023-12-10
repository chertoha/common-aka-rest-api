import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { Expose, Type } from 'class-transformer'
import { ItemImageDto } from './item-image.dto'
import { CreatedPropertyResponseDto } from './created-property-response.dto'

export class ItemTranslationDto {
  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  titleSlug: string

  @ApiProperty()
  @Expose()
  shortTitle: string

  @ApiProperty()
  @Expose()
  description: string

  @ApiProperty()
  @Expose()
  shortDescription: string

  @ApiProperty()
  @Expose()
  language: LanguageEnum
}

export class CreatedItemResponseDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  purchaseName: string

  @ApiPropertyOptional()
  @Expose()
  publicName: string

  @ApiProperty()
  @Expose()
  @Type(() => ItemImageDto)
  images: ItemImageDto

  @ApiProperty()
  @Expose()
  brandId: number

  @ApiProperty({ isArray: true, type: ItemTranslationDto })
  @Type(() => ItemTranslationDto)
  @Expose()
  translations: ItemTranslationDto[]

  @ApiProperty({ isArray: true, type: CreatedPropertyResponseDto })
  @Type(() => CreatedPropertyResponseDto)
  @Expose()
  properties: CreatedPropertyResponseDto[]
}
