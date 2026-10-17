import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueIndexForSlotInSessions1786288730987 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sessions\` ADD UNIQUE INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\` (\`slotId\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sessions\` DROP INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\``,
        );
    }
}
