import { registerAs } from '@nestjs/config'

export const ConfigFactory = registerAs('files', () => {
  return {
    publicDir: process.cwd() + '/public'
  }
})
