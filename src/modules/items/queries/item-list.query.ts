import { type PaginationDto } from 'src/modules/common/dto/pagination.dto'
import { type DatabaseQuery } from 'src/modules/common/interfaces/database-query.interface'
import { type ItemListDto, ItemListItemDto } from '../dto/item-list.dto'
import { ItemEntity } from '../entities/item.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { buildPaginationParams } from 'src/modules/common/utils/pagination.utils'
import { mapManyToDto } from 'src/modules/common/utils/serialization.utils'
import { type LanguageEnum } from '../enums/language.enum'
import { type ItemsListSortingParamsDto } from '../dto/items-list-sorting-params.dto'
import { SortingOrder } from 'src/modules/common/enums/sorting-order-enum'

export interface ItemsListParams {
  language: LanguageEnum
  paginationParams: PaginationDto
  sortingParams: ItemsListSortingParamsDto
}
export class ItemListQuery implements DatabaseQuery<ItemsListParams, ItemListDto> {
  constructor(
    @InjectRepository(ItemEntity)
    protected readonly itemRepository: Repository<ItemEntity>
  ) {}

  protected get defaultSortingParams(): ItemsListSortingParamsDto {
    return { column: 'createdAt', order: SortingOrder.DESC }
  }

  public async fetch({ paginationParams, language, sortingParams }: ItemsListParams): Promise<ItemListDto> {
    const { skip, take } = buildPaginationParams(paginationParams)
    const { column, order } = { ...this.defaultSortingParams, ...sortingParams }
    const [data, total] = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.translations', 'translation', 'translation.language = :language', { language })
      .skip(skip)
      .take(take)
      .orderBy(column, order)
      .getManyAndCount()

    return {
      data: mapManyToDto(ItemListItemDto, data),
      total,
      page: paginationParams.page,
      perPage: paginationParams.perPage
    }
  }
}
