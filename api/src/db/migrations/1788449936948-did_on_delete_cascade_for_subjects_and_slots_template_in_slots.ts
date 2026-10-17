import { MigrationInterface, QueryRunner } from "typeorm";

export class DidOnDeleteCascadeForSubjectsAndSlotsTemplateInSlots1788449936948 implements MigrationInterface {
    name = "DidOnDeleteCascadeForSubjectsAndSlotsTemplateInSlots1788449936948";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_b3a3797c7a649ae0223873b185a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_f2c5a730288f5a420abd78ae751\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_f2c5a730288f5a420abd78ae751\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_b3a3797c7a649ae0223873b185a\` FOREIGN KEY (\`slotsTemplateId\`) REFERENCES \`slots_templates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_b3a3797c7a649ae0223873b185a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_f2c5a730288f5a420abd78ae751\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_f2c5a730288f5a420abd78ae751\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_b3a3797c7a649ae0223873b185a\` FOREIGN KEY (\`slotsTemplateId\`) REFERENCES \`slots_templates\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }
}
