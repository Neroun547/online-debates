Redis 8.0.5

Node.js version 22.21.0

MariaDB 11.8.8

npm install - install all dependency

npm run start:dev - start api in dev mode 
npm run start - start api in prod mode

Migrations:
 
npx typeorm-ts-node-commonjs migration:generate --dataSource=./src/db/datasource.ts migration_path_with_name - generate migration (from api directory)
npx typeorm-ts-node-commonjs migration:run --dataSource=./src/db/datasource.ts - run migrations (from api directory)

Архітектура

Модульна архітектура. Модулі бувають 2 типів, інфраструктурні та доменні. 

інфраструктурні модулі відповідають за роботу з БД, сторонніми інтеграціями (наприклад поштовий сервіс)

Модулі для роботи з бд зберігаються в папці db
Модулі для сторонніх інтеграцій зберігаються в папці integrations

Доменні модулі відповідають за саму бізнес логіку тої чи іншої сутності або бізнес процесу (наприклад: користувач, управління категоріями, слотами і т.д).

Між доменною та інфраструктурною логікою є мапери. За допомогою мапері доменна логіка комунікує з інфраструктурою 


