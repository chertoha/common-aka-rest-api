import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { ItemImageDto } from './item-image.dto'

export class AlternativeItemDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  titleSlug: string

  @ApiProperty()
  @Expose()
  shortTitle: string

  @ApiProperty()
  @Expose()
  description: string

  @ApiProperty()
  @Expose()
  shortDescription: string

  @ApiProperty({ type: () => ItemImageDto })
  @Expose()
  images: ItemImageDto

  @ApiProperty()
  @Expose()
  purchaseName: string

  @ApiProperty()
  @Expose()
  publicName: string

  @ApiProperty()
  @Expose()
  discount?: number

  @ApiProperty()
  @Expose()
  brandId: number

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date
}
