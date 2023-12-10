import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { faker } from '@faker-js/faker'

@Injectable()
export class PropertyFactory extends BaseFactory<PropertyEntity> {
  constructor(
    @InjectRepository(PropertyEntity)
    protected readonly repository: Repository<PropertyEntity>
  ) {
    super(repository)
  }

  get template(): Partial<PropertyEntity> {
    return {
      order: faker.number.int({ min: 1, max: 1000 }),
      value: faker.lorem.word()
    }
  }
}
