import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAgeAndDescriptionToUser1790793337189 implements MigrationInterface {
    name = 'AddedAgeAndDescriptionToUser1790793337189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`age\` int NOT NULL DEFAULT '18'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`age\``);
    }

}
