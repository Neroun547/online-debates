import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCreatedAtToSession1789200095599 implements MigrationInterface {
    name = 'AddedCreatedAtToSession1789200095599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`createdAt\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`createdAt\``);
    }

}
