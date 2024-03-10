import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from 'src/modules/items/entities/article.entity'
import { ItemEntity } from 'src/modules/items/entities/item.entity'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { Seeds } from './seed-files'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, ItemEntity, UserEntity])],
  providers: [...Seeds]
})
export class SeedModule {}
