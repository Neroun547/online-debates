import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSlotsLockTable1786657493140 implements MigrationInterface {
    name = "AddedSlotsLockTable1786657493140";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`slots_lock\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`subjectId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_d05d18cf5958447826402f31fc7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_c803b23a68ea43e84950cbbd6c1\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_c803b23a68ea43e84950cbbd6c1\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_d05d18cf5958447826402f31fc7\``,
        );
        await queryRunner.query(`DROP TABLE \`slots_lock\``);
    }
}
