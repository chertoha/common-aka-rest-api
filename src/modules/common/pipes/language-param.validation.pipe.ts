import { ParseEnumPipe } from '@nestjs/common'
import { LanguageEnum } from '../enums/language.enum'

export class LanguageParamValidationPipe extends ParseEnumPipe {
  constructor() {
    super(LanguageEnum)
  }
}
