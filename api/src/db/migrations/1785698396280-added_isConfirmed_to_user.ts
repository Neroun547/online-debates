import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsConfirmedToUser1785698396280 implements MigrationInterface {
    name = "AddedIsConfirmedToUser1785698396280";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`isConfirmed\` tinyint NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`isConfirmed\``,
        );
    }
}
