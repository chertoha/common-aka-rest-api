import { Injectable } from '@nestjs/common'
import { type DatabaseQuery } from 'src/modules/common/interfaces/database-query.interface'
import { BrandEntity } from '../entities/brand.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { mapManyToDto } from 'src/modules/common/utils/serialization.utils'
import { BrandDto } from '../dto/brand.dto'
import { type BrandListResponseDto } from '../dto/brand-list-response.dto'

@Injectable()
export class BrandListQuery implements DatabaseQuery<Record<string, unknown>, BrandListResponseDto> {
  constructor(
    @InjectRepository(BrandEntity)
    protected readonly repository: Repository<BrandEntity>
  ) {}

  public async fetch(): Promise<BrandListResponseDto> {
    const brands = await this.repository.find({ order: { name: 'ASC' } })

    return {
      data: mapManyToDto(BrandDto, brands)
    }
  }
}
