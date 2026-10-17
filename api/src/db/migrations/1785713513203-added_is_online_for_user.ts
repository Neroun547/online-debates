import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsOnlineForUser1785713513203 implements MigrationInterface {
    name = "AddedIsOnlineForUser1785713513203";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`isOnline\` tinyint NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`isOnline\``,
        );
    }
}
