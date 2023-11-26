import {
  UnprocessableEntityException,
  type ValidationError,
  ValidationPipe as NestValidationPipe,
  HttpStatus
} from '@nestjs/common'

function buildErrors(errors: ValidationError[]) {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? buildErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', ')
    }),
    {}
  )
}

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      validateCustomDecorators: true,
      transform: true,
      whitelist: true,
      validationError: {
        value: false,
        target: false
      },
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: buildErrors(errors)
        })
      }
    })
  }
}
