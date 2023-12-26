import { IsEnum, IsOptional } from 'class-validator'
import { LanguageEnum } from '../enums/language.enum'

export class LanguageHeadersDto {
  @IsOptional()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum
}
