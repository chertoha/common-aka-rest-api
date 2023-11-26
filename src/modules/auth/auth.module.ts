import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../users/entities/user.entity'
import { AuthGuard } from './guards/auth.guard'

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService) => await config.get('auth.jwtOptions'),
      inject: [ConfigService]
    })
  ],
  exports: [AuthGuard]
})
export class AuthModule {}
