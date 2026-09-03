import { MigrationInterface, QueryRunner } from "typeorm";

export class DidCascade1788450196713 implements MigrationInterface {
    name = 'DidCascade1788450196713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_c803b23a68ea43e84950cbbd6c1\``);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_d05d18cf5958447826402f31fc7\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_066163c46cda7e8187f96bc87a0\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2db9cf2b3ca111742793f6c37ce\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_8c9e57459e2423a7094db64fc3f\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_b5980c87549e2c33d1196a80fb6\``);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_d05d18cf5958447826402f31fc7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_c803b23a68ea43e84950cbbd6c1\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_066163c46cda7e8187f96bc87a0\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2db9cf2b3ca111742793f6c37ce\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_b5980c87549e2c33d1196a80fb6\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_8c9e57459e2423a7094db64fc3f\` FOREIGN KEY (\`customerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_36e3e89b665d2b8f0b13e0eba9b\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_8c9e57459e2423a7094db64fc3f\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_b5980c87549e2c33d1196a80fb6\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2db9cf2b3ca111742793f6c37ce\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_066163c46cda7e8187f96bc87a0\``);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_c803b23a68ea43e84950cbbd6c1\``);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` DROP FOREIGN KEY \`FK_d05d18cf5958447826402f31fc7\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_b5980c87549e2c33d1196a80fb6\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_8c9e57459e2423a7094db64fc3f\` FOREIGN KEY (\`customerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_36e3e89b665d2b8f0b13e0eba9b\` FOREIGN KEY (\`slotId\`) REFERENCES \`slots\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2db9cf2b3ca111742793f6c37ce\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_066163c46cda7e8187f96bc87a0\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_d05d18cf5958447826402f31fc7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`slots_lock\` ADD CONSTRAINT \`FK_c803b23a68ea43e84950cbbd6c1\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
