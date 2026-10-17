import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedUserStatus1785861382126 implements MigrationInterface {
    name = "ChangedUserStatus1785861382126";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` CHANGE \`isOnline\` \`status\` tinyint NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`status\` varchar(255) NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`status\` tinyint NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`users\` CHANGE \`status\` \`isOnline\` tinyint NOT NULL`,
        );
    }
}
