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
import { PropertyTranslationEntity } from './property-translation.entity'
import { ItemEntity } from './item.entity'
import { ArticleEntity } from './article.entity'

@Entity({ name: 'properties' })
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => PropertyTranslationEntity, (translation) => translation.property)
  translations: PropertyTranslationEntity

  @Column()
  itemId?: number

  @ManyToOne(() => ItemEntity, (item) => item.properties, { nullable: true })
  @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
  item?: ItemEntity

  @Column()
  articleId?: number

  @ManyToOne(() => ArticleEntity, (article) => article.properties, {
    nullable: true
  })
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article?: ArticleEntity

  @Column({ nullable: true })
  parentId: number

  @ManyToOne(() => PropertyEntity, (property) => property.parentProperty, {
    nullable: true
  })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parentProperty?: PropertyEntity

  @OneToMany(() => PropertyEntity, (property) => property.childrenProperties, {
    nullable: true
  })
  childrenProperties?: PropertyEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  get title() {
    return this.translations[0]?.title || null
  }
}
