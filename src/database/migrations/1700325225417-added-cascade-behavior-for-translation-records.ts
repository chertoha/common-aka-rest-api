import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddedCascadeBehaviorForTranslationRecords1700325225417 implements MigrationInterface {
  name = 'AddedCascadeBehaviorForTranslationRecords1700325225417'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_translations" DROP CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117"`)
    await queryRunner.query(`ALTER TABLE "property_translations" DROP CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d"`)
    await queryRunner.query(
      `ALTER TABLE "item_translations" ADD CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "property_translations" ADD CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d" FOREIGN KEY ("itemId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property_translations" DROP CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d"`)
    await queryRunner.query(`ALTER TABLE "item_translations" DROP CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117"`)
    await queryRunner.query(
      `ALTER TABLE "property_translations" ADD CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d" FOREIGN KEY ("itemId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "item_translations" ADD CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
