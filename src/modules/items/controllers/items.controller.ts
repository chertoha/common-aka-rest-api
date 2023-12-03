import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
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
import { ItemDeleterService } from '../services/item.deleter.service'
import { AuthGuard } from 'src/modules/auth/guards/auth.guard'
import { ApiHeader } from '@nestjs/swagger'
import { LanguageHeadersDto } from 'src/modules/common/dto/language-headers.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { CreateItemDto } from '../dto/create-item.dto'
import { ItemCreatorService } from '../services/item-creator.service'
import { type CreateItemResponseDto } from '../dto/created-item-response.dto'

@Controller('items')
@UseFilters(EntityNotFoundExceptionFilter)
@ApiHeader({ name: 'Accept-Language', required: true, enum: LanguageEnum })
export class ItemsController {
  constructor(
    protected readonly itemListQuery: ItemListQuery,
    protected readonly itemQuery: ItemQuery,
    protected readonly itemDeleter: ItemDeleterService,
    protected readonly itemCreator: ItemCreatorService
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

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'preview', maxCount: 1 }, { name: 'gallery' }, { name: 'drawings' }]))
  public async create(
    @Body() payload: CreateItemDto,
    @UploadedFiles()
    {
      preview,
      gallery,
      drawings
    }: { preview?: Express.Multer.File; gallery?: Express.Multer.File[]; drawings?: Express.Multer.File[] }
  ): Promise<CreateItemResponseDto> {
    return await this.itemCreator.create({ ...payload, files: { preview: preview?.[0], gallery, drawings } })
  }
}
