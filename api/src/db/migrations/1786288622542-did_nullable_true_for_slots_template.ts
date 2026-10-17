import { MigrationInterface, QueryRunner } from "typeorm";

export class DidNullableTrueForSlotsTemplate1786288622542 implements MigrationInterface {
    name = "DidNullableTrueForSlotsTemplate1786288622542";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_b3a3797c7a649ae0223873b185a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` CHANGE \`slotsTemplateId\` \`slotsTemplateId\` int NULL`,
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
            `ALTER TABLE \`slots\` CHANGE \`slotsTemplateId\` \`slotsTemplateId\` int NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_b3a3797c7a649ae0223873b185a\` FOREIGN KEY (\`slotsTemplateId\`) REFERENCES \`slots_templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
