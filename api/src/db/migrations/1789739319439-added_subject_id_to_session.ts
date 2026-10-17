import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSubjectIdToSession1789739319439 implements MigrationInterface {
    name = "AddedSubjectIdToSession1789739319439";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sessions\` ADD \`subjectId\` int NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_d1ac69fcda1a14187be6448c3e2\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_d1ac69fcda1a14187be6448c3e2\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`sessions\` DROP COLUMN \`subjectId\``,
        );
    }
}
