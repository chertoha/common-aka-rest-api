import { type ExecutionContext, createParamDecorator } from '@nestjs/common'

export const Language = createParamDecorator(async (property: string | number | symbol, ctx: ExecutionContext) => {
  const headers = ctx.switchToHttp().getRequest().headers
  const language = headers['request-language']
  return { language }
})
