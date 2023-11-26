import { Module } from '@nestjs/common'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { ArticleFactory } from './factories/article.factory'
import { BrandFactory } from './factories/brand.factory'
import { PropertyFactory } from './factories/property.factory'
import { PropertyTranslationFactory } from './factories/property-translation.factory'
import { ItemFactory } from './factories/item.factory'
import { ItemTranslationEntity } from 'src/modules/items/entities/item-translation.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ItemTranslationFactory } from './factories/item-translation.factory'
import { UserFactory } from './factories/user.factory'
import { UserEntity } from 'src/modules/users/entities/user.entity'

@Module({
  providers: [
    ArticleFactory,
    BrandFactory,
    PropertyFactory,
    PropertyTranslationFactory,
    ItemFactory,
    ItemTranslationFactory,
    UserFactory
  ],
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      BrandEntity,
      PropertyEntity,
      PropertyTranslationEntity,
      ItemEntity,
      ItemTranslationEntity,
      UserEntity
    ])
  ]
})
export class FactoryModule {}
