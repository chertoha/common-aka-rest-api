import { IsDefined, IsEnum } from 'class-validator'
import { LanguageEnum } from '../enums/language.enum'

export class LanguageHeadersDto {
  @IsDefined()
  @IsEnum(LanguageEnum)
  language: LanguageEnum
}
