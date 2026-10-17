import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueIndexToLockTable1786658724287 implements MigrationInterface {
    name = "AddedUniqueIndexToLockTable1786658724287";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`UQ_slots_lock_user_subject\` ON \`slots_lock\` (\`userId\`, \`subjectId\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX \`UQ_slots_lock_user_subject\` ON \`slots_lock\``,
        );
    }
}
