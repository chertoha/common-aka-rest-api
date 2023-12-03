import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AllowedNullValuesForItemPublicName1701512324479 implements MigrationInterface {
  name = 'AllowedNullValuesForItemPublicName1701512324479'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "publicName" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "publicName" SET NOT NULL`)
  }
}
