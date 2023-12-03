import { Injectable, Logger } from '@nestjs/common'
import { type PreviewConfig } from '../types/preview-config.type'
import * as sharp from 'sharp'
import { parse, join } from 'path'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ImagePreviewService {
  protected readonly logger = new Logger(ImagePreviewService.name)

  constructor(protected readonly config: ConfigService) {}

  public generatePreview<T extends string>(path: string, config: PreviewConfig): { [key in T]: string } {
    return Object.entries(config).reduce<{ [key in T]: string }>(
      (previews, [name, { width, height }]) => {
        const previewPath = this.buildPreviewPath(path, name)

        sharp(this.buildFullPath(path))
          .resize(width, height)
          .toFile(this.buildFullPath(previewPath), (err, info) => {
            if (err) {
              this.logger.error(err)
            } else {
              this.logger.log(info)
            }
          })

        return { ...previews, [name]: previewPath }
      },
      {} as { [key in T]: string }
    )
  }

  protected buildPreviewPath(path: string, previewName: string): string {
    const { name, dir, ext } = parse(path)
    return join(dir, `${name}-${previewName}${ext}`)
  }

  protected buildFullPath(path: string): string {
    return join(this.config.get('files.publicDir'), path)
  }
}
