import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from '../../entities/article.entity'
import { ArticleCreatorService } from './services/article-creator.service'
import { ArticlesController } from './controllers/articles.controller'
import { FilesModule } from 'src/modules/files/files.module'
import { ArticleDeleterService } from './services/article-deleter.service'
import { ArticleUpdaterService } from './services/article-updater-service'
import { ArticleQuery } from './queries/article.query'
import { ArticleFilesManagerService } from './services/article-files-manager.service'

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([ArticleEntity])],
  providers: [
    ArticleFilesManagerService,
    ArticleCreatorService,
    ArticleUpdaterService,
    ArticleDeleterService,
    ArticleQuery
  ],
  controllers: [ArticlesController]
})
export class ArticlesModule {}
