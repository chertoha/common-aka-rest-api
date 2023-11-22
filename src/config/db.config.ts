import { registerAs } from '@nestjs/config'
import { type TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as Joi from 'joi'
import { join } from 'path'

export const ConfigFactory = registerAs('db', () => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [join(__dirname, '/../**/*.entity.{ts,js}')]
  } satisfies TypeOrmModuleOptions
})

export const Schema = {
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required()
}
