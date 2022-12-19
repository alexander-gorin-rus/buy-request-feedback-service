import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuthorId1649845409595 implements MigrationInterface {
  name = 'addAuthorId1649845409595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "rating"`);
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "authorId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "authorId"`);
  }
}
