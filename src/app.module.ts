import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModuleOptions } from 'src/config'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => await config.get('db'),
      inject: [ConfigService]
    }),
    UsersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
