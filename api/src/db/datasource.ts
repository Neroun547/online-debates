import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { User } from './user/user.entity';
import { Category } from './category/category.entity';
import { Subject } from './subjects/subject.entity';
import { Admin } from './admin/admin.entity';

dotenv.config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,

  synchronize: false,
  entities: [User, Category, Subject, Admin],
  migrations: [
    join(process.cwd(), 'src/db/migrations/*{.ts,.js}'),
  ],
  migrationsTableName: 'migrations',
});

