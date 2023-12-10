import { Injectable } from '@nestjs/common'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

export interface DeletePayload {
  itemId: number
  articleId: number
}

@Injectable()
export class ArticleDeleterService {
  constructor(
    @InjectRepository(ArticleEntity)
    protected readonly articleRepository: Repository<ArticleEntity>
  ) {}

  public async delete({ articleId, itemId }: DeletePayload): Promise<boolean> {
    const { affected } = await this.articleRepository.delete({ id: articleId, itemId })

    return affected > 0
  }
}
