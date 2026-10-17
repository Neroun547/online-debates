import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsAvailableForInstantMeetingForUser1789194834680 implements MigrationInterface {
    name = "AddedIsAvailableForInstantMeetingForUser1789194834680";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`isAvailableForInstantMeeting\` tinyint NOT NULL DEFAULT 1`,
        );
        await queryRunner.query(
            `ALTER TABLE \`support\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`support\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
        );
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`isAvailableForInstantMeeting\``,
        );
    }
}
