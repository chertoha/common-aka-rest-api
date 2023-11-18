import { type PaginationDto } from 'src/modules/common/dto/pagination.dto'
import { type DatabaseQuery } from 'src/modules/common/interfaces/database-query.interface'
import { type ItemListDto, ItemListItemDto } from '../dto/item-list.dto'
import { ItemEntity } from '../entities/item.entity'
import { Repository, type SelectQueryBuilder } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { mapManyToDto } from 'src/modules/common/utils/serialization.utils'
import { type ItemsListSortingParamsDto } from '../dto/items-list-sorting-params.dto'
import { SortingOrder } from 'src/modules/common/enums/sorting-order-enum'
import { type ItemListFiltersDto } from '../dto/item-list.filters.dto'
import { type LanguageEnum } from 'src/modules/common/enums/language.enum'

export interface ItemsListParams {
  language: LanguageEnum
  paginationParams: PaginationDto
  sortingParams: ItemsListSortingParamsDto
  filters: ItemListFiltersDto
}
export class ItemListQuery implements DatabaseQuery<ItemsListParams, ItemListDto> {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>
  ) {}

  protected get defaultSorting(): ItemsListSortingParamsDto {
    return { column: 'createdAt', order: SortingOrder.DESC }
  }

  protected get sortingColumnMapping(): Record<string, string> {
    return { createdAt: `item."createdAt"` }
  }

  public async fetch({ paginationParams, language, sortingParams, filters }: ItemsListParams): Promise<ItemListDto> {
    const query = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.translations', 'translation', 'translation.language = :language', { language })

    this.applyFilters(query, filters)
    this.applySorting(query, sortingParams)
    this.applyPagination(query, paginationParams)

    const [data, total] = await query.getManyAndCount()

    return {
      data: mapManyToDto(ItemListItemDto, data),
      total,
      page: paginationParams.page,
      perPage: paginationParams.perPage
    }
  }

  protected applySorting(
    query: SelectQueryBuilder<ItemEntity>,
    sortingParams: ItemsListSortingParamsDto
  ): SelectQueryBuilder<ItemEntity> {
    const { column, order } = { ...this.defaultSorting, ...sortingParams }

    return query.orderBy(this.sortingColumnMapping[column], order)
  }

  protected applyFilters(
    query: SelectQueryBuilder<ItemEntity>,
    filters: ItemListFiltersDto
  ): SelectQueryBuilder<ItemEntity> {
    const { brandId, itemsIds } = filters
    if (brandId) {
      query.andWhere('item."brandId" = :brandId', { brandId })
    }

    if (itemsIds?.length) {
      query.andWhere('item.id IN (:...itemsIds)', { itemsIds })
    }

    return query
  }

  protected applyPagination(
    query: SelectQueryBuilder<ItemEntity>,
    { page, perPage }: PaginationDto
  ): SelectQueryBuilder<ItemEntity> {
    if (!page || !perPage) {
      return query
    }

    return query.offset((page - 1) * perPage).limit(page)
  }
}
