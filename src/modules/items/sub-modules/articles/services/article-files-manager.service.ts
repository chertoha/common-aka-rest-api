import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { type Nullable } from 'src/modules/common/types/nullable.type'
import { FilesService } from 'src/modules/files/services/files.service'
import { type ArticleFiles } from 'src/modules/items/types/article-files.type'

export type ArticleStorePayload = ArticleFiles & { articleId: number; itemId: number }

@Injectable()
export class ArticleFilesManagerService {
  constructor(protected readonly filesService: FilesService) {}

  public async storeFiles({
    pdf,
    model3d,
    itemId,
    articleId
  }: ArticleStorePayload): Promise<Record<'model3d' | 'pdf', string>> {
    const basePath = join('item', String(itemId), 'articles', String(articleId))
    const model3dPath = await this.saveFile(basePath, model3d)
    const pdfPath = await this.saveFile(basePath, pdf)

    return { model3d: model3dPath, pdf: pdfPath }
  }

  public async deleteArticleFiles(itemId: number, articleId: number): Promise<void> {
    await this.filesService.deleteDir(join('item', String(itemId), 'article', String(articleId)))
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
