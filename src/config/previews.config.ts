import { registerAs } from '@nestjs/config'

export const ConfigFactory = registerAs('previews', () => {
  return {
    item: {
      preview: { thumbnail: { width: 400, height: 400 }, mobileThumbnail: { width: 240, height: 240 } },
      gallery: { thumbnail: { width: 400, height: 400 }, mobileThumbnail: { width: 240, height: 240 } },
      drawings: { thumbnail: { width: 400, height: 400 }, mobileThumbnail: { width: 240, height: 240 } }
    }
  }
})
