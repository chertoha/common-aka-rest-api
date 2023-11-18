import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { faker } from '@faker-js/faker'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'

@Injectable()
export class ArticleFactory extends BaseFactory<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    protected readonly repository: Repository<ArticleEntity>
  ) {
    super(repository)
  }

  get template(): Partial<ArticleEntity> {
    return {
      model3d: faker.internet.url(),
      pdf: faker.internet.url(),
      weight: faker.number.int({ min: 1, max: 999 }),
      weightUnit: 'g',
      price: faker.number.int({ min: 1, max: 999 })
    }
  }
}
