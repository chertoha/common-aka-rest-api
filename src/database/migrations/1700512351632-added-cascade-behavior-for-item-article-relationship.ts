import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddedCascadeBehaviorForItemArticleRelationship1700512351632 implements MigrationInterface {
  name = 'AddedCascadeBehaviorForItemArticleRelationship1700512351632'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_f5eb9380dfbfe14a3b7eb10e431"`)
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_f5eb9380dfbfe14a3b7eb10e431" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_f5eb9380dfbfe14a3b7eb10e431"`)
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_f5eb9380dfbfe14a3b7eb10e431" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
