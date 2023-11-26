import { BaseFactory } from './base.factory'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { faker } from '@faker-js/faker'
import { UserEntity } from 'src/modules/users/entities/user.entity'

@Injectable()
export class UserFactory extends BaseFactory<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>
  ) {
    super(repository)
  }

  get template(): Partial<UserEntity> {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }
}
