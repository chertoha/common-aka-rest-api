import { Injectable } from '@nestjs/common'
import { ItemEntity } from '../entities/item.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ItemTranslationEntity } from '../entities/item-translation.entity'
import { PropertyEntity } from '../entities/property.entity'
import { PropertyTranslationEntity } from '../entities/property-translation.entity'
import { type ItemFiles } from '../types/item-files.type'
import { ItemFileManager } from './item-files-manager.service'
import { type UpdateItemDto } from '../dto/update-item.dto'

export type Payload = UpdateItemDto & { itemId: number; files: ItemFiles }

@Injectable()
export class ItemUpdaterService {
  constructor(
    protected readonly itemFileManager: ItemFileManager,
    @InjectRepository(ItemEntity)
    protected readonly repository: Repository<ItemEntity>,
    @InjectRepository(PropertyEntity)
    protected readonly propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(PropertyTranslationEntity)
    protected readonly propertyTranslationRepository: Repository<PropertyTranslationEntity>
  ) {}

  public async update({
    itemId,
    files,
    alternatives,
    translations,
    properties = [],
    ...itemProperties
  }: Payload): Promise<ItemEntity> {
    return await this.repository.manager.transaction(async (manager) => {
      const itemRepository = manager.getRepository(ItemEntity)
      const itemTranslationRepository = manager.getRepository(ItemTranslationEntity)
      const propertyRepository = manager.getRepository(PropertyEntity)
      const propertyTranslationRepository = manager.getRepository(PropertyTranslationEntity)

      const item = await itemRepository.findOneOrFail({ where: { id: itemId } })

      await itemTranslationRepository.delete({ itemId })
      await propertyRepository.delete({ itemId })
      await manager
        .createQueryBuilder()
        .delete()
        .from('item_alternatives')
        .where('itemId = :itemId', { itemId })
        .execute()

      const translationEntities = translations.map((translation) => itemTranslationRepository.create(translation))
      const updatedItem = await itemRepository.save(
        itemRepository.merge(item, { ...itemProperties, translations: translationEntities })
      )

      if (alternatives?.length) {
        await manager
          .createQueryBuilder()
          .insert()
          .into('item_alternatives')
          .values(alternatives.map((alternativeId) => ({ alternativeId, itemId: item.id })))
          .execute()
      }

      for (const { translations, childrenProperties = [], ...property } of properties) {
        const propertyEntity = await propertyRepository.save(
          propertyRepository.create({ ...property, itemId: item.id } as Partial<PropertyEntity>)
        )
        for (const { translations, ...property } of childrenProperties) {
          const childrenPropertyEntity = await propertyRepository.save(
            propertyRepository.create({ ...property, parentId: propertyEntity.id } as Partial<PropertyEntity>)
          )
          await propertyTranslationRepository.save(
            translations.map((translation) =>
              propertyTranslationRepository.create({
                ...translation,
                propertyId: childrenPropertyEntity.id
              } as Partial<PropertyTranslationEntity>)
            )
          )
        }
        await propertyTranslationRepository.save(
          translations.map((translation) =>
            propertyTranslationRepository.create({
              ...translation,
              propertyId: propertyEntity.id
            } as Partial<PropertyTranslationEntity>)
          )
        )
      }

      if (this.areFilesAttached(files)) {
        await this.itemFileManager.deleteItemFiles(item.id)
        const images = await this.itemFileManager.storeFiles(files, item.id)
        await itemRepository.update({ id: item.id }, { images })
      }

      return updatedItem
    })
  }

  protected areFilesAttached({ preview, gallery, drawings }: ItemFiles): boolean {
    return Boolean(preview) && !!gallery?.length && !!drawings?.length
  }
}
