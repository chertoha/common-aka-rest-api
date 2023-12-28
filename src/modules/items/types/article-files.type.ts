import { type Nullable } from 'src/modules/common/types/nullable.type'

export type ArticleFiles = Record<'model3d' | 'pdf', Nullable<Express.Multer.File>>
