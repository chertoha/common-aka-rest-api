import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { type INestApplication } from '@nestjs/common'
import { AppModule } from 'src/app.module'
import { FactoryModule } from 'test/factories-module/factory.module'
import { ItemFactory } from 'test/factories-module/factories/item.factory'
import { BrandFactory } from 'test/factories-module/factories/brand.factory'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { LanguageEnum } from 'src/modules/common/enums/language.enum'
import { PropertyEntity } from 'src/modules/items/entities/property.entity'
import { PropertyFactory } from 'test/factories-module/factories/property.factory'
import { PropertyTranslationFactory } from 'test/factories-module/factories/property-translation.factory'
import { ArticleFactory } from 'test/factories-module/factories/article.factory'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { TestAuthService } from 'test/test-core-module/services/test-auth.service'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { UserFactory } from 'test/factories-module/factories/user.factory'
import { TestCoreModule } from 'test/test-core-module/test-core-module'
import { serialize } from 'test/test-core-module/utils/object-to-form-data.util'
import { cleanDirectory } from 'test/test-core-module/utils/fs.utils'
import { join } from 'path'
import { PropertyTranslationEntity } from 'src/modules/items/entities/property-translation.entity'
import { omit } from 'lodash'

describe('ArticlesController', () => {
  let app: INestApplication

  let itemFactory: ItemFactory
  let propertyFactory: PropertyFactory
  let propertyTranslationFactory: PropertyTranslationFactory
  let articleFactory: ArticleFactory
  let userFactory: UserFactory

  let brandFactory: BrandFactory
  let itemRepository: Repository<ItemEntity>
  let userRepository: Repository<UserEntity>
  let brandRepository: Repository<BrandEntity>
  let propertyRepository: Repository<PropertyEntity>
  let propertyTranslationRepository: Repository<PropertyTranslationEntity>
  let articleRepository: Repository<ArticleEntity>
  let testAuthService: TestAuthService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule, TestCoreModule]
    }).compile()

    app = moduleRef.createNestApplication()
    itemFactory = moduleRef.get(ItemFactory)
    brandFactory = moduleRef.get(BrandFactory)
    propertyFactory = moduleRef.get(PropertyFactory)
    articleFactory = moduleRef.get(ArticleFactory)
    userFactory = moduleRef.get(UserFactory)
    propertyTranslationFactory = moduleRef.get(PropertyTranslationFactory)

    itemRepository = moduleRef.get(getRepositoryToken(ItemEntity))
    brandRepository = moduleRef.get(getRepositoryToken(BrandEntity))
    propertyRepository = moduleRef.get(getRepositoryToken(PropertyEntity))
    propertyTranslationRepository = moduleRef.get(getRepositoryToken(PropertyTranslationEntity))
    articleRepository = moduleRef.get(getRepositoryToken(ArticleEntity))
    userRepository = moduleRef.get(getRepositoryToken(UserEntity))
    testAuthService = moduleRef.get(TestAuthService)

    await app.init()
  })

  describe('POST /items/:id/articles', () => {
    let brand: BrandEntity
    let user: UserEntity
    let item: ItemEntity
    let payload

    beforeAll(async () => {
      brand = await brandFactory.create()
      user = await userFactory.create()
      item = await itemFactory.create({ brandId: brand.id })
    })

    beforeEach(() => {
      payload = {
        ...omit(articleFactory.template, 'model3d', 'pdf'),
        properties: []
      }
    })

    it('should return article in response', async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/items/` + String(item.id) + '/articles')
        .attach('model3d', 'test/fixtures/images/test.png')
        .attach('pdf', 'test/fixtures/files/dummy.pdf')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body).toMatchObject({
        id: expect.any(Number),
        ...omit(payload, 'pdf', 'model3d'),
        pdf: `item/${item.id}/articles/${body.id}/dummy.pdf`,
        model3d: `item/${item.id}/articles/${body.id}/test.png`
      })
    })

    it('should save article to database', async () => {
      await request(app.getHttpServer())
        .post(`/items/` + String(item.id) + '/articles')
        .attach('model3d', 'test/fixtures/images/test.png')
        .attach('pdf', 'test/fixtures/files/dummy.pdf')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      await expect(
        articleRepository.findOne({
          where: omit(payload, 'properties')
        })
      ).resolves.toBeInstanceOf(ArticleEntity)
    })

    it('should create article without files', async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/items/` + String(item.id) + '/articles')
        .field(serialize(payload))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body).toMatchObject({
        id: expect.any(Number),
        pdf: null,
        model3d: null
      })
    })

    it('should return unauthorized, auth token was not provided', async () => {
      await request(app.getHttpServer())
        .post(`/items/` + String(item.id) + '/articles')
        .attach('model3d', 'test/fixtures/images/test.png')
        .attach('pdf', 'test/fixtures/files/dummy.pdf')
        .field(serialize(payload))
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
    })

    describe('with properties', () => {
      beforeEach(() => {
        payload = {
          ...omit(articleFactory.template, 'model3d', 'pdf'),
          properties: [
            {
              ...propertyFactory.template,
              translations: [
                { ...propertyTranslationFactory.template, language: LanguageEnum.RU },
                { ...propertyTranslationFactory.template, language: LanguageEnum.UA }
              ]
            }
          ]
        }
      })

      it('should save article property to database', async () => {
        await request(app.getHttpServer())
          .post(`/items/` + String(item.id) + '/articles')
          .field(serialize(payload))
          .set('Authorization', testAuthService.generateToken(user))
          .expect(200)

        await expect(
          propertyRepository.findOne({
            where: omit(payload.properties[0], 'translations')
          })
        ).resolves.toBeInstanceOf(PropertyEntity)
      })

      it('should save article property translations to database', async () => {
        await request(app.getHttpServer())
          .post(`/items/` + String(item.id) + '/articles')
          .field(serialize(payload))
          .set('Authorization', testAuthService.generateToken(user))
          .expect(200)

        await expect(
          propertyTranslationRepository.count({
            where: payload.properties[0].translations
          })
        ).resolves.toEqual(2)
      })
    })

    afterEach(async () => {
      await articleRepository.delete({})
    })

    afterAll(async () => {
      await itemRepository.delete({})
      await cleanDirectory(join(process.cwd(), 'public'))
      await brandRepository.delete({})
    })
  })

  describe('PUT /items/:id/articles/:articleId', () => {
    let brand: BrandEntity
    let user: UserEntity
    let item: ItemEntity
    let article: ArticleEntity
    let payload

    beforeAll(async () => {
      brand = await brandFactory.create()
      user = await userFactory.create()
      item = await itemFactory.create({ brandId: brand.id })
    })

    beforeEach(async () => {
      article = await articleFactory.create({ itemId: item.id })

      payload = {
        ...omit(articleFactory.template, 'model3d', 'pdf'),
        properties: []
      }
    })

    afterEach(async () => {
      await articleRepository.delete({})
    })

    afterAll(async () => {
      await itemRepository.delete({})
      await brandRepository.delete({})
      await userRepository.delete({})

      await cleanDirectory(join(process.cwd(), 'public'))
    })

    it('should update article', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/items/` + String(item.id) + '/articles/' + article.id)
        .set('Authorization', testAuthService.generateToken(user))
        .field(serialize(payload))
        .expect(200)

      expect(body).toMatchObject({
        id: expect.any(Number),
        ...omit(payload, 'pdf', 'model3d'),
        pdf: null,
        model3d: null
      })
    })

    it('should update article with files', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/items/` + String(item.id) + '/articles/' + article.id)
        .set('Authorization', testAuthService.generateToken(user))
        .attach('model3d', 'test/fixtures/images/test.png')
        .attach('pdf', 'test/fixtures/files/dummy.pdf')
        .field(serialize(payload))
        .expect(200)

      expect(body).toMatchObject({
        id: expect.any(Number),
        ...omit(payload, 'pdf', 'model3d'),
        pdf: `item/${item.id}/articles/${article.id}/dummy.pdf`,
        model3d: `item/${item.id}/articles/${article.id}/test.png`
      })
    })

    describe('with article property', () => {
      let property: PropertyEntity

      beforeEach(async () => {
        property = await propertyFactory.create({ articleId: article.id })
        payload.properties.push({
          ...propertyFactory.template,
          id: property.id,
          translations: [
            {
              ...propertyTranslationFactory.template,
              language: LanguageEnum.UA
            }
          ]
        })
      })

      afterEach(async () => {
        await propertyRepository.delete({})
      })

      it('should update article with property', async () => {
        const { body } = await request(app.getHttpServer())
          .put(`/items/` + String(item.id) + '/articles/' + article.id)
          .set('Authorization', testAuthService.generateToken(user))
          .field(serialize(payload))
          .expect(200)

        expect(body).toMatchObject({
          id: expect.any(Number),
          ...omit(payload, 'pdf', 'model3d', 'properties'),
          properties: [
            {
              id: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              order: payload.properties[0].order,
              value: payload.properties[0].value,
              translations: [
                {
                  id: expect.any(Number),
                  language: LanguageEnum.UA,
                  title: payload.properties[0].translations[0].title
                }
              ]
            }
          ]
        })
      })
    })

    it('should return not found error, item was not found', async () => {
      await request(app.getHttpServer())
        .put(`/items/` + String(item.id) + '/articles/' + (article.id + 1))
        .set('Authorization', testAuthService.generateToken(user))
        .field(serialize(payload))
        .expect(404, { error: 'EntityNotFoundError', statusCode: 404 })
    })

    it('should return unauthorized, auth token was not provided', async () => {
      await request(app.getHttpServer())
        .delete(`/items/` + String(item.id) + '/articles/' + (article.id + 1))
        .field(serialize(payload))
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
    })
  })

  describe('DELETE /items/:id/articles/:articleId', () => {
    let brand: BrandEntity
    let user: UserEntity
    let item: ItemEntity
    let article: ArticleEntity

    beforeAll(async () => {
      brand = await brandFactory.create()
      user = await userFactory.create()
    })

    beforeEach(async () => {
      item = await itemFactory.create({ brandId: brand.id })
      article = await articleFactory.create({ itemId: item.id })
    })

    it('should delete article', async () => {
      await request(app.getHttpServer())
        .delete(`/items/` + String(item.id) + '/articles/' + article.id)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200, { success: true })

      await expect(articleRepository.findOne({ where: { id: article.id } })).resolves.toBeNull()
    })

    it('should return failed result, item was not found', async () => {
      await request(app.getHttpServer())
        .delete(`/items/` + String(item.id + 1) + '/articles/' + article.id)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200, { success: false })

      await expect(articleRepository.findOne({ where: { id: article.id } })).resolves.toBeInstanceOf(ArticleEntity)
    })

    it('should return failed result, article was not found', async () => {
      await request(app.getHttpServer())
        .delete(`/items/` + String(item.id) + '/articles/' + (article.id + 1))
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200, { success: false })

      await expect(articleRepository.findOne({ where: { id: article.id } })).resolves.toBeInstanceOf(ArticleEntity)
    })

    it('should return unauthorized, auth token was not provided', async () => {
      await request(app.getHttpServer())
        .delete(`/items/` + String(item.id) + '/articles/' + (article.id + 1))
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
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
