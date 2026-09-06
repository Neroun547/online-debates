import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCreatedAtDate1788714579720 implements MigrationInterface {
    name = 'AddedCreatedAtDate1788714579720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`support\` ADD \`createdAt\` datetime NOT NULL DEFAULT NOW()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`support\` DROP COLUMN \`createdAt\``);
    }

}
