import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { Type } from 'class-transformer'

export class ItemTranslationDto {
  @ApiProperty()
  title: string

  @ApiProperty()
  titleSlug: string

  @ApiProperty()
  shortTitle: string

  @ApiProperty()
  description: string

  @ApiProperty()
  shortDescription: string

  @ApiProperty()
  language: LanguageEnum
}

export class CreateItemResponseDto {
  @ApiProperty()
  purchaseName: string

  @ApiPropertyOptional()
  publicName: string

  @ApiProperty()
  brandId: number

  @ApiProperty({ isArray: true, type: ItemTranslationDto })
  @Type(() => ItemTranslationDto)
  translations: ItemTranslationDto[]
}
