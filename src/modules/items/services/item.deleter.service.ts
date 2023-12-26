import { Injectable } from '@nestjs/common'
import { ItemEntity } from '../entities/item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ItemFileManager } from './item-files-manager.service'

@Injectable()
export class ItemDeleterService {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>,
    protected readonly itemFileManager: ItemFileManager
  ) {}

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.itemRepository.delete(id)
    if (affected) {
      await this.itemFileManager.deleteItemFiles(id)
    }
    return affected > 0
  }
}
