import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { faker } from '@faker-js/faker'
import { ItemEntity } from 'src/modules/items/entities/item.entity'

@Injectable()
export class ItemFactory extends BaseFactory<ItemEntity> {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly brandRepository: Repository<ItemEntity>
  ) {
    super(brandRepository)
  }

  get template(): Partial<ItemEntity> {
    return {
      publicName: faker.lorem.word(),
      purchaseName: faker.lorem.word(),
      images: {
        preview: { url: faker.image.url(), thumbnail: faker.image.url() },
        gallery: [],
        drawings: []
      }
    }
  }
}
