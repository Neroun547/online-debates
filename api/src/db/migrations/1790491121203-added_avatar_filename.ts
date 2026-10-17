import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAvatarFilename1790491121203 implements MigrationInterface {
    name = "AddedAvatarFilename1790491121203";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`avatarFilename\` varchar(255) NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`avatarFilename\``,
        );
    }
}
