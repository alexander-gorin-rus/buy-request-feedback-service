import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1647178028428 implements MigrationInterface {
  name = 'Init1647178028428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityId" character varying NOT NULL, "entityName" character varying NOT NULL, "value" character varying NOT NULL, "comment" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rating"`);
  }
}
