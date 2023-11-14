import { Query } from '@nestjs/common'
import { LanguageParamValidationPipe } from '../pipes/language-param.validation.pipe'

export const Language = Query.bind(null, 'language', LanguageParamValidationPipe)
