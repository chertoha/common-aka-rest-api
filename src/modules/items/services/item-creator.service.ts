import { Injectable } from '@nestjs/common'
import { type CreateItemDto } from '../dto/create-item.dto'
import { FilesService } from 'src/modules/files/services/files.service'
import { join } from 'path'
import { ImagePreviewService } from 'src/modules/files/services/image-preview.service'
import { type PreviewConfig } from 'src/modules/files/types/preview-config.type'
import { ConfigService } from '@nestjs/config'
import { ItemEntity } from '../entities/item.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { type ImageLinkDto, type ItemImageDto } from '../dto/item-image.dto'
import { ItemTranslationEntity } from '../entities/item-translation.entity'
import { CreatedItemResponseDto } from '../dto/created-item-response.dto'
import { PropertyEntity } from '../entities/property.entity'
import { PropertyTranslationEntity } from '../entities/property-translation.entity'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'
import { type Nullable } from 'src/modules/common/types/nullable.type'

export type Payload = CreateItemDto & {
  files: {
    preview?: Nullable<Express.Multer.File>
    gallery?: Express.Multer.File[]
    drawings?: Express.Multer.File[]
  }
}

@Injectable()
export class ItemCreatorService {
  constructor(
    protected readonly filesService: FilesService,
    protected readonly previewService: ImagePreviewService,
    protected readonly configService: ConfigService,
    @InjectRepository(ItemEntity)
    protected readonly repository: Repository<ItemEntity>,
    @InjectRepository(PropertyEntity)
    protected readonly propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(PropertyTranslationEntity)
    protected readonly propertyTranslationRepository: Repository<PropertyTranslationEntity>
  ) {}

  public async create({
    files,
    alternatives,
    translations,
    properties = [],
    ...itemProperties
  }: Payload): Promise<CreatedItemResponseDto> {
    return await this.repository.manager.transaction(async (manager) => {
      const itemRepository = manager.getRepository(ItemEntity)
      const itemTranslationRepository = manager.getRepository(ItemTranslationEntity)
      const propertyRepository = manager.getRepository(PropertyEntity)
      const propertyTranslationRepository = manager.getRepository(PropertyTranslationEntity)

      const translationEntities = translations.map((translation) => itemTranslationRepository.create(translation))
      const item = await itemRepository.save(
        itemRepository.create({
          ...itemProperties,
          images: {},
          translations: translationEntities
        })
      )

      if (alternatives?.length) {
        await manager
          .createQueryBuilder()
          .insert()
          .into('item_alternatives')
          .values(alternatives.map((alternativeId) => ({ alternativeId, itemId: item.id })))
          .execute()
      }

      for (const { translations, childrenProperties = [], ...property } of properties) {
        const propertyEntity = await propertyRepository.save(
          propertyRepository.create({ ...property, itemId: item.id } as Partial<PropertyEntity>)
        )
        for (const { translations, ...property } of childrenProperties) {
          const childrenPropertyEntity = await propertyRepository.save(
            propertyRepository.create({ ...property, parentId: propertyEntity.id } as Partial<PropertyEntity>)
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

      const images = await this.storeFiles(files, item.id)
      await itemRepository.update({ id: item.id }, { images })

      return await itemRepository
        .createQueryBuilder('item')
        .innerJoinAndSelect('item.translations', 'itemTranslation')
        .leftJoinAndSelect('item.articles', 'article')
        .leftJoinAndSelect('article.properties', 'articleProperty')
        .leftJoinAndSelect(
          'properties',
          'articleChildrenProperty',
          '"articleChildrenProperty"."parentId" = articleProperty.id'
        )
        .leftJoinAndSelect('articleChildrenProperty.translations', 'articleChildrenPropertiesTranslation')
        .leftJoinAndSelect('item.properties', 'itemProperty')
        .leftJoinAndSelect('itemProperty.translations', 'itemPropertyTranslation')
        .leftJoinAndSelect(
          'properties',
          'itemChildrenProperty',
          '"itemProperty".id = "itemChildrenProperty"."parentId"'
        )
        .leftJoinAndSelect('itemChildrenProperty.translations', 'itemChildrenPropertyTranslation')
        .andWhere('item.id = :id', { id: item.id })
        .getOne()
        .then((item) => {
          return mapOneToDto(CreatedItemResponseDto, item)
        })
    })
  }

  protected async storeFiles(files: Payload['files'], itemId: number): Promise<ItemImageDto> {
    const { preview, gallery, drawings } = files

    const previewsConfig = this.configService.get('previews.item')
    const previewPath = await this.storeFile(
      preview,
      join('item', String(itemId), preview.originalname),
      previewsConfig.preview
    )
    const galleryPaths = await Promise.all(
      gallery?.map(
        async (file, index) =>
          await this.storeFile(
            file,
            join('item', String(itemId), 'gallery', String(index), file.originalname),
            previewsConfig.gallery
          )
      )
    )
    const drawingsPaths = await Promise.all(
      drawings?.map(
        async (file, index) =>
          await this.storeFile(
            file,
            join('item', String(itemId), 'drawings', String(index), file.originalname),
            previewsConfig.drawings
          )
      )
    )

    return {
      preview: previewPath,
      gallery: galleryPaths,
      drawings: drawingsPaths
    }
  }

  protected async storeFile(
    file: Nullable<Express.Multer.File>,
    path: string,
    config: PreviewConfig
  ): Promise<ImageLinkDto> {
    if (!file) {
      return { url: null, thumbnail: null, mobileThumbnail: null }
    }
    await this.filesService.save(file, path)
    const previews = this.previewService.generatePreview<'thumbnail' | 'mobileThumbnail'>(path, config)

    return { url: path, ...previews }
  }
}
