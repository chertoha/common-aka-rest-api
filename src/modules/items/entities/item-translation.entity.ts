import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { ItemEntity } from './item.entity'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

@Entity({ name: 'item_translations' })
@Unique(['itemId', 'language'])
export class ItemTranslationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: LanguageEnum })
  language: LanguageEnum

  @Column('text')
  title: string

  @Column('text', { unique: true })
  titleSlug: string

  @Column()
  shortTitle: string

  @Column('text')
  description: string

  @Column('text')
  shortDescription: string

  @Column()
  itemId: number

  @ManyToOne(() => ItemEntity, (item) => item.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
  item: ItemEntity
}
