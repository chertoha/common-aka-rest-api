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
import { ItemEntity } from './item.entity'
import { PropertyEntity } from './property.entity'

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('text', { nullable: true })
  model3d?: string

  @Column('text', { nullable: true })
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

  @ManyToOne(() => ItemEntity, (item) => item.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId', referencedColumnName: 'id' })
  item: ItemEntity

  @OneToMany(() => PropertyEntity, (article) => article.item)
  properties: PropertyEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
