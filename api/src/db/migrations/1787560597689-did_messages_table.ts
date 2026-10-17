import { MigrationInterface, QueryRunner } from "typeorm";

export class DidMessagesTable1787560597689 implements MigrationInterface {
    name = "DidMessagesTable1787560597689";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`senderId\` int NOT NULL, \`sessionId\` int NOT NULL, \`content\` text NOT NULL, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_066163c46cda7e8187f96bc87a0\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2db9cf2b3ca111742793f6c37ce\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2db9cf2b3ca111742793f6c37ce\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_066163c46cda7e8187f96bc87a0\``,
        );
        await queryRunner.query(`DROP TABLE \`messages\``);
    }
}
