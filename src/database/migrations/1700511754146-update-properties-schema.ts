import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class UpdatePropertiesSchema1700511754146 implements MigrationInterface {
  name = 'UpdatePropertiesSchema1700511754146'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_bb4037141473acdf6f7e13c0fb1"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_f9f06371a71bda00f11ff1e5fe8"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_7153faf9e0422a0ba910b6d8c58"`)
    await queryRunner.query(`ALTER TABLE "properties" ADD "title" character varying`)
    await queryRunner.query(`ALTER TABLE "properties" ADD "value" character varying`)
    await queryRunner.query(`ALTER TABLE "properties" ADD "order" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "itemId" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "articleId" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "UQ_8fc78e50d7da47217f69ce657d0" UNIQUE ("itemId", "articleId", "parentId", "order")`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_bb4037141473acdf6f7e13c0fb1" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_f9f06371a71bda00f11ff1e5fe8" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_7153faf9e0422a0ba910b6d8c58" FOREIGN KEY ("parentId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_7153faf9e0422a0ba910b6d8c58"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_f9f06371a71bda00f11ff1e5fe8"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_bb4037141473acdf6f7e13c0fb1"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "UQ_8fc78e50d7da47217f69ce657d0"`)
    await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "articleId" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "itemId" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "order"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "value"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "title"`)
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_7153faf9e0422a0ba910b6d8c58" FOREIGN KEY ("parentId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_f9f06371a71bda00f11ff1e5fe8" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_bb4037141473acdf6f7e13c0fb1" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
