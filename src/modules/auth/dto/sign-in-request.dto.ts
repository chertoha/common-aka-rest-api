import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString } from 'class-validator'

export class SignInRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  email: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string
}
