import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProjectTitle1612411482635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "name" TO "title"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "title" TO "name"`
    ); // reverts things made in "up" method
  }
}
