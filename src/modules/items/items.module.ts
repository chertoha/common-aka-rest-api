import { Module } from '@nestjs/common'
import { ItemEntity } from './entities/item.entity'
import { ItemTranslationEntity } from './entities/item-translation.entity'
import { PropertyEntity } from './entities/property.entity'
import { PropertyTranslationEntity } from './entities/property-translation.entity'
import { ArticleEntity } from './entities/article.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ItemsController } from './controllers/items.controller'
import { ItemListQuery } from './queries/item-list.query'
import { ItemQuery } from './queries/item.query'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemEntity,
      ItemTranslationEntity,
      PropertyEntity,
      PropertyTranslationEntity,
      ArticleEntity
    ])
  ],
  controllers: [ItemsController],
  providers: [ItemListQuery, ItemQuery]
})
export class ItemsModule {}
