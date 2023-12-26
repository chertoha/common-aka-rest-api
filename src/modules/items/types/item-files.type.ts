import { type Nullable } from 'src/modules/common/types/nullable.type'

export interface ItemFiles {
  preview?: Nullable<Express.Multer.File>
  gallery?: Express.Multer.File[]
  drawings?: Express.Multer.File[]
}
