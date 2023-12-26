import { type LanguageEnum } from 'src/modules/common/enums/language.enum'
import { type Nullable } from 'src/modules/common/types/nullable.type'
import { type ObjectLiteral } from 'typeorm'

export function whereLanguageStatement(relation: string, language: Nullable<LanguageEnum>): [string?, ObjectLiteral?] {
  return language ? [`${relation} = :language`, { language }] : []
}
