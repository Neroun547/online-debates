import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCascade1785927366406 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            DROP FOREIGN KEY \`FK_7e6a221dc74b1f5e6b66be06621\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            ADD CONSTRAINT \`FK_7e6a221dc74b1f5e6b66be06621\`
            FOREIGN KEY (\`categoryId\`)
            REFERENCES \`categories\`(\`id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            DROP FOREIGN KEY \`FK_7e6a221dc74b1f5e6b66be06621\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`subjects\`
            ADD CONSTRAINT \`FK_7e6a221dc74b1f5e6b66be06621\`
            FOREIGN KEY (\`categoryId\`)
            REFERENCES \`categories\`(\`id\`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);
    }

}
