import { Controller, Get, Query } from '@nestjs/common'
import { PaginationDto } from 'src/modules/common/dto/pagination.dto'
import { type ItemListDto } from '../dto/item-list.dto'
import { ItemListQuery } from '../queries/item-list.query'
import { ItemsListSortingParamsDto } from '../dto/items-list-sorting-params.dto'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { Language } from 'src/modules/common/decorators/language.decorator'
import { ItemListFiltersDto } from '../dto/item-list.filters.dto'

@Controller(':language/items')
export class ItemsController {
  constructor(protected readonly itemListQuery: ItemListQuery) {}

  @Get()
  public async index(
    @Language() language: LanguageEnum,
    @Query('pagination') paginationParams: PaginationDto = {},
    @Query('sorting') sortingParams: ItemsListSortingParamsDto = {},
    @Query('filters') filters: ItemListFiltersDto = {}
  ): Promise<ItemListDto> {
    return await this.itemListQuery.fetch({ language, paginationParams, sortingParams, filters })
  }
}
