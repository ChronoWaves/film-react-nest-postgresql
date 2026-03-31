# FILM!

## Установка

### PostgreSQL

Установите PostgreSQL с помощью Docker. Из корня проекта выполните:
```
docker-compose up -d
```
Затем загрузите тестовые данные:
```
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.shedules.sql
```
### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД — `postgres`
* `DATABASE_HOST` - хост СУБД PostgreSQL, например `localhost`
* `DATABASE_PORT` - порт СУБД, например `5432`
* `DATABASE_NAME` - имя базы данных, например `prac`
* `DATABASE_USERNAME` - имя пользователя БД
* `DATABASE_PASSWORD` - пароль пользователя БД

Запустите бэкенд:

`npm run start:dev`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.




