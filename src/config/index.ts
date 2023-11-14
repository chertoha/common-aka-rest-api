import { type ConfigModuleOptions as ConfigModuleOptionsType, type ConfigFactory } from '@nestjs/config'
import * as Joi from 'joi'
import * as AppConfig from './app.config'
import * as DbConfig from './db.config'

export interface Config {
  ConfigFactory: ConfigFactory
  Schema?: Record<string, Joi.AnySchema>
}

const configs: Config[] = [AppConfig, DbConfig]

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
