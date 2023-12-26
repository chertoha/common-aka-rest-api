import { type DatabaseQuery } from 'src/modules/common/interfaces/database-query.interface'
import { ItemEntity } from '../entities/item.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { mapOneToDto } from 'src/modules/common/utils/serialization.utils'
import { type ItemsListSortingParamsDto } from '../dto/items-list-sorting-params.dto'
import { SortingOrder } from 'src/modules/common/enums/sorting-order-enum'
import { type LanguageEnum } from 'src/modules/common/enums/language.enum'
import { Injectable } from '@nestjs/common'
import { whereLanguageStatement } from './where-statements/where-language-statement'
import { ItemResponseDto } from '../dto/item-response.dto'

export interface ItemsQueryParams {
  language: LanguageEnum
  titleSlug?: string
  itemId?: number
}
@Injectable()
export class ItemQuery implements DatabaseQuery<ItemsQueryParams, ItemResponseDto> {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>
  ) {}

  protected get defaultSortingParams(): ItemsListSortingParamsDto {
    return { column: '"createdAt"', order: SortingOrder.DESC }
  }

  public async fetch({ language, titleSlug, itemId }: ItemsQueryParams): Promise<ItemResponseDto> {
    const query = this.itemRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect(
        'item.translations',
        'itemTranslation',
        ...whereLanguageStatement('"itemTranslation".language', language)
      )
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
        ...whereLanguageStatement('"articleChildrenPropertiesTranslation".language', language)
      )
      .leftJoinAndSelect('item.properties', 'itemProperty')
      .leftJoinAndSelect(
        'itemProperty.translations',
        'itemPropertyTranslation',
        ...whereLanguageStatement('"itemPropertyTranslation".language', language)
      )
      .leftJoinAndSelect('properties', 'itemChildrenProperty', '"itemProperty".id = "itemChildrenProperty"."parentId"')
      .leftJoinAndSelect(
        'itemChildrenProperty.translations',
        'itemChildrenPropertyTranslation',
        ...whereLanguageStatement('"itemChildrenPropertyTranslation".language', language)
      )
      .leftJoinAndSelect('item.alternatives', 'alternative')
      .leftJoinAndSelect(
        'alternative.translations',
        'alternativeTranslation',
        ...whereLanguageStatement('"alternativeTranslation".language', language)
      )

    if (itemId) {
      query.andWhere('item.id = :itemId', { itemId })
    }

    if (titleSlug) {
      query.andWhere('"itemTranslation"."titleSlug" = :titleSlug', { titleSlug })
    }

    const item = await query.getOne()

    return mapOneToDto(ItemResponseDto, item)
  }
}
