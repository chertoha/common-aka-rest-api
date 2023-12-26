import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs/promises'
import { parse, join } from 'path'

@Injectable()
export class FilesService {
  protected readonly logger: Logger = new Logger(FilesService.name)

  constructor(protected readonly config: ConfigService) {}

  public async save(file: Express.Multer.File, path: string): Promise<string> {
    const fullPath = join(this.config.get('files.publicDir'), path)
    const { dir } = parse(fullPath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(fullPath, file.buffer)
    return fullPath
  }

  public async deleteDir(path: string): Promise<boolean> {
    try {
      const fullPath = join(this.config.get('files.publicDir'), path)
      await fs.rm(fullPath, { recursive: true })
      return true
    } catch (error) {
      this.logger.error(`Error during deleting ${path} dir`)
      this.logger.error(error)
      return false
    }
  }
}
