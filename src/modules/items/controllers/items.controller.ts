import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common'
import { PaginationDto } from 'src/modules/common/dto/pagination.dto'
import { type ItemListDto } from '../dto/item-list.dto'
import { ItemListQuery } from '../queries/item-list.query'
import { ItemsListSortingParamsDto } from '../dto/items-list-sorting-params.dto'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { Language } from 'src/modules/common/decorators/language.decorator'
import { ItemListFiltersDto } from '../dto/item-list.filters.dto'
import { ItemQuery } from '../queries/item.query'
import { type ItemDto } from '../dto/item.dto'
import { EntityNotFoundExceptionFilter } from 'src/modules/common/exception-filters/entity-not-found.exception-filter'

@Controller(':language/items')
@UseFilters(EntityNotFoundExceptionFilter)
export class ItemsController {
  constructor(
    protected readonly itemListQuery: ItemListQuery,
    protected readonly itemQuery: ItemQuery
  ) {}

  @Get()
  public async index(
    @Language() language: LanguageEnum,
    @Query('pagination') paginationParams: PaginationDto = {},
    @Query('sorting') sortingParams: ItemsListSortingParamsDto = {},
    @Query('filters') filters: ItemListFiltersDto = {}
  ): Promise<ItemListDto> {
    return await this.itemListQuery.fetch({ language, paginationParams, sortingParams, filters })
  }

  @Get(':itemSlug')
  public async show(@Language() language: LanguageEnum, @Param('itemSlug') titleSlug: string): Promise<ItemDto> {
    return await this.itemQuery.fetch({ language, titleSlug })
  }
}
