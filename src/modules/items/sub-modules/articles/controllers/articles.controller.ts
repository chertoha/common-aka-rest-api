import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { EntityNotFoundExceptionFilter } from 'src/modules/common/exception-filters/entity-not-found.exception-filter'
import { AuthGuard } from 'src/modules/auth/guards/auth.guard'
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { CreateArticleDto } from '../dto/create-article.dto'
import { ArticleCreatorService } from '../services/article-creator.service'
import { ArticleDeleterService } from '../services/article-deleter.service'
import { OperationResultDto } from 'src/modules/common/dto/operation-result.dto'
import { ArticleResponseDto } from '../dto/article-response.dto'
import { UpdateArticleDto } from '../dto/update-article.dto'
import { ArticleUpdaterService } from '../services/article-updater-service'
import { ArticleQuery } from '../queries/article.query'

@Controller('items/:itemId/articles')
@ApiTags('Articles')
@ApiBearerAuth()
@UseFilters(EntityNotFoundExceptionFilter)
@ApiHeader({ name: 'Accept-Language', required: true, enum: LanguageEnum })
export class ArticlesController {
  constructor(
    protected readonly articleQuery: ArticleQuery,
    protected readonly articlesCreator: ArticleCreatorService,
    protected readonly articlesUpdater: ArticleUpdaterService,
    protected readonly articleDeleterService: ArticleDeleterService
  ) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'model3d', maxCount: 1 },
      { name: 'pdf', maxCount: 1 }
    ])
  )
  @ApiOkResponse({ type: ArticleResponseDto })
  public async create(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() payload: CreateArticleDto,
    @UploadedFiles()
    { model3d, pdf }: Record<'model3d' | 'pdf', Express.Multer.File[]>
  ): Promise<ArticleResponseDto> {
    const article = await this.articlesCreator.create({
      ...payload,
      itemId,
      model3d: model3d?.at(0) || null,
      pdf: pdf?.at(0) || null
    })

    return await this.articleQuery.fetch({ articleId: article.id, itemId })
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'model3d', maxCount: 1 },
      { name: 'pdf', maxCount: 1 }
    ])
  )
  @ApiOkResponse({ type: ArticleResponseDto })
  public async update(
    @Param('id', ParseIntPipe) articleId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() payload: UpdateArticleDto,
    @UploadedFiles()
    { model3d, pdf }: Record<'model3d' | 'pdf', Express.Multer.File[]>
  ): Promise<ArticleResponseDto> {
    const article = await this.articlesUpdater.update({
      ...payload,
      itemId,
      articleId,
      model3d: model3d?.at(0) || null,
      pdf: pdf?.at(0) || null
    })

    return await this.articleQuery.fetch({ articleId: article.id, itemId })
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: OperationResultDto })
  public async delete(
    @Param('id', ParseIntPipe) articleId: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ): Promise<OperationResultDto> {
    const result = await this.articleDeleterService.delete({ articleId, itemId })
    return { success: result }
  }
}
