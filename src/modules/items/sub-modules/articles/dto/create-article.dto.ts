import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDefined, IsInt, IsNumber, IsOptional, IsPositive, ValidateNested } from 'class-validator'
import { CreatePropertyDto } from 'src/modules/items/dto/create-property.dto'

export class CreateArticleDto {
  @ApiProperty()
  @IsDefined()
  name: string

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  discount: number

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  weight: number

  @ApiProperty()
  @IsDefined()
  weightUnit: string

  @ApiProperty({ type: () => CreatePropertyDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => CreatePropertyDto)
  @ValidateNested({ each: true })
  properties: CreatePropertyDto[]
}
