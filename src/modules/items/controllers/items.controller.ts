import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseFilters, UseGuards } from '@nestjs/common'
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
import { type OperationResultDto } from 'src/modules/common/dto/operation-result.dto'
import { ItemDeleterService } from './services/item.deleter.service'
import { AuthGuard } from 'src/modules/auth/guards/auth.guard'
import { ApiHeader } from '@nestjs/swagger'
import { LanguageHeadersDto } from 'src/modules/common/dto/language-headers.dto'

@Controller('items')
@UseFilters(EntityNotFoundExceptionFilter)
@ApiHeader({ name: 'Accept-Language', required: true, enum: LanguageEnum })
export class ItemsController {
  constructor(
    protected readonly itemListQuery: ItemListQuery,
    protected readonly itemQuery: ItemQuery,
    protected readonly itemDeleter: ItemDeleterService
  ) {}

  @Get()
  public async index(
    @Language() { language }: LanguageHeadersDto,
    @Query('pagination') paginationParams: PaginationDto = {},
    @Query('sorting') sortingParams: ItemsListSortingParamsDto = {},
    @Query('filters') filters: ItemListFiltersDto = {}
  ): Promise<ItemListDto> {
    return await this.itemListQuery.fetch({ language, paginationParams, sortingParams, filters })
  }

  @Get(':itemSlug')
  public async show(
    @Language() { language }: LanguageHeadersDto,
    @Param('itemSlug') titleSlug: string
  ): Promise<ItemDto> {
    return await this.itemQuery.fetch({ language, titleSlug })
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<OperationResultDto> {
    const result = await this.itemDeleter.delete(id)
    return { success: result }
  }
}
