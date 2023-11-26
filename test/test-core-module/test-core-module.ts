import { Module } from '@nestjs/common'
import { TestAuthService } from './services/test-auth.service'

@Module({
  providers: [TestAuthService]
})
export class TestCoreModule {}
