import { type PaginationDto } from '../dto/pagination.dto'

export function buildPaginationParams({ page, perPage }: PaginationDto) {
  return {
    skip: (page - 1) * perPage,
    take: perPage
  }
}
