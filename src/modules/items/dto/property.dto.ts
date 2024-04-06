import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'

export class PropertyDto {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  value: string

  @ApiProperty()
  @Expose()
  order: number

  @ApiProperty({ type: () => OmitType(PropertyDto, ['childrenProperties']), isArray: true })
  @Expose()
  @Type(() => PropertyDto)
  childrenProperties: Array<Omit<PropertyDto, 'childrenProperties'>>
}
