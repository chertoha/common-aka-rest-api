import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreatePropertyDto } from './create-property.dto'
import { CreateItemTranslationDto } from './item-translation.dto'

export class UpdateItemDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  purchaseName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  publicName: string

  @ApiProperty()
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  brandId: number

  @ApiProperty({ isArray: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  alternatives: number[]

  @ApiProperty({ type: () => CreateItemTranslationDto, isArray: true })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CreateItemTranslationDto)
  @ValidateNested({ each: true })
  translations: CreateItemTranslationDto[]

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => CreatePropertyDto)
  @ValidateNested({ each: true })
  properties: CreatePropertyDto[]
}
