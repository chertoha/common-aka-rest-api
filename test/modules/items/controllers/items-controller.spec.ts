import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { stringify } from 'qs'
import { join } from 'path'
import { omit } from 'lodash'
import { getRepositoryToken } from '@nestjs/typeorm'
import { IsNull, Not, type Repository } from 'typeorm'
import { type INestApplication } from '@nestjs/common'
import { AppModule } from 'src/app.module'
import { FactoryModule } from 'test/factories-module/factory.module'
import { ItemFactory } from 'test/factories-module/factories/item.factory'
import { BrandFactory } from 'test/factories-module/factories/brand.factory'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { ItemTranslationEntity } from 'src/modules/items/entities/item-translation.entity'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { ItemTranslationFactory } from 'test/factories-module/factories/item-translation.factory'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyFactory } from 'test/factories-module/factories/property.factory'
import { PropertyTranslationFactory } from 'test/factories-module/factories/property-translation.factory'
import { ArticleFactory } from 'test/factories-module/factories/article.factory'
import { type ArticleEntity } from 'src/modules/items/entities/article.entity'
import { TestAuthService } from 'test/test-core-module/services/test-auth.service'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { UserFactory } from 'test/factories-module/factories/user.factory'
import { TestCoreModule } from 'test/test-core-module/test-core-module'
import { serialize } from 'test/test-core-module/utils/object-to-form-data.util'
import { cleanDirectory } from 'test/test-core-module/utils/fs.utils'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'

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
  let itemTranslationRepository: Repository<ItemTranslationEntity>
  let brandRepository: Repository<BrandEntity>
  let propertyRepository: Repository<PropertyEntity>
  let propertyTranslationRepository: Repository<PropertyTranslationEntity>
  let userRepository: Repository<UserEntity>
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
    propertyRepository = moduleRef.get(getRepositoryToken(PropertyEntity))
    propertyTranslationRepository = moduleRef.get(getRepositoryToken(PropertyTranslationEntity))
    itemTranslationRepository = moduleRef.get(getRepositoryToken(ItemTranslationEntity))
    userRepository = moduleRef.get(getRepositoryToken(UserEntity))
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

    it(`should return items with all translations`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data } = body
      expect(data[0].translations.length).toEqual(2)
    })

    it(`should return selected item with ukrainian translation`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items`)
        .set('Accept-language', LanguageEnum.UA)
        .query(stringify({ filters: { itemsIds: [items[0].id] } }))

      const { data } = body
      expect(data.length).toBe(1)

      expect(data[0]).toMatchObject({
        id: items[0].id,
        images: expect.any(Object),
        brandId: items[0].brandId,
        translations: [
          {
            title: translations[1].title,
            titleSlug: translations[1].titleSlug,
            shortTitle: translations[1].shortTitle,
            shortDescription: translations[1].shortDescription,
            description: translations[1].description
          }
        ]
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
        id: items[0].id,
        images: expect.any(Object),
        brandId: items[0].brandId,
        translations: [
          {
            title: translations[0].title,
            titleSlug: translations[0].titleSlug,
            shortTitle: translations[0].shortTitle,
            shortDescription: translations[0].shortDescription,
            description: translations[0].description
          }
        ]
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

    afterAll(async () => {
      await itemRepository.delete({})
      await brandRepository.delete({})
    })

    it(`should return requested item`, async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/items/${itemTranslations[1].titleSlug}`)
        .set('Accept-language', LanguageEnum.UA)
        .expect(200)

      expect(body).toMatchObject({
        id: item.id,
        createdAt: expect.any(String),
        brandId: brand.id,
        publicName: item.publicName,
        purchaseName: item.purchaseName,
        translations: [
          {
            title: itemTranslations[1].title,
            titleSlug: itemTranslations[1].titleSlug,
            shortTitle: itemTranslations[1].shortTitle,
            description: itemTranslations[1].description,
            shortDescription: itemTranslations[1].shortDescription
          }
        ]
      })

      expect(body.alternatives).toMatchObject([
        {
          id: alternativeItem.id,
          translations: [
            {
              title: alternativeItemTranslation.title,
              titleSlug: alternativeItemTranslation.titleSlug,
              shortTitle: alternativeItemTranslation.shortTitle,
              description: alternativeItemTranslation.description,
              shortDescription: alternativeItemTranslation.shortDescription
            }
          ]
        }
      ])
    })

    it(`should return requested item with all translations`, async () => {
      const { body } = await request(app.getHttpServer()).get(`/items/${itemTranslations[1].titleSlug}`).expect(200)

      expect(body.translations.length).toEqual(2)
    })
  })

  describe('POST /items/', () => {
    let brand: BrandEntity
    let user: UserEntity
    let payload

    beforeAll(async () => {
      brand = await brandFactory.create()
      user = await userFactory.create()
    })

    beforeEach(() => {
      payload = {
        brandId: brand.id,
        purchaseName: 'purchase-name',
        publicName: 'public-name',
        translations: [
          {
            ...itemTranslationFactory.template,
            language: LanguageEnum.RU
          },
          {
            ...itemTranslationFactory.template,
            language: LanguageEnum.UA
          }
        ]
      }
    })

    it('should return item in response', async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/items/`)
        .attach('preview', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body).toMatchObject({
        id: expect.any(Number),
        purchaseName: payload.purchaseName,
        publicName: payload.publicName
      })
    })

    it('should return item to database response', async () => {
      await request(app.getHttpServer())
        .post(`/items/`)
        .attach('preview', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(
        itemRepository.findOne({
          where: {
            purchaseName: payload.purchaseName,
            publicName: payload.publicName
          }
        })
      ).resolves.toBeInstanceOf(ItemEntity)
    })

    it('should save translations to db', async () => {
      await request(app.getHttpServer())
        .post(`/items/`)
        .attach('preview', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(
        itemTranslationRepository.findOne({
          where: payload.translations[0]
        })
      ).resolves.toBeInstanceOf(ItemTranslationEntity)

      await expect(
        itemTranslationRepository.findOne({
          where: payload.translations[1]
        })
      ).resolves.toBeInstanceOf(ItemTranslationEntity)
    })

    it('should save images', async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/items/`)
        .attach('preview', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body.images).toMatchObject({
        preview: {
          url: `item/${body.id}/test.png`,
          thumbnail: `item/${body.id}/test-thumbnail.png`,
          mobileThumbnail: `item/${body.id}/test-mobileThumbnail.png`
        },
        gallery: [
          {
            url: `item/${body.id}/gallery/0/test.png`,
            thumbnail: `item/${body.id}/gallery/0/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/gallery/0/test-mobileThumbnail.png`
          },
          {
            url: `item/${body.id}/gallery/1/test.png`,
            thumbnail: `item/${body.id}/gallery/1/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/gallery/1/test-mobileThumbnail.png`
          }
        ],
        drawings: [
          {
            url: `item/${body.id}/drawings/0/test.png`,
            thumbnail: `item/${body.id}/drawings/0/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/drawings/0/test-mobileThumbnail.png`
          },
          {
            url: `item/${body.id}/drawings/1/test.png`,
            thumbnail: `item/${body.id}/drawings/1/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/drawings/1/test-mobileThumbnail.png`
          }
        ]
      })
    })

    describe('item with properties', () => {
      beforeEach(() => {
        payload = {
          ...payload,
          properties: [
            {
              ...propertyFactory.template,
              translations: [
                { ...propertyTranslationFactory.template, language: LanguageEnum.RU },
                { ...propertyTranslationFactory.template, language: LanguageEnum.UA }
              ],
              childrenProperties: [
                {
                  ...propertyFactory.template,
                  translations: [
                    { ...propertyTranslationFactory.template, language: LanguageEnum.RU },
                    { ...propertyTranslationFactory.template, language: LanguageEnum.UA }
                  ]
                }
              ]
            }
          ]
        }
      })

      it('should save properties to database', async () => {
        await request(app.getHttpServer())
          .post(`/items/`)
          .attach('preview', 'test/fixtures/images/test.png')
          .attach('gallery', 'test/fixtures/images/test.png')
          .attach('drawings', 'test/fixtures/images/test.png')
          .field(serialize(payload))
          .set('Authorization', testAuthService.generateToken(user))
          .expect(200)

        await expect(
          propertyRepository.findOne({
            where: {
              ...omit(payload.properties[0], ['translations', 'childrenProperties'])
            }
          })
        ).resolves.toBeInstanceOf(PropertyEntity)

        await expect(
          propertyRepository.findOne({
            where: {
              ...omit(payload.properties[0].childrenProperties[0], ['translations', 'childrenProperties'])
            }
          })
        ).resolves.toBeInstanceOf(PropertyEntity)
      })

      it('should save properties translations to database', async () => {
        await request(app.getHttpServer())
          .post(`/items/`)
          .attach('preview', 'test/fixtures/images/test.png')
          .attach('gallery', 'test/fixtures/images/test.png')
          .attach('drawings', 'test/fixtures/images/test.png')
          .field(serialize(payload))
          .set('Authorization', testAuthService.generateToken(user))
          .expect(200)

        await expect(
          propertyTranslationRepository.count({
            where: payload.properties[0].translations
          })
        ).resolves.toEqual(2)

        await expect(
          propertyTranslationRepository.count({
            where: payload.properties[0].childrenProperties[0].translations
          })
        ).resolves.toEqual(2)
      })

      afterEach(async () => {
        await propertyRepository.delete({})
        await propertyTranslationRepository.delete({})
      })
    })

    afterEach(async () => {
      await itemRepository.delete({})
    })

    afterAll(async () => {
      await cleanDirectory(join(process.cwd(), 'public'))
      await brandRepository.delete({})
    })
  })

  describe('PUT /items/:id', () => {
    let brand: BrandEntity
    let item: ItemEntity
    let itemProperty: PropertyEntity
    let itemTranslationProperty: ItemTranslationEntity
    let alternativeItem: ItemEntity
    let user: UserEntity
    let payload

    beforeAll(async () => {
      brand = await brandFactory.create()
      user = await userFactory.create()
    })

    beforeEach(async () => {
      item = await itemFactory.create({ brandId: brand.id, alternatives: [alternativeItem] })
      itemTranslationProperty = await itemTranslationFactory.create({ itemId: item.id, language: LanguageEnum.UA })

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
    })

    beforeEach(() => {
      payload = {
        brandId: brand.id,
        purchaseName: 'purchase-name',
        publicName: 'public-name',
        translations: [
          {
            ...itemTranslationFactory.template,
            language: LanguageEnum.UA
          }
        ]
      }
    })

    it(`should update item in database`, async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/items/${item.id}`)
        .set('Authorization', testAuthService.generateToken(user))
        .field(serialize(payload))
        .expect(200)

      expect(body).toMatchObject({
        id: item.id,
        createdAt: expect.any(String),
        brandId: brand.id,
        publicName: payload.publicName,
        purchaseName: payload.purchaseName,
        translations: [
          {
            title: payload.translations[0].title,
            titleSlug: payload.translations[0].titleSlug,
            shortTitle: payload.translations[0].shortTitle,
            description: payload.translations[0].description,
            shortDescription: payload.translations[0].shortDescription
          }
        ]
      })
    })

    it(`should delete existed related entities and save new records`, async () => {
      await request(app.getHttpServer())
        .put(`/items/${item.id}`)
        .set('Authorization', testAuthService.generateToken(user))
        .field(serialize(payload))
        .expect(200)

      await expect(itemTranslationRepository.findOne({ where: { id: itemTranslationProperty.id } })).resolves.toBeNull()
      await expect(itemRepository.findOne({ where: { id: itemProperty.id } })).resolves.toBeNull()
    })

    it('should save images', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/items/${item.id}`)
        .attach('preview', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('gallery', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .attach('drawings', 'test/fixtures/images/test.png')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body.images).toMatchObject({
        preview: {
          url: `item/${body.id}/test.png`,
          thumbnail: `item/${body.id}/test-thumbnail.png`,
          mobileThumbnail: `item/${body.id}/test-mobileThumbnail.png`
        },
        gallery: [
          {
            url: `item/${body.id}/gallery/0/test.png`,
            thumbnail: `item/${body.id}/gallery/0/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/gallery/0/test-mobileThumbnail.png`
          },
          {
            url: `item/${body.id}/gallery/1/test.png`,
            thumbnail: `item/${body.id}/gallery/1/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/gallery/1/test-mobileThumbnail.png`
          }
        ],
        drawings: [
          {
            url: `item/${body.id}/drawings/0/test.png`,
            thumbnail: `item/${body.id}/drawings/0/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/drawings/0/test-mobileThumbnail.png`
          },
          {
            url: `item/${body.id}/drawings/1/test.png`,
            thumbnail: `item/${body.id}/drawings/1/test-thumbnail.png`,
            mobileThumbnail: `item/${body.id}/drawings/1/test-mobileThumbnail.png`
          }
        ]
      })
    })

    it(`should return unauthorized error, auth token was not provided`, async () => {
      await request(app.getHttpServer())
        .put(`/items/${item.id}`)
        .field(serialize(payload))
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
    })

    it(`should return not success result, database record does not exist`, async () => {
      await request(app.getHttpServer())
        .put(`/items/${item.id + 1}`)
        .set('Authorization', testAuthService.generateToken(user))
        .field(serialize(payload))
        .expect(404, { error: 'EntityNotFoundError', statusCode: 404 })
    })

    afterEach(async () => {
      await itemRepository.delete({})
    })

    afterAll(async () => {
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

  describe('POST /items/import', () => {
    let user: UserEntity
    let brand: BrandEntity
    const brandName = 'test_brand'

    beforeAll(async () => {
      brand = await brandFactory.create({ name: brandName })
      user = await userFactory.create()
    })

    afterEach(async () => {
      await itemRepository.delete({})
    })

    afterAll(async () => {
      await brandRepository.delete(brand)
      await userRepository.delete(user)
    })

    it('200, imported new items', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/import-example.xlsx')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(itemRepository.count({ where: { brandId: brand.id } })).resolves.toEqual(1)
    })

    it('200, imported new item translations', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/import-example.xlsx')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(itemTranslationRepository.count()).resolves.toEqual(2)
    })

    it('200, imported new item properties', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/import-example.xlsx')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(propertyRepository.count({ where: { parentId: Not(IsNull()) } })).resolves.toEqual(2)
    })

    it('200, imported new item child properties', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/import-example.xlsx')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(propertyRepository.count({ where: { parentId: Not(IsNull()) } })).resolves.toEqual(2)
    })

    it('200, imported new translations for items', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/import-example.xlsx')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(itemTranslationRepository.count()).resolves.toEqual(2)
    })

    it('200, imported new translations for properties', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/import-example.xlsx')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(propertyTranslationRepository.count()).resolves.toEqual(8)
    })

    it('400, bad request, file was not provided', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(400, {
          message: 'Xlsx file was not provided',
          error: 'Bad Request',
          statusCode: 400
        })
    })

    it('400, bad request, file was not provided', async () => {
      await request(app.getHttpServer())
        .post(`/items/import`)
        .attach('file', 'test/fixtures/files/dummy.pdf')
        .set('Authorization', testAuthService.generateToken(user))
        .expect(400, {
          message: 'Error during document parsing',
          error: 'Bad Request',
          statusCode: 400
        })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
