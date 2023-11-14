import { Module } from '@nestjs/common'
import { ArticlesModule } from './sub-modules/articles/articles.module'

@Module({
  imports: [ArticlesModule]
})
export class ItemsModule {}
