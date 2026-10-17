import { MigrationInterface, QueryRunner } from "typeorm";

export class DidNullableTrueForSlotsTemplate1786288543838 implements MigrationInterface {
    name = "DidNullableTrueForSlotsTemplate1786288543838";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\` ON \`sessions\``,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`IDX_36e3e89b665d2b8f0b13e0eba9\` ON \`sessions\` (\`slotId\`)`,
        );
    }
}
