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
import { AuthModule } from '../auth/auth.module'
import { ItemDeleterService } from './services/item.deleter.service'
import { FilesModule } from '../files/files.module'
import { ItemCreatorService } from './services/item-creator.service'
import { ArticlesModule } from './sub-modules/articles/articles.module'

@Module({
  imports: [
    ArticlesModule,
    AuthModule,
    FilesModule,
    TypeOrmModule.forFeature([
      ItemEntity,
      ItemTranslationEntity,
      PropertyEntity,
      PropertyTranslationEntity,
      ArticleEntity
    ])
  ],
  controllers: [ItemsController],
  providers: [ItemListQuery, ItemQuery, ItemCreatorService, ItemDeleterService]
})
export class ItemsModule {}
