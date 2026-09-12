import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNullableForSlotInSessions1789196961457 implements MigrationInterface {
    name = 'AddedNullableForSlotInSessions1789196961457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` CHANGE \`slotId\` \`slotId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` CHANGE \`slotId\` \`slotId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
