import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLanguageForUser1789913292040 implements MigrationInterface {
    name = "AddedLanguageForUser1789913292040";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`language\` varchar(10) NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`language\``,
        );
    }
}
