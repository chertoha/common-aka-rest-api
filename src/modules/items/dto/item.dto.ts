import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ItemImageDto } from './item-image.dto'
import { ArticleDto } from './article.dto'
import { PropertyDto } from './property.dto'
import { AlternativeItemDto } from './alternative-item.dto'

export class ItemDto {
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

  @ApiProperty({ type: () => ArticleDto, isArray: true })
  @Expose()
  @Type(() => ArticleDto)
  articles: ArticleDto[]

  @ApiProperty({ type: () => PropertyDto, isArray: true })
  @Expose()
  @Expose()
  @Type(() => PropertyDto)
  properties: PropertyDto[]

  @ApiProperty({ type: () => AlternativeItemDto, isArray: true })
  @Expose()
  @Type(() => AlternativeItemDto)
  alternatives: AlternativeItemDto[]

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date
}
