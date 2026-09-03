import { MigrationInterface, QueryRunner } from "typeorm";

export class DidOnDeleteCascadeForTemplates1788449594961 implements MigrationInterface {
    name = 'DidOnDeleteCascadeForTemplates1788449594961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slots_templates\` DROP FOREIGN KEY \`FK_58bea6f23d753b05a48f42142bb\``);
        await queryRunner.query(`ALTER TABLE \`slots_templates\` ADD CONSTRAINT \`FK_58bea6f23d753b05a48f42142bb\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slots_templates\` DROP FOREIGN KEY \`FK_58bea6f23d753b05a48f42142bb\``);
        await queryRunner.query(`ALTER TABLE \`slots_templates\` ADD CONSTRAINT \`FK_58bea6f23d753b05a48f42142bb\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
