import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { type INestApplication } from '@nestjs/common'
import { AppModule } from 'src/app.module'
import { FactoryModule } from 'test/factories-module/factory.module'
import { UserFactory } from 'test/factories-module/factories/user.factory'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import * as argon from 'argon2'

describe('AuthController', () => {
  let app: INestApplication

  let userFactory: UserFactory
  let userRepository: Repository<UserEntity>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule]
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)

    userRepository = moduleRef.get(getRepositoryToken(UserEntity))

    await app.init()
  })

  describe('GET /auth/sign-in', () => {
    let user: UserEntity
    const password = 'password'

    beforeAll(async () => {
      const passwordHash = await argon.hash(password)
      user = await userFactory.create({ password: passwordHash })
    })

    it(`should return access token`, async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/auth/sign-in`)
        .send({ email: user.email, password })
        .expect(200)

      expect(body).toMatchObject({ accessToken: expect.any(String) })
    })

    it(`should return unauthorized error, password is wrong`, async () => {
      return await request(app.getHttpServer())
        .post(`/auth/sign-in`)
        .send({ email: user.email, password: 'XXXXX password' })
        .expect(401, { message: 'Unauthorized', statusCode: 401 })
    })

    it(`should return validation error, email is not provided`, async () => {
      return await request(app.getHttpServer())
        .post(`/auth/sign-in`)
        .send({ password: 'XXXXX password' })
        .expect(422, {
          status: 422,
          errors: {
            email: 'email should not be null or undefined, email must be a string'
          }
        })
    })

    afterAll(async () => {
      await userRepository.delete({})
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
