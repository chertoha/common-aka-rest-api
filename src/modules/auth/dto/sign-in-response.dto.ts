import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class SignInResponseDto {
  @ApiProperty()
  @Expose()
  accessToken: string
}
