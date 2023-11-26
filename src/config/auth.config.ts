import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const ConfigFactory = registerAs('auth', () => {
  return {
    jwtOptions: {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' }
    }
  }
})

export const Schema = {
  JWT_SECRET: Joi.string().required()
}
