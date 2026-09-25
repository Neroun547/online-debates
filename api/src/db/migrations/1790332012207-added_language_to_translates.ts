import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLanguageToTranslates1790332012207 implements MigrationInterface {
    name = 'AddedLanguageToTranslates1790332012207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories_translates\` ADD \`language\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories_translates\` DROP COLUMN \`language\``);
    }
}
