import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSlotToSessions1786288265940 implements MigrationInterface {
    name = 'AddedSlotToSessions1786288265940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD UNIQUE INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\` (\`slotId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_36e3e89b665d2b8f0b13e0eba9\` ON \`sessions\` (\`slotId\`)`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`DROP INDEX \`REL_36e3e89b665d2b8f0b13e0eba9\` ON \`sessions\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\``);
    }

}
