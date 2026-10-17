import { MigrationInterface, QueryRunner } from "typeorm";

export class DidSupport1788713727239 implements MigrationInterface {
    name = "DidSupport1788713727239";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`support\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(300) NOT NULL, \`subject\` varchar(300) NOT NULL, \`message\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_d05d18cf5958447826402f31fc7\``,
        );
        await queryRunner.query(
            `DROP INDEX \`UQ_slots_lock_user_subject\` ON \`slots_lock\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` CHANGE \`userId\` \`userId\` int NULL`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`UQ_slots_lock_user_subject\` ON \`slots_lock\` (\`userId\`, \`subjectId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_d05d18cf5958447826402f31fc7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_d05d18cf5958447826402f31fc7\``,
        );
        await queryRunner.query(
            `DROP INDEX \`UQ_slots_lock_user_subject\` ON \`slots_lock\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` CHANGE \`userId\` \`userId\` int NOT NULL`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`UQ_slots_lock_user_subject\` ON \`slots_lock\` (\`userId\`, \`subjectId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_d05d18cf5958447826402f31fc7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(`DROP TABLE \`support\``);
    }
}
