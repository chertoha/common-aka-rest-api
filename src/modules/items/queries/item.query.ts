import { type DatabaseQuery } from 'src/modules/common/interfaces/database-query.interface'
import { ItemEntity } from '../entities/item.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'
import { type ItemsListSortingParamsDto } from '../dto/items-list-sorting-params.dto'
import { SortingOrder } from 'src/modules/common/enums/sorting-order-enum'
import { type LanguageEnum } from 'src/modules/common/enums/language.enum'
import { ItemDto } from '../dto/item.dto'
import { Injectable } from '@nestjs/common'

export interface ItemsQueryParams {
  language: LanguageEnum
  titleSlug: string
}
@Injectable()
export class ItemQuery implements DatabaseQuery<ItemsQueryParams, ItemDto> {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>
  ) {}

  protected get defaultSortingParams(): ItemsListSortingParamsDto {
    return { column: '"createdAt"', order: SortingOrder.DESC }
  }

  public async fetch({ language, titleSlug }: ItemsQueryParams): Promise<ItemDto> {
    const item = await this.itemRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.translations', 'itemTranslation', 'itemTranslation.language = :language', { language })
      .leftJoinAndSelect('item.articles', 'article')
      .leftJoinAndSelect('article.properties', 'articleProperty')
      .leftJoinAndSelect(
        'properties',
        'articleChildrenProperty',
        '"articleChildrenProperty"."parentId" = articleProperty.id'
      )
      .leftJoinAndSelect(
        'articleChildrenProperty.translations',
        'articleChildrenPropertiesTranslation',
        'articleChildrenPropertiesTranslation.language = :language',
        { language }
      )
      .leftJoinAndSelect('item.properties', 'itemProperty')
      .leftJoinAndSelect(
        'itemProperty.translations',
        'itemPropertyTranslation',
        '"itemPropertyTranslation".language = :language',
        { language }
      )
      .leftJoinAndSelect('properties', 'itemChildrenProperty', '"itemProperty".id = "itemChildrenProperty"."parentId"')
      .leftJoinAndSelect(
        'itemChildrenProperty.translations',
        'itemChildrenPropertyTranslation',
        '"itemChildrenPropertyTranslation".language = :language',
        { language }
      )
      .leftJoinAndSelect('item.alternatives', 'alternative')
      .leftJoinAndSelect(
        'alternative.translations',
        'alternativeTranslation',
        '"alternativeTranslation".language = :language',
        { language }
      )
      .andWhere('itemTranslation.titleSlug = :titleSlug', { titleSlug })
      .getOneOrFail()

    return mapOneToDto(ItemDto, item)
  }
}
