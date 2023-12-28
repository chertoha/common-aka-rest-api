import { type DatabaseQuery } from 'src/modules/common/interfaces/database-query.interface'
import { ArticleResponseDto } from '../dto/article-response.dto'
import { Injectable } from '@nestjs/common'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

export interface ArticleQueryParams {
  articleId: number
  itemId: number
}

@Injectable()
export class ArticleQuery implements DatabaseQuery<ArticleQueryParams, ArticleResponseDto> {
  constructor(
    @InjectRepository(ArticleEntity)
    protected readonly articleRepository: Repository<ArticleEntity>
  ) {}

  public async fetch({ articleId, itemId }: ArticleQueryParams): Promise<ArticleResponseDto> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.properties', 'articleProperty')
      .leftJoinAndSelect('articleProperty.translations', 'articlePropertyTranslations')
      .leftJoinAndSelect(
        'properties',
        'articleChildrenProperty',
        '"articleChildrenProperty"."parentId" = articleProperty.id'
      )
      .leftJoinAndSelect('articleChildrenProperty.translations', 'articleChildrenPropertiesTranslation')
      .where('article.itemId = :itemId', { itemId })
      .andWhere('article.id = :articleId', { articleId })
      .getOneOrFail()

    return mapOneToDto(ArticleResponseDto, article)
  }
}
