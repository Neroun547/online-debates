import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './db/user/user.entity';
import { UserModule } from './user/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from "@keyv/redis"
import { CategoriesModule } from './categories/categories.module';
import { Category } from './db/category/category.entity';
import { Subject } from './db/subjects/subject.entity';
import { Admin } from './db/admin/admin.entity';
import { AdminModule } from './admin/admin.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SlotsModule } from './slots/slots.module';
import { Slots } from './db/slots/slots.entity';
import { SlotsTemplates } from './db/slots-templates/slots-templates.entity';
import { Sessions } from './db/sessions/sessions.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { SlotsLock } from './db/slots-lock/slots-lock.entity';
import { SessionsModule } from './sessions/sessions.module';
import { Messages } from './db/messages/messages.entity';
import { SupportModule } from './support/support.module';
import { Support } from './db/support/support.entity';
import { CategoriesTranslates } from './db/translates/categories/categories-translates.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      stores: [
        new KeyvRedis(process.env.CACHE_REDIS_URL),
      ],
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      entities: [
        User, 
        Category, 
        Subject, 
        Admin, 
        Slots, 
        SlotsTemplates, 
        Sessions, 
        SlotsLock,
        Messages,
        Support,
        CategoriesTranslates
      ],
      type: "mariadb"  
    }),
    ScheduleModule.forRoot(),
    UserModule,
    CategoriesModule,
    AdminModule,
    SubjectsModule,
    SlotsModule,
    SessionsModule,
    SupportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
