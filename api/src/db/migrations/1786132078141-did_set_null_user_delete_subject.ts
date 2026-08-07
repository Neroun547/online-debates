import { MigrationInterface, QueryRunner } from "typeorm";

export class DidSetNullUserDeleteSubject1786132078141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            DROP FOREIGN KEY \`FK_1000d5972b49885132c3dec02c5\`
        `)

        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            MODIFY \`userId\` int NULL
        `)

        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            ADD CONSTRAINT \`FK_1000d5972b49885132c3dec02c5\`
            FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
    }

}
