import { MigrationInterface, QueryRunner } from "typeorm";

export class DidOnDeleteCascadeForSlotsTemplateUser1790795418949 implements MigrationInterface {
    name = 'DidOnDeleteCascadeForSlotsTemplateUser1790795418949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slots_templates\` DROP FOREIGN KEY \`FK_442bce3fcf59bb6daf02d64c547\``);
        await queryRunner.query(`ALTER TABLE \`slots_templates\` ADD CONSTRAINT \`FK_442bce3fcf59bb6daf02d64c547\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slots_templates\` DROP FOREIGN KEY \`FK_442bce3fcf59bb6daf02d64c547\``);
        await queryRunner.query(`ALTER TABLE \`slots_templates\` ADD CONSTRAINT \`FK_442bce3fcf59bb6daf02d64c547\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
