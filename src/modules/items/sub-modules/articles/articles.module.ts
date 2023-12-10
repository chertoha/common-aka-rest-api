import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from '../../entities/article.entity'
import { ArticleCreatorService } from './services/article-creator.service'
import { ArticlesController } from './controllers/articles.controller'
import { FilesModule } from 'src/modules/files/files.module'
import { ArticleDeleterService } from './services/article-deleter.service'

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([ArticleEntity])],
  providers: [ArticleCreatorService, ArticleDeleterService],
  controllers: [ArticlesController]
})
export class ArticlesModule {}
