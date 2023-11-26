import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { type SignInRequestDto } from '../dto/sign-in-request.dto'
import { type SignInResponseDto } from '../dto/sign-in-response.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepository: Repository<UserEntity>,
    protected readonly jwtService: JwtService
  ) {}

  public async signIn({ email, password }: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user || !(await this.validatePassword(password, user.password))) {
      throw new UnauthorizedException()
    }

    return await this.generateToken(user)
  }

  protected async generateToken(user: UserEntity): Promise<SignInResponseDto> {
    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email })
    return { accessToken }
  }

  protected async validatePassword(rawPassword: string, hash: string): Promise<boolean> {
    return await argon.verify(hash, rawPassword)
  }
}
