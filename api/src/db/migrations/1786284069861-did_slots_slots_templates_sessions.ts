import { MigrationInterface, QueryRunner } from "typeorm";

export class DidSlotsSlotsTemplatesSessions1786284069861 implements MigrationInterface {
    name = "DidSlotsSlotsTemplatesSessions1786284069861";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`slots\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startTime\` varchar(20) NOT NULL, \`endTime\` varchar(20) NOT NULL, \`userId\` int NOT NULL, \`subjectId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`slots_templates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`weekday\` smallint NOT NULL, \`startTime\` varchar(20) NOT NULL, \`endTime\` varchar(20) NOT NULL, \`userId\` int NOT NULL, \`subjectId\` int NOT NULL, \`lastSlotCreation\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`sessions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slotId\` int NOT NULL, \`status\` enum ('booked', 'completed', 'cancelled') NOT NULL, \`creatorId\` int NOT NULL, \`customerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_2d02a48b62ad595fb23ee18d0bd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` ADD CONSTRAINT \`FK_f2c5a730288f5a420abd78ae751\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_templates\` ADD CONSTRAINT \`FK_442bce3fcf59bb6daf02d64c547\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_templates\` ADD CONSTRAINT \`FK_58bea6f23d753b05a48f42142bb\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_b5980c87549e2c33d1196a80fb6\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_8c9e57459e2423a7094db64fc3f\` FOREIGN KEY (\`customerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_8c9e57459e2423a7094db64fc3f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_b5980c87549e2c33d1196a80fb6\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_templates\` DROP FOREIGN KEY \`FK_58bea6f23d753b05a48f42142bb\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots_templates\` DROP FOREIGN KEY \`FK_442bce3fcf59bb6daf02d64c547\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_f2c5a730288f5a420abd78ae751\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`slots\` DROP FOREIGN KEY \`FK_2d02a48b62ad595fb23ee18d0bd\``,
        );
        await queryRunner.query(`DROP TABLE \`sessions\``);
        await queryRunner.query(`DROP TABLE \`slots_templates\``);
        await queryRunner.query(`DROP TABLE \`slots\``);
    }
}
