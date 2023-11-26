import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { faker } from '@faker-js/faker'

@Injectable()
export class BrandFactory extends BaseFactory<BrandEntity> {
  constructor(
    @InjectRepository(BrandEntity)
    protected readonly brandRepository: Repository<BrandEntity>
  ) {
    super(brandRepository)
  }

  get template(): Partial<BrandEntity> {
    return {
      name: faker.company.name()
    }
  }
}
