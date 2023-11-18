import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { faker } from '@faker-js/faker'
import * as slug from 'slug'
import { ItemTranslationEntity } from 'src/modules/items/entities/item-translation.entity'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

@Injectable()
export class ItemTranslationFactory extends BaseFactory<ItemTranslationEntity> {
  constructor(
    @InjectRepository(ItemTranslationEntity)
    protected readonly repository: Repository<ItemTranslationEntity>
  ) {
    super(repository)
  }

  get template(): Partial<ItemTranslationEntity> {
    const title = faker.lorem.word()

    return {
      title,
      titleSlug: slug(title, { locale: 'uk' }),
      shortTitle: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      shortDescription: faker.lorem.sentence(),
      language: LanguageEnum.UA
    }
  }
}
