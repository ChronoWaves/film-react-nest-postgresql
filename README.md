# FILM!

Ссылка на задеплоенное приложение: http://chronowave-film.nomorepartiessite.ru/

## Локальный запуск через Docker

1. Склонируйте репозиторий и перейдите в корень проекта.

2. Создайте `.env` файл из примера:
```
cp .env.example .env
```

3. Запустите проект:
```
docker compose up -d --build
```

4. Проект будет доступен на порту 80, pgAdmin — на порту 8080.

5. Авторизуйтесь в pgAdmin и заполните базу данных, выполнив SQL-файлы из `backend/test/` в следующем порядке: `prac.init.sql`, `prac.films.sql`, `prac.shedules.sql`.

## Локальная разработка

### Бэкенд
```
cd backend
npm ci
npm run start:dev
```

### Фронтенд
```
cd frontend
npm ci
npm run dev
```

### Тесты
```
cd backend
npm test
```

## Переменные окружения

Описаны в файле `.env.example`.

## Логгирование

Выбор логгера задаётся переменной `LOGGER` в `.env`: `dev` (по умолчанию), `json`, `tskv`.