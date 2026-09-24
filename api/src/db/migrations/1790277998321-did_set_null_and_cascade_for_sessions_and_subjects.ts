import { MigrationInterface, QueryRunner } from "typeorm";

export class DidSetNullAndCascadeForSessionsAndSubjects1790277998321 implements MigrationInterface {
    name = 'DidSetNullAndCascadeForSessionsAndSubjects1790277998321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_d1ac69fcda1a14187be6448c3e2\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_d1ac69fcda1a14187be6448c3e2\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_d1ac69fcda1a14187be6448c3e2\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_d1ac69fcda1a14187be6448c3e2\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
