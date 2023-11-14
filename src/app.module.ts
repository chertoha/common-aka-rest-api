import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModuleOptions } from 'src/config'
import { UsersModule } from './modules/users/users.module'
import { ItemsModule } from './modules/items/items.module'
import { BrandsModule } from './modules/brands/brands.module'

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => await config.get('db'),
      inject: [ConfigService]
    }),
    UsersModule,
    ItemsModule,
    BrandsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
