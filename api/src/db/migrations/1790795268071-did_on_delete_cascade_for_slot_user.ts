import { MigrationInterface, QueryRunner } from "typeorm";

export class DidOnDeleteCascadeForSlotUser1790795268071 implements MigrationInterface {
    name = "DidOnDeleteCascadeForSlotUser1790795268071";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_2d02a48b62ad595fb23ee18d0bd\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_2d02a48b62ad595fb23ee18d0bd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_2d02a48b62ad595fb23ee18d0bd\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_2d02a48b62ad595fb23ee18d0bd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
