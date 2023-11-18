import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  translations: ItemTranslationEntity

  @OneToMany(() => ArticleEntity, (article) => article.item)
  articles: ArticleEntity[]

  @OneToMany(() => PropertyEntity, (article) => article.item)
  properties: PropertyEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  get title() {
    return this.translations[0]?.title || null
  }

  get titleSlug() {
    return this.translations[0]?.titleSlug || null
  }

  get shortTitle() {
    return this.translations[0]?.shortTitle || null
  }

  get description() {
    return this.translations[0]?.description || null
  }

  get shortDescription() {
    return this.translations[0]?.shortDescription || null
  }
}
