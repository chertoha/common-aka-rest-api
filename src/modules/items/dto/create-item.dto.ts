import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { Type } from 'class-transformer'

export class ItemTranslationDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  title: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  titleSlug: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  shortTitle: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  description: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  shortDescription: string

  @ApiProperty()
  @IsDefined()
  @IsEnum(LanguageEnum)
  language: LanguageEnum
}

export class CreateItemDto {
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

  @ApiProperty({ type: () => ItemTranslationDto, isArray: true })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => ItemTranslationDto)
  @ValidateNested({ each: true })
  translations: ItemTranslationDto[]
}
