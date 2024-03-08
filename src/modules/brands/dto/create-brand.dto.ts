import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString } from 'class-validator'

export class CreateBrandDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string
}
