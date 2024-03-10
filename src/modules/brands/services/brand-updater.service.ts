import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { BrandDto } from '../dto/brand.dto'
import { BrandEntity } from '../entities/brand.entity'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'
import { type UpdateBrandDto } from '../dto/update-brand.dto'

export type BrandUpdatePayload = { id: number } & UpdateBrandDto

@Injectable()
export class BrandUpdaterService {
  constructor(
    @InjectRepository(BrandEntity)
    protected readonly repository: Repository<BrandEntity>
  ) {}

  public async update({ id, name }: BrandUpdatePayload): Promise<BrandDto> {
    await this.checkNameUniqueness(id, name)
    const brandEntity = await this.repository.findOne({ where: { id } })
    brandEntity.name = name
    await this.repository.save(brandEntity)
    return mapOneToDto(BrandDto, brandEntity)
  }

  protected async checkNameUniqueness(id: number, name: string): Promise<void> {
    const brand = await this.repository.findOne({ where: { name, id: Not(id) } })
    if (brand) {
      throw new BadRequestException('Brand with this name already exists')
    }
  }
}
