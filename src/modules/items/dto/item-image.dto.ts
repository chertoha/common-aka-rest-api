import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsString } from 'class-validator'

export class ImageLinkDto {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  url: string

  @ApiProperty()
  @Expose()
  thumbnail: string
}
export class ItemImageDto {
  @ApiProperty()
  preview: ImageLinkDto

  @ApiProperty({ type: () => ImageLinkDto })
  @Expose()
  @Type(() => ImageLinkDto)
  gallery: ImageLinkDto[]

  @ApiProperty({ type: () => ImageLinkDto })
  @Expose()
  @Type(() => ImageLinkDto)
  drawings: ImageLinkDto[]
}
