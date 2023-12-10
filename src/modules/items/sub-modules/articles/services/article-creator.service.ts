import { Injectable } from '@nestjs/common'
import { type CreateArticleDto } from '../dto/create-article.dto'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { FilesService } from 'src/modules/files/services/files.service'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { join } from 'path'
import { type Nullable } from 'src/modules/common/types/nullable.type'
import { CreatedArticleResponseDto } from '../dto/created-article-response.dto'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'

export type CreatePayload = { itemId: number } & CreateArticleDto &
  Record<'model3d' | 'pdf', Nullable<Express.Multer.File>>

@Injectable()
export class ArticleCreatorService {
  constructor(
    protected readonly filesService: FilesService,
    @InjectRepository(ArticleEntity)
    protected readonly articleRepository: Repository<ArticleEntity>
  ) {}

  public async create({
    model3d,
    pdf,
    properties = [],
    ...articleProperties
  }: CreatePayload): Promise<CreatedArticleResponseDto> {
    return await this.articleRepository.manager.transaction(async (manager) => {
      const propertyRepository = manager.getRepository(PropertyEntity)
      const propertyTranslationRepository = manager.getRepository(PropertyTranslationEntity)

      const article = await this.articleRepository.save(
        this.articleRepository.create(articleProperties as Partial<ArticleEntity>)
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

      const basePath = join('item', String(articleProperties.itemId), 'articles', String(article.id))
      const model3dPath = await this.saveFile(basePath, model3d)
      const pdfPath = await this.saveFile(basePath, pdf)
      if (model3dPath || pdfPath) {
        await this.articleRepository.update({ id: article.id }, { model3d: model3dPath, pdf: pdfPath })
      }

      return await this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.properties', 'articleProperty')
        .leftJoinAndSelect(
          'properties',
          'articleChildrenProperty',
          '"articleChildrenProperty"."parentId" = articleProperty.id'
        )
        .leftJoinAndSelect('articleChildrenProperty.translations', 'articleChildrenPropertiesTranslation')
        .where('article.id = :id', { id: article.id })
        .getOne()
        .then((article) => mapOneToDto(CreatedArticleResponseDto, article))
    })
  }

  protected async saveFile(path: string, file: Nullable<Express.Multer.File>): Promise<string> {
    if (!file) {
      return null
    }
    const filePath = join(path, file.originalname)
    await this.filesService.save(file, filePath)
    return filePath
  }
}
