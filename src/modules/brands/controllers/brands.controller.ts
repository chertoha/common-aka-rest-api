import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseFilters, UseGuards } from '@nestjs/common'
import { EntityNotFoundExceptionFilter } from 'src/modules/common/exception-filters/entity-not-found.exception-filter'
import { AuthGuard } from 'src/modules/auth/guards/auth.guard'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { BrandCreatorService } from '../services/brand-creator.service'
import { BrandUpdaterService } from '../services/brand-updater.service'
import { type BrandListResponseDto } from '../dto/brand-list-response.dto'
import { BrandListQuery } from '../queries/brand-list.query'
import { BrandDto } from '../dto/brand.dto'
import { UpdateBrandDto } from '../dto/update-brand.dto'
import { CreateBrandDto } from '../dto/create-brand.dto'

@Controller('brands')
@UseFilters(EntityNotFoundExceptionFilter)
@ApiTags('Brands')
@ApiBearerAuth()
export class BrandsController {
  constructor(
    protected readonly brandListQuery: BrandListQuery,
    protected readonly brandCreator: BrandCreatorService,
    protected readonly brandUpdater: BrandUpdaterService
  ) {}

  @Get()
  public async index(): Promise<BrandListResponseDto> {
    return await this.brandListQuery.fetch()
  }

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: BrandDto })
  public async create(@Body() payload: CreateBrandDto): Promise<BrandDto> {
    return await this.brandCreator.create(payload)
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: BrandDto })
  public async update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateBrandDto): Promise<BrandDto> {
    return await this.brandUpdater.update({ ...payload, id })
  }
}
