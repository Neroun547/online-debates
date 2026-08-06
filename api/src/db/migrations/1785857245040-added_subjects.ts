import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSubjects1785857245040 implements MigrationInterface {
    name = 'AddedSubjects1785857245040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subjects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`categoryId\` int NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD CONSTRAINT \`FK_1000d5972b49885132c3dec02c5\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subjects\` ADD CONSTRAINT \`FK_7e6a221dc74b1f5e6b66be06621\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP FOREIGN KEY \`FK_7e6a221dc74b1f5e6b66be06621\``);
        await queryRunner.query(`ALTER TABLE \`subjects\` DROP FOREIGN KEY \`FK_1000d5972b49885132c3dec02c5\``);
        await queryRunner.query(`DROP TABLE \`subjects\``);
    }

}
