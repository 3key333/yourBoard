# Trello-Clone

## Команды

### Первый запуск

```bash
# server
cd server
npm install
# создать server/.env (см. ниже)
npm run dev

# client (новый терминал)
cd client
npm install
npm run dev
```

### Разработка

| Где | Команда | Что делает |
|-----|---------|------------|
| `server/` | `npm run dev` | Express + Socket.IO на `:3000` |
| `client/` | `npm run dev` | Vite dev-сервер (обычно `:5173`) |
| `client/` | `npm run build` | TypeScript + production-сборка |
| `client/` | `npm run lint` | ESLint |
| `client/` | `npm run preview` | Просмотр production-сборки |
| `server/` | `npx tsc --noEmit` | Проверка TypeScript |

---

## Пакеты — client

| Пакет | Назначение |
|-------|------------|
| `react` | UI |
| `react-dom` | Рендер React в DOM |
| `react-router-dom` | Роутинг (`/`, `/joinRoom`, `/board`) |
| `@reduxjs/toolkit` | Redux store, slices, thunks |
| `react-redux` | Подключение Redux к React |
| `@types/react-redux` | Типы для react-redux |
| `axios` | HTTP-запросы к API |
| `socket.io-client` | Real-time sync доски |
| `@hello-pangea/dnd` | Drag & drop карточек |
| `sass` | SCSS-стили (`.module.scss`) |
| `vite` | Сборщик и dev-сервер |
| `@vitejs/plugin-react` | React для Vite |
| `typescript` | TypeScript |
| `eslint` | Линтер |
| `typescript-eslint` | ESLint + TypeScript |
| `eslint-plugin-react-hooks` | Правила для хуков |
| `eslint-plugin-react-refresh` | HMR для React |
| `@eslint/js` | Базовый ESLint config |
| `globals` | Глобальные переменные для ESLint |
| `@types/react` | Типы React |
| `@types/react-dom` | Типы react-dom |
| `@types/node` | Типы Node.js |

---

## Пакеты — server

| Пакет | Назначение |
|-------|------------|
| `express` | HTTP API (`/api/auth`, `/api/user`, `/api/tasks`) |
| `cors` | CORS для клиента |
| `socket.io` | WebSocket: join room, add/delete/move task |
| `pg` | PostgreSQL |
| `dotenv` | Переменные из `.env` |
| `bcrypt` | Хеш паролей |
| `jsonwebtoken` | JWT при регистрации / входе |
| `axios` | HTTP (если нужен на сервере) |
| `typescript` | TypeScript |
| `ts-node` | Запуск `.ts` без сборки |
| `nodemon` | Автоперезапуск при изменениях |
| `@types/express` | Типы Express |
| `@types/cors` | Типы cors |
| `@types/node` | Типы Node.js |
| `@types/pg` | Типы pg |
| `@types/bcrypt` | Типы bcrypt |
| `@types/jsonwebtoken` | Типы jsonwebtoken |
