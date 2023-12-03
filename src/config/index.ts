import { type ConfigModuleOptions as ConfigModuleOptionsType, type ConfigFactory } from '@nestjs/config'
import * as Joi from 'joi'
import * as AppConfig from './app.config'
import * as DbConfig from './db.config'
import * as AuthConfig from './auth.config'
import * as PreviewsConfig from './previews.config'
import * as FilesConfig from './files.config'

export interface Config {
  ConfigFactory: ConfigFactory
  Schema?: Record<string, Joi.AnySchema>
}

const configs: Config[] = [AppConfig, DbConfig, AuthConfig, PreviewsConfig, FilesConfig]

const factories = configs.map(({ ConfigFactory }) => ConfigFactory)

const validationSchema = configs.reduce(
  (validationSchema, { Schema = {} }) => Object.assign(validationSchema, Schema),
  {}
)

const envFilePath = process.env.NODE_ENV !== 'test' ? ['.env'] : ['.env.test']

export const ConfigModuleOptions: ConfigModuleOptionsType = {
  isGlobal: true,
  load: factories,
  envFilePath,
  validationSchema: Joi.object(validationSchema),
  validationOptions: {
    abortEarly: true
  },
  cache: false
}
