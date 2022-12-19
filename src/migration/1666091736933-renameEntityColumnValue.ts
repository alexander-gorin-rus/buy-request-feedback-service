import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameEntityColumnValue1666091736933
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "rating" SET "entityName" = 'DEAL' WHERE "entityName" = 'Deal'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "rating" SET "entityName" = 'Deal' WHERE "entityName" = 'DEAL'`,
    );
  }
}
