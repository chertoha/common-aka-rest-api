import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ItemTranslationEntity } from './item-translation.entity'
import { ArticleEntity } from './article.entity'
import { PropertyEntity } from './property.entity'
import { ItemImageDto } from '../dto/item-image.dto'

@Entity({ name: 'items' })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('json')
  images: ItemImageDto

  @Column()
  purchaseName: string

  @Column()
  publicName: string

  @Column()
  brandId: number

  @ManyToOne(() => BrandEntity, (brand) => brand.items)
  @JoinColumn({ name: 'brandId', referencedColumnName: 'id' })
  brand: BrandEntity

  @OneToMany(() => ItemTranslationEntity, (translation) => translation.item)
  translations: ItemTranslationEntity[]

  @OneToMany(() => ArticleEntity, (article) => article.item)
  articles: ArticleEntity[]

  @OneToMany(() => PropertyEntity, (article) => article.item)
  properties: PropertyEntity[]

  @ManyToMany(() => ItemEntity)
  @JoinTable({
    name: 'item_alternatives',
    joinColumn: { name: 'itemId' },
    inverseJoinColumn: { name: 'alternativeId' }
  })
  alternatives: ItemEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  get title() {
    return this.currentTranslation?.title || null
  }

  get titleSlug() {
    return this.currentTranslation?.titleSlug || null
  }

  get shortTitle() {
    return this.currentTranslation?.shortTitle || null
  }

  get description() {
    return this.currentTranslation?.description || null
  }

  get shortDescription() {
    return this.currentTranslation?.shortDescription || null
  }

  protected get currentTranslation(): ItemTranslationEntity {
    return this.translations?.length ? this.translations[0] : null
  }
}
