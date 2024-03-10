import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { type CreateBrandDto } from '../dto/create-brand.dto'
import { BrandDto } from '../dto/brand.dto'
import { BrandEntity } from '../entities/brand.entity'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'

@Injectable()
export class BrandCreatorService {
  constructor(
    @InjectRepository(BrandEntity)
    protected readonly repository: Repository<BrandEntity>
  ) {}

  public async create(brand: CreateBrandDto): Promise<BrandDto> {
    await this.checkNameUniqueness(brand.name)
    const brandEntity = await this.repository.save(this.repository.create(brand))
    return mapOneToDto(BrandDto, brandEntity)
  }

  protected async checkNameUniqueness(name: string): Promise<void> {
    const brand = await this.repository.findOne({ where: { name } })
    if (brand) {
      throw new BadRequestException('Brand with this name already exists')
    }
  }
}
