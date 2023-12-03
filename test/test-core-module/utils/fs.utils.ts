import * as fs from 'fs/promises'

export async function cleanDirectory(path: string): Promise<void> {
  await fs.rmdir(path, { recursive: true })
  await fs.mkdir(path, { recursive: true })
}
