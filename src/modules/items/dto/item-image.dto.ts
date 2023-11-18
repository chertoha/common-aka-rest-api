import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'

export class ImageLinkDto {
  @ApiProperty()
  @Expose()
  url: string

  @ApiProperty()
  @Expose()
  thumbnail: string
}
export class ItemImageDto {
  @ApiProperty()
  preview: string

  @ApiProperty({ type: () => ImageLinkDto })
  @Expose()
  @Type(() => ImageLinkDto)
  gallery: ImageLinkDto[]

  @ApiProperty({ type: () => ImageLinkDto })
  @Expose()
  @Type(() => ImageLinkDto)
  drawings: ImageLinkDto[]
}
