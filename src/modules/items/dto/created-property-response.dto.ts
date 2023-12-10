import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

export class CreatedPropertyTranslationDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  language: LanguageEnum

  @ApiProperty()
  @Expose()
  title: string
}

export class CreatedPropertyResponseDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  @Type(() => CreatedPropertyTranslationDto)
  translations: CreatedPropertyTranslationDto

  @ApiProperty()
  @Expose()
  value: string

  @ApiProperty()
  @Expose()
  order: number

  @ApiProperty()
  @Expose()
  childrenProperties: CreatedPropertyResponseDto

  @ApiProperty()
  @Expose()
  createdAt: string

  @ApiProperty()
  @Expose()
  updatedAt: string
}
