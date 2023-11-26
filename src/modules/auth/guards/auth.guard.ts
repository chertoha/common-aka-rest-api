import { type CanActivate, type ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { type Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  protected readonly logger = new Logger(AuthGuard.name)

  constructor(
    protected readonly jwtService: JwtService,
    protected readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    try {
      const payload = await this.jwtService.verifyAsync(token)
      request.user = payload
    } catch (e) {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException()
    }
    return token
  }
}
