import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { faker } from '@faker-js/faker'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

@Injectable()
export class PropertyTranslationFactory extends BaseFactory<PropertyTranslationEntity> {
  constructor(
    @InjectRepository(PropertyTranslationEntity)
    protected readonly repository: Repository<PropertyTranslationEntity>
  ) {
    super(repository)
  }

  get template(): Partial<PropertyTranslationEntity> {
    return {
      title: faker.lorem.word(),
      language: LanguageEnum.UA
    }
  }
}
