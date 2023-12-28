import { Injectable } from '@nestjs/common'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ArticleFilesManagerService } from './article-files-manager.service'

export interface DeletePayload {
  itemId: number
  articleId: number
}

@Injectable()
export class ArticleDeleterService {
  constructor(
    @InjectRepository(ArticleEntity)
    protected readonly articleRepository: Repository<ArticleEntity>,
    protected readonly articleFilesManagerService: ArticleFilesManagerService
  ) {}

  public async delete({ articleId, itemId }: DeletePayload): Promise<boolean> {
    const { affected } = await this.articleRepository.delete({ id: articleId, itemId })
    if (affected) {
      await this.articleFilesManagerService.deleteArticleFiles(itemId, articleId)
    }
    return affected > 0
  }
}
