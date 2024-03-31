import * as slug from 'slug'
import { LanguageEnum } from '../enums/language.enum'

const LanguageMap = {
  [LanguageEnum.RU]: 'ru',
  [LanguageEnum.UA]: 'uk'
}

export function slugify(text: string, language: LanguageEnum): string {
  return slug(text, { locale: LanguageMap[language] })
}
