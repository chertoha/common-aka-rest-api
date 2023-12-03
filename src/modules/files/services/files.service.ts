import { Injectable, type Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs/promises'
import { parse, join } from 'path'

@Injectable()
export class FilesService {
  protected readonly logger: Logger
  constructor(protected readonly config: ConfigService) {}

  public async save(file: Express.Multer.File, path: string): Promise<string> {
    const fullPath = join(this.config.get('files.publicDir'), path)
    const { dir } = parse(fullPath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(fullPath, file.buffer)
    return fullPath
  }
}
