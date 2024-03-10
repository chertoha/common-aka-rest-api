import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString } from 'class-validator'

export class UpdateBrandDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string
}
