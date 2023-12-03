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
import { type CreateItemResponseDto } from '../dto/created-item-response.dto'

export type Payload = CreateItemDto & {
  files: {
    preview?: Express.Multer.File
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
    protected readonly repository: Repository<ItemEntity>
  ) {}

  public async create({
    files,
    alternatives,
    translations,
    ...itemProperties
  }: Payload): Promise<CreateItemResponseDto> {
    return await this.repository.manager.transaction(async (manager) => {
      const itemRepository = manager.getRepository(ItemEntity)
      const itemTranslationRepository = manager.getRepository(ItemTranslationEntity)
      const translationEntities = translations.map((translation) => itemTranslationRepository.create(translation))
      const item = await itemRepository.save(
        itemRepository.create({ ...itemProperties, images: {}, translations: translationEntities })
      )

      if (alternatives?.length) {
        await manager
          .createQueryBuilder()
          .insert()
          .into('item_alternatives')
          .values(alternatives.map((alternativeId) => ({ alternativeId, itemId: item.id })))
          .execute()
      }

      const images = await this.storeFiles(files, item.id)
      await itemRepository.update({ id: item.id }, { images })

      return await itemRepository.findOne({
        where: { id: item.id },
        relations: ['translations']
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

  protected async storeFile(file: Express.Multer.File, path: string, config: PreviewConfig): Promise<ImageLinkDto> {
    await this.filesService.save(file, path)
    const previews = this.previewService.generatePreview<'thumbnail' | 'mobileThumbnail'>(path, config)

    return { url: path, ...previews }
  }
}
