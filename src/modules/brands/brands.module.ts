import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { BrandListQuery } from './queries/brand-list.query'
import { BrandCreatorService } from './services/brand-creator.service'
import { BrandUpdaterService } from './services/brand-updater.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrandEntity } from './entities/brand.entity'

@Module({
  controllers: [BrandsController],
  providers: [BrandListQuery, BrandCreatorService, BrandUpdaterService],
  imports: [TypeOrmModule.forFeature([BrandEntity])]
})
export class BrandsModule {}
