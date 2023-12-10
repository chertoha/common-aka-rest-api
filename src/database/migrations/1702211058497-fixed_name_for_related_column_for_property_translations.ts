import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class FixedNameForRelatedColumnForPropertyTranslations1702211058497 implements MigrationInterface {
  name = 'FixedNameForRelatedColumnForPropertyTranslations1702211058497'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property_translations" DROP CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d"`)
    await queryRunner.query(`ALTER TABLE "property_translations" DROP COLUMN "itemId"`)
    await queryRunner.query(
      `ALTER TABLE "property_translations" ADD CONSTRAINT "FK_26d68aaf4960080a8baf62440be" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property_translations" DROP CONSTRAINT "FK_26d68aaf4960080a8baf62440be"`)
    await queryRunner.query(`ALTER TABLE "property_translations" ADD "itemId" integer`)
    await queryRunner.query(
      `ALTER TABLE "property_translations" ADD CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d" FOREIGN KEY ("itemId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
