import { ApiProperty } from '@nestjs/swagger'

export class OperationResultDto {
  @ApiProperty()
  success: boolean
}
