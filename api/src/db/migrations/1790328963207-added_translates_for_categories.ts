import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTranslatesForCategories1790328963207 implements MigrationInterface {
    name = 'AddedTranslatesForCategories1790328963207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories_translates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`property\` ENUM('name') NOT NULL, \`value\` text NOT NULL, \`categoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories_translates\` ADD CONSTRAINT \`FK_49b4916827c24885de73a9437fb\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories_translates\` DROP FOREIGN KEY \`FK_49b4916827c24885de73a9437fb\``);
        await queryRunner.query(`DROP TABLE \`categories_translates\``);
    }

}
