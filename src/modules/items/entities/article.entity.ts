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
import { ItemEntity } from './item.entity'
import { PropertyEntity } from './property.entity'

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('json')
  tab: Record<string, unknown>

  @Column('json', { nullable: true })
  model3d?: string

  @Column('json', { nullable: true })
  pdf?: string

  @Column('float')
  price: number

  @Column('float', { nullable: true })
  discount?: number

  @Column('float')
  weight: number

  @Column()
  weightUnit: string

  @Column()
  itemId: number

  @ManyToOne(() => ItemEntity, (item) => item.articles)
  @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
  item: ItemEntity

  @OneToMany(() => PropertyEntity, (article) => article.item)
  properties: PropertyEntity[]

  @ManyToMany(() => ItemEntity)
  @JoinTable({
    name: 'item_alternatives',
    joinColumn: { name: 'itemId' },
    inverseJoinColumn: { name: 'alternativeId' }
  })
  alternatives: ItemEntity[]

  @ManyToMany(() => ItemEntity)
  @JoinTable({
    name: 'suitable_for_items',
    joinColumn: { name: 'itemId' },
    inverseJoinColumn: { name: 'suitableForId' }
  })
  suitableFor: ItemEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
