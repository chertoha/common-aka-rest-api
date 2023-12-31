import { Injectable } from '@nestjs/common'
import { type CreateArticleDto } from '../dto/create-article.dto'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { type Nullable } from 'src/modules/common/types/nullable.type'
import { ArticleFilesManagerService } from './article-files-manager.service'

export type CreatePayload = { itemId: number } & CreateArticleDto &
  Record<'model3d' | 'pdf', Nullable<Express.Multer.File>>

@Injectable()
export class ArticleCreatorService {
  constructor(
    @InjectRepository(ArticleEntity)
    protected readonly articleRepository: Repository<ArticleEntity>,
    protected readonly articleFilesManagerService: ArticleFilesManagerService
  ) {}

  public async create({ model3d, pdf, properties = [], ...articleProperties }: CreatePayload): Promise<ArticleEntity> {
    return await this.articleRepository.manager.transaction(async (manager) => {
      const articleRepository = manager.getRepository(ArticleEntity)
      const propertyRepository = manager.getRepository(PropertyEntity)
      const propertyTranslationRepository = manager.getRepository(PropertyTranslationEntity)

      const article = await articleRepository.save(
        articleRepository.create(articleProperties as Partial<ArticleEntity>)
      )
      for (const { translations, childrenProperties = [], ...property } of properties) {
        const propertyEntity = await propertyRepository.save(
          propertyRepository.create({ ...property, articleId: article.id })
        )
        for (const { translations, ...property } of childrenProperties) {
          const childrenPropertyEntity = await propertyRepository.save(
            propertyRepository.create(property as Partial<PropertyEntity>)
          )
          await propertyTranslationRepository.save(
            translations.map((translation) =>
              propertyTranslationRepository.create({
                ...translation,
                propertyId: childrenPropertyEntity.id
              } as Partial<PropertyTranslationEntity>)
            )
          )
        }
        await propertyTranslationRepository.save(
          translations.map((translation) =>
            propertyTranslationRepository.create({
              ...translation,
              propertyId: propertyEntity.id
            } as Partial<PropertyTranslationEntity>)
          )
        )
      }

      const files = await this.articleFilesManagerService.storeFiles({
        model3d,
        pdf,
        itemId: articleProperties.itemId,
        articleId: article.id
      })
      if (files.model3d || files.pdf) {
        return await articleRepository.save(articleRepository.merge(article, files))
      }

      return article
    })
  }
}
