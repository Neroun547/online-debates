import { MigrationInterface, QueryRunner } from "typeorm";

export class DidSetNullForSlotsTemplateInSlots1790412104080 implements MigrationInterface {
    name = "DidSetNullForSlotsTemplateInSlots1790412104080";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_b3a3797c7a649ae0223873b185a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_b3a3797c7a649ae0223873b185a\` FOREIGN KEY (\`slotsTemplateId\`) REFERENCES \`slots_templates\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_b3a3797c7a649ae0223873b185a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_b3a3797c7a649ae0223873b185a\` FOREIGN KEY (\`slotsTemplateId\`) REFERENCES \`slots_templates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }
}
