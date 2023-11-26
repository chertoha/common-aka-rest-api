import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { stringify } from 'qs'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { type INestApplication } from '@nestjs/common'
import { AppModule } from 'src/app.module'
import { FactoryModule } from 'test/factories-module/factory.module'
import { ItemFactory } from 'test/factories-module/factories/item.factory'
import { BrandFactory } from 'test/factories-module/factories/brand.factory'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { type ItemTranslationEntity } from 'src/modules/items/entities/item-translation.entity'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { ItemTranslationFactory } from 'test/factories-module/factories/item-translation.factory'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { type PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyFactory } from 'test/factories-module/factories/property.factory'
import { PropertyTranslationFactory } from 'test/factories-module/factories/property-translation.factory'
import { ArticleFactory } from 'test/factories-module/factories/article.factory'
import { type ArticleEntity } from 'src/modules/items/entities/article.entity'
import { TestAuthService } from 'test/test-core-module/services/test-auth.service'
import { type UserEntity } from 'src/modules/users/entities/user.entity'
import { UserFactory } from 'test/factories-module/factories/user.factory'
import { TestCoreModule } from 'test/test-core-module/test-core-module'

describe('ItemsController', () => {
  let app: INestApplication

  let itemFactory: ItemFactory
  let itemTranslationFactory: ItemTranslationFactory
  let propertyFactory: PropertyFactory
  let propertyTranslationFactory: PropertyTranslationFactory
  let articleFactory: ArticleFactory
  let userFactory: UserFactory

  let brandFactory: BrandFactory
  let itemRepository: Repository<ItemEntity>
  let brandRepository: Repository<BrandEntity>
  let testAuthService: TestAuthService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule, TestCoreModule]
    }).compile()

    app = moduleRef.createNestApplication()
    itemFactory = moduleRef.get(ItemFactory)
    itemTranslationFactory = moduleRef.get(ItemTranslationFactory)
    brandFactory = moduleRef.get(BrandFactory)
    propertyFactory = moduleRef.get(PropertyFactory)
    articleFactory = moduleRef.get(ArticleFactory)
    userFactory = moduleRef.get(UserFactory)
    propertyTranslationFactory = moduleRef.get(PropertyTranslationFactory)

    itemRepository = moduleRef.get(getRepositoryToken(ItemEntity))
    brandRepository = moduleRef.get(getRepositoryToken(BrandEntity))
    testAuthService = moduleRef.get(TestAuthService)

    await app.init()
  })

  describe('GET /items', () => {
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
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
        .expect(200)

      const { data, total } = body
      expect(data.length).toBe(2)

      expect(total).toBe(2)
    })

    it(`should return all items filtered brand id`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
        .query({ filters: { brandId: brands[0].id } })
        .expect(200)

      const { data, total } = body
      expect(data.length).toBe(1)
      expect(total).toBe(1)
      expect(data[0].brandId).toBe(brands[0].id)
    })

    it(`should return all items filtered item ids`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data, total } = body
      expect(data.length).toBe(1)
      expect(total).toBe(1)
      expect(data[0].id).toBe(items[0].id)
    })

    it(`should return selected item with ukrainian translation`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
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
        .get(`/items`)
        .set('Accept-language', LanguageEnum.RU)
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
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
        .query(stringify({ pagination: { page: 1, perPage: 1 } }))
        .expect(200)

      const { data, total, page, perPage } = body
      expect(data.length).toBe(1)
      expect({ total, page, perPage }).toMatchObject({ total: 2, page: 1, perPage: 1 })
    })

    it(`should return items list with custom sorting`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
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

  describe('GET /items/:itemSlug', () => {
    let brand: BrandEntity
    let item: ItemEntity
    let itemTranslations: ItemTranslationEntity[]
    let itemProperty: PropertyEntity
    let article: ArticleEntity
    let articleProperty: PropertyEntity
    let alternativeItem: ItemEntity
    let alternativeItemTranslation: ItemTranslationEntity

    beforeAll(async () => {
      brand = await brandFactory.create()
      alternativeItem = await itemFactory.create({ brandId: brand.id })
      alternativeItemTranslation = await itemTranslationFactory.create({
        itemId: alternativeItem.id,
        language: LanguageEnum.UA
      })
      item = await itemFactory.create({ brandId: brand.id, alternatives: [alternativeItem] })
      itemTranslations = await itemTranslationFactory.createMany(2, [
        { itemId: item.id, language: LanguageEnum.RU },
        { itemId: item.id, language: LanguageEnum.UA }
      ])

      itemProperty = await propertyFactory.create({ itemId: item.id, order: 1 })
      await propertyTranslationFactory.create({
        propertyId: itemProperty.id,
        language: LanguageEnum.UA
      })
      await propertyFactory.create({
        parentId: itemProperty.id,
        title: 'test',
        value: '40',
        order: 1
      })

      article = await articleFactory.create({ itemId: item.id })
      articleProperty = await propertyFactory.create({
        articleId: article.id,
        order: 1,
        title: 'children-property',
        value: '100'
      })
      await propertyFactory.create({ parentId: articleProperty.id, order: 1 })
      await propertyTranslationFactory.create({
        propertyId: itemProperty.id,
        language: LanguageEnum.UA
      })
    })

    it(`should return requested item`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items/${itemTranslations[1].titleSlug}`)
        .set('Accept-language', LanguageEnum.UA)
        .expect(200)

      expect(body).toMatchObject({
        id: item.id,
        title: itemTranslations[1].title,
        titleSlug: itemTranslations[1].titleSlug,
        shortTitle: itemTranslations[1].shortTitle,
        description: itemTranslations[1].description,
        shortDescription: itemTranslations[1].shortDescription
      })

      expect(body.alternatives).toMatchObject([
        {
          id: alternativeItem.id,
          title: alternativeItemTranslation.title,
          titleSlug: alternativeItemTranslation.titleSlug,
          shortTitle: alternativeItemTranslation.shortTitle,
          description: alternativeItemTranslation.description,
          shortDescription: alternativeItemTranslation.shortDescription
        }
      ])
    })

    afterAll(async () => {
      await itemRepository.delete({})
      await brandRepository.delete({})
    })
  })

  describe('DELETE /items/:id', () => {
    let brand: BrandEntity
    let item: ItemEntity
    let itemProperty: PropertyEntity
    let article: ArticleEntity
    let articleProperty: PropertyEntity
    let alternativeItem: ItemEntity
    let user: UserEntity

    beforeAll(async () => {
      brand = await brandFactory.create()
    })

    beforeEach(async () => {
      item = await itemFactory.create({ brandId: brand.id, alternatives: [alternativeItem] })
      await itemTranslationFactory.create({ itemId: item.id, language: LanguageEnum.UA })

      itemProperty = await propertyFactory.create({ itemId: item.id, order: 1 })
      await propertyTranslationFactory.create({
        propertyId: itemProperty.id,
        language: LanguageEnum.UA
      })
      await propertyFactory.create({
        parentId: itemProperty.id,
        title: 'test',
        value: '40',
        order: 1
      })

      article = await articleFactory.create({ itemId: item.id })
      articleProperty = await propertyFactory.create({
        articleId: article.id,
        order: 1,
        title: 'children-property',
        value: '100'
      })
      await propertyFactory.create({ parentId: articleProperty.id, order: 1 })
      await propertyTranslationFactory.create({
        propertyId: itemProperty.id,
        language: LanguageEnum.UA
      })
      user = await userFactory.create()
    })

    it(`should return success result and delete record in database`, async () => {
      await request(app.getHttpServer())
        .delete(`/items/${item.id}`)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200, { success: true })

      await expect(itemRepository.findOne({ where: { id: item.id } })).resolves.toBeNull()
    })

    it(`should return unauthorized error, auth token was not provided`, async () => {
      await request(app.getHttpServer())
        .delete(`/items/${item.id}`)
        .expect(401, { message: 'Unauthorized', statusCode: 401 })

      await expect(itemRepository.findOne({ where: { id: item.id } })).resolves.toBeInstanceOf(ItemEntity)
    })

    it(`should return not success result, database record does not exist`, async () => {
      await request(app.getHttpServer())
        .delete(`/items/${item.id + 1}`)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200, { success: false })

      await expect(itemRepository.findOne({ where: { id: item.id } })).resolves.toBeInstanceOf(ItemEntity)
    })

    afterEach(async () => {
      await itemRepository.delete({})
    })

    afterAll(async () => {
      await brandRepository.delete({})
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
