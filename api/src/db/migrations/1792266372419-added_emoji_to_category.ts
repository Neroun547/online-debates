import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEmojiToCategory1792266372419 implements MigrationInterface {
    name = 'AddedEmojiToCategory1792266372419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`emoji\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`emoji\``);
    }

}
