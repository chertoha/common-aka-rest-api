import { Module } from '@nestjs/common'
import { ArticleFactory } from './article.factory'
import { BrandFactory } from './brand.factory'
import { PropertyFactory } from './property.factory'
import { PropertyTranslationFactory } from './property-translation.factory'
import { ItemFactory } from './item.factory'
import { ItemTranslationEntity } from 'src/modules/items/entities/item-translation.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { ItemTranslationFactory } from './item-translation.factory'

@Module({
  providers: [
    ArticleFactory,
    BrandFactory,
    PropertyFactory,
    PropertyTranslationFactory,
    ItemFactory,
    ItemTranslationFactory
  ],
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      BrandEntity,
      PropertyEntity,
      PropertyTranslationEntity,
      ItemEntity,
      ItemTranslationEntity
    ])
  ]
})
export class FactoryModule {}
