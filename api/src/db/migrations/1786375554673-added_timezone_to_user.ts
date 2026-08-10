import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTimezoneToUser1786375554673 implements MigrationInterface {
    name = 'AddedTimezoneToUser1786375554673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`timezone\` varchar(50) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`timezone\``);
    }

}
