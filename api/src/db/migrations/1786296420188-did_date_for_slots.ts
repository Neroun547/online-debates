import { MigrationInterface, QueryRunner } from "typeorm";

export class DidDateForSlots1786296420188 implements MigrationInterface {
    name = 'DidDateForSlots1786296420188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\` ON \`sessions\``);
        await queryRunner.query(`ALTER TABLE \`slots\` DROP COLUMN \`startTime\``);
        await queryRunner.query(`ALTER TABLE \`slots\` ADD \`startTime\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`slots\` DROP COLUMN \`endTime\``);
        await queryRunner.query(`ALTER TABLE \`slots\` ADD \`endTime\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slots\` DROP COLUMN \`endTime\``);
        await queryRunner.query(`ALTER TABLE \`slots\` ADD \`endTime\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`slots\` DROP COLUMN \`startTime\``);
        await queryRunner.query(`ALTER TABLE \`slots\` ADD \`startTime\` varchar(20) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\` ON \`sessions\` (\`slotId\`)`);
    }

}
