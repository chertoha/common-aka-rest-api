import { ApiProperty } from '@nestjs/swagger'
import { ItemImages } from '../types/item-images.type'

export class ItemListItemDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty()
  shortTitle: string

  @ApiProperty()
  description: string

  @ApiProperty()
  shortDescription: string

  @ApiProperty()
  images: ItemImages

  @ApiProperty()
  purchaseName: string

  @ApiProperty()
  publicName: string

  @ApiProperty()
  discount?: number

  @ApiProperty()
  brandId: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class ItemListDto {
  @ApiProperty({ type: () => ItemListDto, isArray: true })
  data: ItemListItemDto[]

  @ApiProperty()
  page: number

  @ApiProperty()
  perPage: number

  @ApiProperty()
  total: number
}
