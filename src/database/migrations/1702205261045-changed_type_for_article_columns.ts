import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class ChangedTypeForArticleColumns1702205261045 implements MigrationInterface {
  name = 'ChangedTypeForArticleColumns1702205261045'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "model3d"`)
    await queryRunner.query(`ALTER TABLE "articles" ADD "model3d" text`)
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "pdf"`)
    await queryRunner.query(`ALTER TABLE "articles" ADD "pdf" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "pdf"`)
    await queryRunner.query(`ALTER TABLE "articles" ADD "pdf" json`)
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "model3d"`)
    await queryRunner.query(`ALTER TABLE "articles" ADD "model3d" json`)
  }
}
