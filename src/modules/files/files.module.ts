import { Module } from '@nestjs/common'
import { FilesService } from './services/files.service'
import { ImagePreviewService } from './services/image-preview.service'

@Module({
  providers: [FilesService, ImagePreviewService],
  exports: [FilesService, ImagePreviewService]
})
export class FilesModule {}
