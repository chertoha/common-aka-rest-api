import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import * as argon from 'argon2'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/modules/users/entities/user.entity'

export interface UserSeedParams {
  name: string
  email: string
  password: string
}

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>
  ) {}

  public async run({ name, email, password: rawPassword }): Promise<void> {
    const password = await argon.hash(rawPassword)
    const user = this.repository.create({ name, email, password })
    await this.repository.save(user)
  }
}
