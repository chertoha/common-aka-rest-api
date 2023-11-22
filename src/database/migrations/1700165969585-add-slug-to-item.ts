import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddSlugToItem1700165969585 implements MigrationInterface {
  name = 'AddSlugToItem1700165969585'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_translations" ADD "titleSlug" text NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "item_translations" ADD CONSTRAINT "UQ_ce2e74a2132f1b65113cc11fbcc" UNIQUE ("titleSlug")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_translations" DROP CONSTRAINT "UQ_ce2e74a2132f1b65113cc11fbcc"`)
    await queryRunner.query(`ALTER TABLE "item_translations" DROP COLUMN "titleSlug"`)
  }
}
