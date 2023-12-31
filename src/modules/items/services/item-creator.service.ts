import { Injectable } from '@nestjs/common'
import { type CreateItemDto } from '../dto/create-item.dto'
import { ItemEntity } from '../entities/item.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ItemTranslationEntity } from '../entities/item-translation.entity'
import { PropertyEntity } from '../entities/property.entity'
import { PropertyTranslationEntity } from '../entities/property-translation.entity'
import { type ItemFiles } from '../types/item-files.type'
import { ItemFileManager } from './item-files-manager.service'

export type Payload = CreateItemDto & { files: ItemFiles }

@Injectable()
export class ItemCreatorService {
  constructor(
    protected readonly itemFileManager: ItemFileManager,
    @InjectRepository(ItemEntity)
    protected readonly repository: Repository<ItemEntity>,
    @InjectRepository(PropertyEntity)
    protected readonly propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(PropertyTranslationEntity)
    protected readonly propertyTranslationRepository: Repository<PropertyTranslationEntity>
  ) {}

  public async create({
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

      const translationEntities = translations.map((translation) => itemTranslationRepository.create(translation))
      const item = await itemRepository.save(
        itemRepository.create({
          ...itemProperties,
          images: {},
          translations: translationEntities
        })
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

      const images = await this.itemFileManager.storeFiles(files, item.id)
      await itemRepository.update({ id: item.id }, { images })

      return item
    })
  }
}
