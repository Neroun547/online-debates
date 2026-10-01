import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSexToUser1790882578084 implements MigrationInterface {
    name = 'AddedSexToUser1790882578084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`sex\` enum ('male', 'female') NOT NULL DEFAULT 'male'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`sex\``);
    }
}
