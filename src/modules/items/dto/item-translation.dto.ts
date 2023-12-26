import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEnum, IsString } from 'class-validator'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

export class CreateItemTranslationDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  title: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  titleSlug: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  shortTitle: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  description: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  shortDescription: string

  @ApiProperty()
  @IsDefined()
  @IsEnum(LanguageEnum)
  language: LanguageEnum
}
