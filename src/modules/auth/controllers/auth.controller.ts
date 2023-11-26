import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { SignInRequestDto } from '../dto/sign-in-request.dto'
import { type SignInResponseDto } from '../dto/sign-in-response.dto'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(protected readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  public async signIn(@Body() payload: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(payload)
  }
}
