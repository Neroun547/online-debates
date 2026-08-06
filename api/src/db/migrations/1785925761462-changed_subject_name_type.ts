import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedSubjectNameType1785925761462 implements MigrationInterface {
    name = 'ChangedSubjectNameType1785925761462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD \`name\` varchar(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD \`name\` varchar(255) NOT NULL`);
    }

}
