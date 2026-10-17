import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSlotsTemplatesToSlots1786288097814 implements MigrationInterface {
    name = "AddedSlotsTemplatesToSlots1786288097814";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD \`slotsTemplateId\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_b3a3797c7a649ae0223873b185a\` FOREIGN KEY (\`slotsTemplateId\`) REFERENCES \`slots_templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_b3a3797c7a649ae0223873b185a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP COLUMN \`slotsTemplateId\``,
        );
    }
}
