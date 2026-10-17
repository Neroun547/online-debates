import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedUserStatus1785861654046 implements MigrationInterface {
    name = "ChangedUserStatus1785861654046";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`status\` enum ('online', 'busy', 'offline') NOT NULL DEFAULT 'offline'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`status\` varchar(255) NOT NULL`,
        );
    }
}
