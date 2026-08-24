import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { User } from './user/user.entity';
import { Category } from './category/category.entity';
import { Subject } from './subjects/subject.entity';
import { Admin } from './admin/admin.entity';
import { Slots } from './slots/slots.entity';
import { SlotsTemplates } from './slots-templates/slots-templates.entity';
import { Sessions } from './sessions/sessions.entity';
import { SlotsLock } from './slots-lock/slots-lock.entity';
import { Messages } from './messages/messages.entity';

dotenv.config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,

  synchronize: false,
  entities: [User, Category, Subject, Admin, Slots, SlotsTemplates, Sessions, SlotsLock, Messages],
  migrations: [
    join(process.cwd(), 'src/db/migrations/*{.ts,.js}'),
  ],
  migrationsTableName: 'migrations',
});

