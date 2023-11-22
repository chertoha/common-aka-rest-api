import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PropertyEntity } from './property.entity'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

@Entity({ name: 'property_translations' })
export class PropertyTranslationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: LanguageEnum })
  language: LanguageEnum

  @Column('text')
  title: string

  @Column()
  propertyId: number

  @ManyToOne(() => PropertyEntity, (property) => property.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
  property: PropertyEntity
}
