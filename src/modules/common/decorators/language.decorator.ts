import { Param } from '@nestjs/common'
import { LanguageParamValidationPipe } from '../pipes/language-param.validation.pipe'

export const Language = Param.bind(null, 'language', LanguageParamValidationPipe)
