import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'brands' })
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @OneToMany(() => ItemEntity, (item) => item.brand)
  items: ItemEntity[]
}
