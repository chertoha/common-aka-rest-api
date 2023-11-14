import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreateItemEntity1699997179174 implements MigrationInterface {
  name = 'CreateItemEntity1699997179174'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "public"."property_translations_language_enum" AS ENUM('ua', 'ru')`)
    await queryRunner.query(
      `CREATE TABLE "property_translations" ("id" SERIAL NOT NULL, "language" "public"."property_translations_language_enum" NOT NULL, "title" text NOT NULL, "propertyId" integer NOT NULL, "itemId" integer, CONSTRAINT "PK_2cc4df579883652f057c437272b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "properties" ("id" SERIAL NOT NULL, "itemId" integer NOT NULL, "articleId" integer NOT NULL, "parentId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tab" json NOT NULL, "model3d" json, "pdf" json, "price" double precision NOT NULL, "discount" double precision, "weight" double precision NOT NULL, "weightUnit" character varying NOT NULL, "itemId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "images" json NOT NULL, "purchaseName" character varying NOT NULL, "publicName" character varying NOT NULL, "price" double precision NOT NULL, "discount" double precision, "brandId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "public"."item_translations_language_enum" AS ENUM('ua', 'ru')`)
    await queryRunner.query(
      `CREATE TABLE "item_translations" ("id" SERIAL NOT NULL, "language" "public"."item_translations_language_enum" NOT NULL, "title" text NOT NULL, "shortTitle" character varying NOT NULL, "description" text NOT NULL, "shortDescription" text NOT NULL, "itemId" integer NOT NULL, CONSTRAINT "UQ_3d418e033cac6d2c23e9d372964" UNIQUE ("itemId", "language"), CONSTRAINT "PK_aa0ebb87949cfad7216c74bd2b2" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "item_alternatives" ("itemId" integer NOT NULL, "alternativeId" integer NOT NULL, CONSTRAINT "PK_ca7c424016139cbe655b6c8357d" PRIMARY KEY ("itemId", "alternativeId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_5edc2e9a758315fb7fb919590b" ON "item_alternatives" ("itemId") `)
    await queryRunner.query(`CREATE INDEX "IDX_ab5a817b64dc52f02f334387d2" ON "item_alternatives" ("alternativeId") `)
    await queryRunner.query(
      `CREATE TABLE "suitable_for_items" ("itemId" integer NOT NULL, "suitableForId" integer NOT NULL, CONSTRAINT "PK_072984db2dc9c785d98afee7b6f" PRIMARY KEY ("itemId", "suitableForId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_c5c1306fd91217f1e295e32e51" ON "suitable_for_items" ("itemId") `)
    await queryRunner.query(`CREATE INDEX "IDX_1e62a84edabacf1270fa7d04c3" ON "suitable_for_items" ("suitableForId") `)
    await queryRunner.query(
      `ALTER TABLE "property_translations" ADD CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d" FOREIGN KEY ("itemId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_bb4037141473acdf6f7e13c0fb1" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_f9f06371a71bda00f11ff1e5fe8" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_7153faf9e0422a0ba910b6d8c58" FOREIGN KEY ("parentId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_f5eb9380dfbfe14a3b7eb10e431" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_210d0afcca69dba4a9d3304029b" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "item_translations" ADD CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "item_alternatives" ADD CONSTRAINT "FK_5edc2e9a758315fb7fb919590bf" FOREIGN KEY ("itemId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "item_alternatives" ADD CONSTRAINT "FK_ab5a817b64dc52f02f334387d21" FOREIGN KEY ("alternativeId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "suitable_for_items" ADD CONSTRAINT "FK_c5c1306fd91217f1e295e32e518" FOREIGN KEY ("itemId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "suitable_for_items" ADD CONSTRAINT "FK_1e62a84edabacf1270fa7d04c31" FOREIGN KEY ("suitableForId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "suitable_for_items" DROP CONSTRAINT "FK_1e62a84edabacf1270fa7d04c31"`)
    await queryRunner.query(`ALTER TABLE "suitable_for_items" DROP CONSTRAINT "FK_c5c1306fd91217f1e295e32e518"`)
    await queryRunner.query(`ALTER TABLE "item_alternatives" DROP CONSTRAINT "FK_ab5a817b64dc52f02f334387d21"`)
    await queryRunner.query(`ALTER TABLE "item_alternatives" DROP CONSTRAINT "FK_5edc2e9a758315fb7fb919590bf"`)
    await queryRunner.query(`ALTER TABLE "item_translations" DROP CONSTRAINT "FK_bf6bf3501f24ff6776b42bb7117"`)
    await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_210d0afcca69dba4a9d3304029b"`)
    await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_f5eb9380dfbfe14a3b7eb10e431"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_7153faf9e0422a0ba910b6d8c58"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_f9f06371a71bda00f11ff1e5fe8"`)
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_bb4037141473acdf6f7e13c0fb1"`)
    await queryRunner.query(`ALTER TABLE "property_translations" DROP CONSTRAINT "FK_bd3db4636b3b5d67061ee68ea5d"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_1e62a84edabacf1270fa7d04c3"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_c5c1306fd91217f1e295e32e51"`)
    await queryRunner.query(`DROP TABLE "suitable_for_items"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ab5a817b64dc52f02f334387d2"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_5edc2e9a758315fb7fb919590b"`)
    await queryRunner.query(`DROP TABLE "item_alternatives"`)
    await queryRunner.query(`DROP TABLE "item_translations"`)
    await queryRunner.query(`DROP TYPE "public"."item_translations_language_enum"`)
    await queryRunner.query(`DROP TABLE "items"`)
    await queryRunner.query(`DROP TABLE "articles"`)
    await queryRunner.query(`DROP TABLE "properties"`)
    await queryRunner.query(`DROP TABLE "property_translations"`)
    await queryRunner.query(`DROP TYPE "public"."property_translations_language_enum"`)
    await queryRunner.query(`DROP TABLE "brands"`)
  }
}
