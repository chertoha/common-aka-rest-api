import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const documentBuilder = new DocumentBuilder().addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, documentBuilder)
  SwaggerModule.setup('docs', app, document)

  const config = app.get(ConfigService)
  await app.listen(config.get('app.port'))
}

bootstrap()
