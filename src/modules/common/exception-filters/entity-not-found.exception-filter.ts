import { type ExceptionFilter, Catch, type ArgumentsHost, HttpStatus } from '@nestjs/common'
import { type Response } from 'express'
import { EntityNotFoundError } from 'typeorm'

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.NOT_FOUND).json({
      error: exception.name,
      statusCode: HttpStatus.NOT_FOUND
    })
  }
}
