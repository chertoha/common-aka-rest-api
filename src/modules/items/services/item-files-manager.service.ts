import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type Nullable } from 'src/modules/common/types/nullable.type'
import { FilesService } from 'src/modules/files/services/files.service'
import { ImagePreviewService } from 'src/modules/files/services/image-preview.service'
import { type PreviewConfig } from 'src/modules/files/types/preview-config.type'
import { type ImageLinkDto, type ItemImageDto } from '../dto/item-image.dto'
import { type ItemFiles } from '../types/item-files.type'
import { join } from 'path'

@Injectable()
export class ItemFileManager {
  constructor(
    protected readonly filesService: FilesService,
    protected readonly previewService: ImagePreviewService,
    protected readonly configService: ConfigService
  ) {}

  public async storeFiles(files: ItemFiles, itemId: number): Promise<ItemImageDto> {
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

  public async deleteItemFiles(itemId: number): Promise<void> {
    await this.filesService.deleteDir(join('item', String(itemId)))
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
