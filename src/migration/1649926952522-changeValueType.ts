import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeValueType1649926952522 implements MigrationInterface {
  name = 'changeValueType1649926952522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "value" integer NOT NULL DEFAULT 5`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ALTER COLUMN "value" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "value" character varying NOT NULL`,
    );
  }
}
