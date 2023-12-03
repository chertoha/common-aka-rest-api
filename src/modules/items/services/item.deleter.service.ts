import { Injectable } from '@nestjs/common'
import { ItemEntity } from '../entities/item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ItemDeleterService {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>
  ) {}

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.itemRepository.delete(id)
    return affected > 0
  }
}
