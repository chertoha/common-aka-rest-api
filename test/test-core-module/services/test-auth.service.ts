import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { type UserEntity } from 'src/modules/users/entities/user.entity'

@Injectable()
export class TestAuthService {
  constructor(protected readonly jwtService: JwtService) {}

  public generateToken(user: UserEntity): string {
    const payload = { sub: user.id, email: user.email }
    return `Bearer ${this.jwtService.sign(payload)}`
  }
}
