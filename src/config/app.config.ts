import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const ConfigFactory = registerAs('app', () => {
  return {
    env: process.env.NODE_ENV,
    port: Number.parseInt(process.env.PORT)
  }
})

export const Schema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().integer().required()
}
