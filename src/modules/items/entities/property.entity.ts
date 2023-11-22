import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'
import { PropertyTranslationEntity } from './property-translation.entity'
import { ItemEntity } from './item.entity'
import { ArticleEntity } from './article.entity'

@Entity({ name: 'properties' })
@Unique(['itemId', 'articleId', 'parentId', 'order'])
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => PropertyTranslationEntity, (translation) => translation.property)
  translations: PropertyTranslationEntity[]

  @Column({ name: 'title', nullable: true })
  _title: string

  @Column({ name: 'value', nullable: true })
  value: string

  @Column()
  order: number

  @Column({ nullable: true })
  itemId?: number

  @ManyToOne(() => ItemEntity, (item) => item.properties, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
  item?: ItemEntity

  @Column({ nullable: true })
  articleId?: number

  @ManyToOne(() => ArticleEntity, (article) => article.properties, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article?: ArticleEntity

  @Column({ nullable: true })
  parentId: number

  @ManyToOne(() => PropertyEntity, (property) => property.parentProperty, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parentProperty?: PropertyEntity

  @OneToMany(() => PropertyEntity, (property) => property.childrenProperties, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  childrenProperties?: PropertyEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  get title() {
    return this._title || this.currentTranslation?.title || null
  }

  protected get currentTranslation(): PropertyTranslationEntity {
    return this.translations?.length ? this.translations[0] : null
  }
}
