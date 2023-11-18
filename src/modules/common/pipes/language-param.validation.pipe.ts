import { Injectable, ParseEnumPipe } from '@nestjs/common'
import { LanguageEnum } from '../enums/language.enum'

@Injectable()
export class LanguageParamValidationPipe extends ParseEnumPipe {
  constructor() {
    super(LanguageEnum)
  }
}
