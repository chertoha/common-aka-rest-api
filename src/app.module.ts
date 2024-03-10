import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModuleOptions } from 'src/config'
import { UsersModule } from './modules/users/users.module'
import { ItemsModule } from './modules/items/items.module'
import { BrandsModule } from './modules/brands/brands.module'
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './modules/common/pipes/validation.pipe'
import { AuthModule } from './modules/auth/auth.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { SeedModule } from './database/seeds/seed.module'

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => await config.get('db'),
      inject: [ConfigService]
    }),
    UsersModule,
    ItemsModule,
    BrandsModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public'
    }),
    SeedModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe()
    }
  ]
})
export class AppModule {}
