import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { type INestApplication } from '@nestjs/common'
import { AppModule } from '../../../../src/app.module'
import { FactoryModule } from 'test/factories/factory.module'
import { ItemFactory } from 'test/factories/item.factory'
import { BrandFactory } from 'test/factories/brand.factory'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { type ItemTranslationEntity } from 'src/modules/items/entities/item-translation.entity'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { ItemTranslationFactory } from 'test/factories/item-translation.factory'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { type Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { stringify } from 'qs'

describe('ItemsController', () => {
  let app: INestApplication
  let itemFactory: ItemFactory
  let itemTranslationFactory: ItemTranslationFactory
  let brandFactory: BrandFactory
  let itemRepository: Repository<ItemEntity>
  let brandRepository: Repository<BrandEntity>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule]
    }).compile()

    app = moduleRef.createNestApplication()
    itemFactory = moduleRef.get(ItemFactory)
    itemTranslationFactory = moduleRef.get(ItemTranslationFactory)
    brandFactory = moduleRef.get(BrandFactory)

    itemRepository = moduleRef.get(getRepositoryToken(ItemEntity))
    brandRepository = moduleRef.get(getRepositoryToken(BrandEntity))

    await app.init()
  })

  describe('GET /:language/items', () => {
    let brands: BrandEntity[]
    let items: ItemEntity[]
    let translations: ItemTranslationEntity[]

    beforeAll(async () => {
      brands = await brandFactory.createMany(2)
      items = await itemFactory.createMany(2, [{ brandId: brands[0].id }, { brandId: brands[1].id }])
      translations = await itemTranslationFactory.createMany(4, [
        { item: items[0], language: LanguageEnum.RU },
        { item: items[0], language: LanguageEnum.UA },
        { item: items[1], language: LanguageEnum.RU },
        { item: items[1], language: LanguageEnum.UA }
      ])
    })

    it(`should return all items`, async () => {
      const { body } = await request(app.getHttpServer()).get(`/${LanguageEnum.UA}/items`).expect(200)

      const { data, total } = body
      expect(data.length).toBe(2)

      expect(total).toBe(2)
    })

    it(`should return all items filtered brand id`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.UA}/items`)
        .query({ filters: { brandId: brands[0].id } })
        .expect(200)

      const { data, total } = body
      expect(data.length).toBe(1)
      expect(total).toBe(1)
      expect(data[0].brandId).toBe(brands[0].id)
    })

    it(`should return all items filtered item ids`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.UA}/items`)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data, total } = body
      expect(data.length).toBe(1)
      expect(total).toBe(1)
      expect(data[0].id).toBe(items[0].id)
    })

    it(`should return selected item with ukrainian translation`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.UA}/items`)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data } = body
      expect(data.length).toBe(1)

      expect(data[0]).toMatchObject({
        title: translations[1].title,
        titleSlug: translations[1].titleSlug,
        shortTitle: translations[1].shortTitle,
        shortDescription: translations[1].shortDescription,
        description: translations[1].description
      })
    })

    it(`should return selected item with russian translation`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.RU}/items`)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data } = body
      expect(data.length).toBe(1)

      expect(data[0]).toMatchObject({
        title: translations[0].title,
        titleSlug: translations[0].titleSlug,
        shortTitle: translations[0].shortTitle,
        shortDescription: translations[0].shortDescription,
        description: translations[0].description
      })
    })

    it(`should return selected item with russian translation`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.RU}/items`)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data } = body
      expect(data.length).toBe(1)

      expect(data[0]).toMatchObject({
        title: translations[0].title,
        titleSlug: translations[0].titleSlug,
        shortTitle: translations[0].shortTitle,
        shortDescription: translations[0].shortDescription,
        description: translations[0].description
      })
    })

    it(`should return items list with pagination`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.UA}/items`)
        .query(stringify({ pagination: { page: 1, perPage: 1 } }))
        .expect(200)

      const { data, total, page, perPage } = body
      expect(data.length).toBe(1)
      expect({ total, page, perPage }).toMatchObject({ total: 2, page: 1, perPage: 1 })
    })

    it(`should return items list with custom sorting`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/${LanguageEnum.UA}/items`)
        .query(stringify({ sorting: { column: 'createdAt', order: 'DESC' } }))
        .expect(200)

      const { data } = body
      expect(data.length).toBe(2)

      const createAtValues = data.map(({ createdAt }) => createdAt)
      expect(createAtValues).toEqual(createAtValues.sort().reverse())
    })

    afterAll(async () => {
      await itemRepository.delete({})
      await brandRepository.delete({})
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
