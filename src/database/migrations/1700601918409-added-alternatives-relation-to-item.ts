import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddedAlternativesRelationToItem1700601918409 implements MigrationInterface {
  name = 'AddedAlternativesRelationToItem1700601918409'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_alternatives" DROP CONSTRAINT "FK_5edc2e9a758315fb7fb919590bf"`)
    await queryRunner.query(
      `ALTER TABLE "item_alternatives" ADD CONSTRAINT "FK_5edc2e9a758315fb7fb919590bf" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item_alternatives" DROP CONSTRAINT "FK_5edc2e9a758315fb7fb919590bf"`)
    await queryRunner.query(
      `ALTER TABLE "item_alternatives" ADD CONSTRAINT "FK_5edc2e9a758315fb7fb919590bf" FOREIGN KEY ("itemId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }
}
