import { Injectable } from '@nestjs/common'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { ArticleFilesManagerService } from './article-files-manager.service'
import { type ArticleFiles } from 'src/modules/items/types/article-files.type'
import { type UpdateArticleDto } from '../dto/update-article.dto'

export type UpdatePayload = { articleId: number; itemId: number } & UpdateArticleDto & ArticleFiles

@Injectable()
export class ArticleUpdaterService {
  constructor(
    @InjectRepository(ArticleEntity)
    protected readonly articleRepository: Repository<ArticleEntity>,
    protected readonly articleFilesManagerService: ArticleFilesManagerService
  ) {}

  public async update({
    itemId,
    articleId,
    model3d,
    pdf,
    properties = [],
    ...articleProperties
  }: UpdatePayload): Promise<ArticleEntity> {
    return await this.articleRepository.manager.transaction(async (manager) => {
      const articleRepository = manager.getRepository(ArticleEntity)
      const propertyRepository = manager.getRepository(PropertyEntity)
      const propertyTranslationRepository = manager.getRepository(PropertyTranslationEntity)

      const article = await articleRepository.findOneOrFail({ where: { id: articleId } })

      await propertyRepository.delete({ articleId: article.id })
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

      await this.articleFilesManagerService.deleteArticleFiles(itemId, articleId)
      const files = await this.articleFilesManagerService.storeFiles({ model3d, pdf, articleId, itemId })
      return await articleRepository.save(articleRepository.merge(article, articleProperties, files))
    })
  }
}
