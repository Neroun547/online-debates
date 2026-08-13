import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOnDeleteCascade1786638282126 implements MigrationInterface {
    name = 'AddedOnDeleteCascade1786638282126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
