import { MigrationInterface, QueryRunner } from "typeorm";

export class DidIsAvailableForPermanentSessions1789742454705 implements MigrationInterface {
    name = "DidIsAvailableForPermanentSessions1789742454705";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` CHANGE \`isAvailableForInstantMeeting\` \`isAvailableForPermanentSessions\` tinyint NOT NULL DEFAULT 1`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` CHANGE \`isAvailableForPermanentSessions\` \`isAvailableForInstantMeeting\` tinyint NOT NULL DEFAULT 1`,
        );
    }
}
