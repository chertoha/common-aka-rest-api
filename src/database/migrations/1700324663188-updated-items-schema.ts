import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class UpdatedItemsSchema1700324663188 implements MigrationInterface {
  name = 'UpdatedItemsSchema1700324663188'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "tab"`)
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "price"`)
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "discount"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" ADD "discount" double precision`)
    await queryRunner.query(`ALTER TABLE "items" ADD "price" double precision NOT NULL`)
    await queryRunner.query(`ALTER TABLE "articles" ADD "tab" json NOT NULL`)
  }
}
