import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { type INestApplication } from '@nestjs/common'
import { AppModule } from 'src/app.module'
import { FactoryModule } from 'test/factories-module/factory.module'
import { BrandFactory } from 'test/factories-module/factories/brand.factory'
import { BrandEntity } from 'src/modules/brands/entities/brand.entity'
import { TestAuthService } from 'test/test-core-module/services/test-auth.service'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { UserFactory } from 'test/factories-module/factories/user.factory'
import { TestCoreModule } from 'test/test-core-module/test-core-module'

describe('BrandsController', () => {
  let app: INestApplication

  let userFactory: UserFactory

  let brandFactory: BrandFactory
  let userRepository: Repository<UserEntity>
  let brandRepository: Repository<BrandEntity>
  let testAuthService: TestAuthService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule, TestCoreModule]
    }).compile()

    app = moduleRef.createNestApplication()
    brandFactory = moduleRef.get(BrandFactory)
    userFactory = moduleRef.get(UserFactory)

    brandRepository = moduleRef.get(getRepositoryToken(BrandEntity))
    userRepository = moduleRef.get(getRepositoryToken(UserEntity))
    testAuthService = moduleRef.get(TestAuthService)

    await app.init()
  })

  describe('POST /brands/', () => {
    let user: UserEntity
    let payload

    beforeAll(async () => {
      user = await userFactory.create()
    })

    beforeEach(() => {
      payload = { ...brandFactory.template }
    })

    it('should create new brand', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/brands')
        .send(payload)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body).toMatchObject({ id: expect.any(Number), ...payload })
    })

    describe('when brands already exists', () => {
      beforeEach(async () => {
        await brandFactory.create(payload)
      })

      it('should return bad request', async () => {
        return await request(app.getHttpServer())
          .post('/brands')
          .send(payload)
          .set('Authorization', testAuthService.generateToken(user))
          .expect(400)
      })
    })

    it('should return unauthorized, auth token was not provided', async () => {
      return await request(app.getHttpServer())
        .post('/brands')
        .send(payload)
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
    })

    afterEach(async () => {
      await brandRepository.delete({})
    })

    afterAll(async () => {
      await userRepository.delete({})
    })
  })

  describe('PUT /brands/:id', () => {
    let user: UserEntity
    let brand: BrandEntity
    let payload

    beforeAll(async () => {
      user = await userFactory.create()
    })

    beforeEach(async () => {
      brand = await brandFactory.create()

      payload = { ...brandFactory.template }
    })

    afterEach(async () => {
      await brandRepository.delete({})
    })

    afterAll(async () => {
      await userRepository.delete({})
    })

    it('should update brand', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/brands/` + String(brand.id))
        .send(payload)
        .set('Authorization', testAuthService.generateToken(user))
        .expect(200)

      expect(body).toMatchObject({ id: expect.any(Number), ...payload })
    })

    describe('when other brand has the same name', () => {
      let otherBrand: BrandEntity

      beforeEach(async () => {
        otherBrand = await brandFactory.create({ name: payload.name })
      })

      afterEach(async () => {
        await brandRepository.delete({ id: otherBrand.id })
      })

      it('should return error, name already exists', async () => {
        return await request(app.getHttpServer())
          .put(`/brands/` + String(brand.id))
          .send({ name: otherBrand.name })
          .set('Authorization', testAuthService.generateToken(user))
          .expect(400, {
            error: 'Bad Request',
            message: 'Brand with this name already exists',
            statusCode: 400
          })
      })
    })

    it('should return unauthorized, auth token was not provided', async () => {
      return await request(app.getHttpServer())
        .put(`/brands/` + String(brand.id))
        .send(payload)
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
    })
  })

  describe('GET /brands/', () => {
    beforeAll(async () => {
      await brandFactory.createMany(2)
    })

    afterAll(async () => {
      await brandRepository.delete({})
    })

    it('should return brands', async () => {
      const { body } = await request(app.getHttpServer()).get(`/brands/`).expect(200)

      const brands = await brandRepository.find({ order: { name: 'ASC' } })
      expect(body).toMatchObject({ data: brands })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
