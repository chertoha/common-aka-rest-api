import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDefined, IsEnum, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'

export class CreatePropertyTranslation {
  @ApiProperty()
  @IsDefined()
  @IsEnum(LanguageEnum)
  language: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  title: string
}

export class CreatePropertyDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  value: string

  @ApiProperty()
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  order: number

  @ApiProperty({ type: () => CreatePropertyTranslation, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyTranslation)
  translations: CreatePropertyTranslation[]

  @ApiProperty({ type: () => OmitType(CreatePropertyDto, ['childrenProperties'] as const) })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => OmitType(CreatePropertyDto, ['childrenProperties'] as const))
  childrenProperties: Array<Omit<CreatePropertyDto, 'childrenProperties'>>
}
