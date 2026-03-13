<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Описание

Система управления складом на базе [NestJS](https://github.com/nestjs/nest) - прогрессивного Node.js фреймворка для построения эффективных и масштабируемых серверных приложений.

Система предоставляет RESTful API для управления пользователями, складами и грузами. Поддерживает пагинацию, фильтрацию данных и валидацию входных данных.

## Технологический стек

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL (поддерживается также MySQL)
- **ORM**: TypeORM 0.3.x
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt (для хеширования паролей), helmet, csrf-csrf
- **Caching**: @nestjs/cache-manager
- **Queue**: BullMQ
- **Testing**: Jest
- **Language**: TypeScript 5.x

## Установка проекта

### Требования

- Node.js (версия 18 или выше)
- npm или yarn
- База данных (PostgreSQL или MySQL)

### Шаги установки

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd warehouse
```

2. Установите зависимости:

```bash
npm install
```

3. Настройте переменные окружения (создайте файл `.env`):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=warehouse_db
```

4. Настройте подключение к базе данных в `src/app.module.ts`

## Структура проекта

```
warehouse/
├── src/
│   ├── common/              # Общие модули
│   │   ├── dto/            # Общие DTO (пагинация)
│   │   ├── interfaces/     # Интерфейсы (PaginatedResponse)
│   │   ├── middleware/     # Middleware (логирование)
│   │   └── types/          # Типы TypeScript
│   ├── user/               # Модуль пользователей
│   │   ├── dto/            # DTO для валидации
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.entity.ts
│   │   └── user.module.ts
│   ├── warehouse/          # Модуль складов
│   │   ├── dto/            # DTO для валидации
│   │   ├── warehouse.controller.ts
│   │   ├── warehouse.service.ts
│   │   ├── warehouse.entity.ts
│   │   ├── cargo.entity.ts
│   │   └── warehouse.module.ts
│   ├── app.module.ts       # Корневой модуль
│   └── main.ts             # Точка входа
├── test/                    # E2E тесты
└── dist/                    # Скомпилированный код
```

## Запуск проекта

```bash
# Режим разработки (с автоперезагрузкой)
npm run start:dev

# Обычный запуск
npm run start

# Режим отладки
npm run start:debug

# Продакшн режим (после сборки)
npm run build
npm run start:prod
```

Приложение будет доступно по адресу: `http://localhost:3000` (или порт, указанный в переменной окружения `PORT`)

## Запуск тестов

```bash
# Юнит-тесты
npm run test

# Тесты в режиме наблюдения
npm run test:watch

# E2E тесты
npm run test:e2e

# Покрытие кода тестами
npm run test:cov
```

## API Документация

Базовый URL: `http://localhost:3000`

### Общие эндпоинты

#### GET /

Получить приветственное сообщение

**Ответ:**

```json
"Hello World!"
```

---

### Управление пользователями (`/users`)

#### POST /users

Создать нового пользователя

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Валидация:**

- `email` - обязательное поле, должен быть валидным email
- `password` - обязательное поле, минимум 6 символов

#### GET /users

Получить список всех пользователей с пагинацией и фильтрацией

**Query параметры:**

- `page` - номер страницы (по умолчанию: 1, минимум: 1)
- `limit` - количество записей на странице (по умолчанию: 10, минимум: 1, максимум: 100)
- Фильтры (все опциональны):
  - `email` - поиск по email (частичное совпадение)
  - `firstName` - поиск по имени (частичное совпадение)
  - `lastName` - поиск по фамилии (частичное совпадение)
  - `middleName` - поиск по отчеству (частичное совпадение)
  - `position` - поиск по должности (частичное совпадение)
  - `department` - поиск по отделу (частичное совпадение)
  - `role` - фильтр по роли (`manager`)
  - `isActive` - фильтр по активности (true/false)
  - `createdAtFrom` - дата создания от (формат ISO 8601)
  - `createdAtTo` - дата создания до (формат ISO 8601)
  - `updatedAtFrom` - дата обновления от (формат ISO 8601)
  - `updatedAtTo` - дата обновления до (формат ISO 8601)

**Пример запроса:**

```
GET /users?page=1&limit=20&email=example&isActive=true&role=manager
```

**Формат ответа:**

```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "role": "manager",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET /users/:id

Получить пользователя по ID

**Параметры:**

- `id` - ID пользователя (число)

#### PATCH /users/:id

Обновить данные пользователя

**Параметры:**

- `id` - ID пользователя (число)

**Тело запроса (все поля опциональны):**

```json
{
  "email": "newemail@example.com",
  "password": "newpassword123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "middleName": "Иванович",
  "position": "Менеджер",
  "department": "Склад",
  "permission": "admin",
  "role": "manager",
  "isActive": true
}
```

#### DELETE /users/:id

Удалить пользователя

**Параметры:**

- `id` - ID пользователя (число)

---

### Управление складами (`/warehouse`)

#### POST /warehouse

Создать новый склад

**Тело запроса:**

```json
{
  "x": 100,
  "y": 100,
  "z": 100,
  "name": "Склад №1",
  "description": "Основной склад"
}
```

**Валидация:**

- `x`, `y`, `z` - обязательные поля, числа >= 1 (размеры склада)
- `name` - опциональное поле, строка
- `description` - опциональное поле, строка

#### GET /warehouse

Получить список всех складов (с грузами) с пагинацией и фильтрацией

**Query параметры:**

- `page` - номер страницы (по умолчанию: 1, минимум: 1)
- `limit` - количество записей на странице (по умолчанию: 10, минимум: 1, максимум: 100)
- Фильтры (все опциональны):
  - `name` - поиск по названию (частичное совпадение)
  - `description` - поиск по описанию (частичное совпадение)
  - `xMin`, `xMax` - фильтр по размеру X (диапазон)
  - `yMin`, `yMax` - фильтр по размеру Y (диапазон)
  - `zMin`, `zMax` - фильтр по размеру Z (диапазон)
  - `createdAtFrom` - дата создания от (формат ISO 8601)
  - `createdAtTo` - дата создания до (формат ISO 8601)
  - `updatedAtFrom` - дата обновления от (формат ISO 8601)
  - `updatedAtTo` - дата обновления до (формат ISO 8601)

**Пример запроса:**

```
GET /warehouse?page=1&limit=10&xMin=50&xMax=200&name=Склад
```

**Формат ответа:**

```json
{
  "data": [
    {
      "id": 1,
      "x": 100,
      "y": 100,
      "z": 100,
      "name": "Склад №1",
      "description": "Основной склад",
      "cargo": [],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET /warehouse/:id

Получить склад по ID (с грузами)

**Параметры:**

- `id` - ID склада (число)

#### PATCH /warehouse/:id

Обновить данные склада

**Параметры:**

- `id` - ID склада (число)

**Тело запроса (все поля опциональны):**

```json
{
  "x": 150,
  "y": 150,
  "z": 150,
  "name": "Обновленное название",
  "description": "Обновленное описание"
}
```

#### DELETE /warehouse/:id

Удалить склад

**Параметры:**

- `id` - ID склада (число)

---

### Управление грузами (`/warehouse/:id/cargo`)

#### POST /warehouse/:id/cargo

Добавить груз на склад

**Параметры:**

- `id` - ID склада (число)

**Тело запроса:**

```json
{
  "type": "cargo",
  "guid": "unique-guid-12345",
  "name": "Груз №1",
  "description": "Описание груза",
  "weight": 50.5,
  "sizeX": 10,
  "sizeY": 10,
  "sizeZ": 10,
  "transportNumber": "TR-12345",
  "storageDate": "2024-01-15T10:00:00Z",
  "x": 0,
  "y": 0,
  "z": 0
}
```

**Валидация:**

- `type` - обязательное поле, enum: `"container"` или `"cargo"`
- `guid` - обязательное поле, уникальная строка
- `name` - опциональное поле, строка
- `description` - опциональное поле, строка
- `weight` - обязательное поле, число >= 0
- `sizeX`, `sizeY`, `sizeZ` - обязательные поля, числа >= 1
- `containSizeX`, `containSizeY`, `containSizeZ` - обязательные поля, если `type === "container"`, числа >= 1
- `transportNumber` - опциональное поле, строка
- `storageDate` - опциональное поле, строка в формате ISO 8601
- `x`, `y`, `z` - обязательные поля, числа >= 0 (позиция на складе)

**Пример для контейнера:**

```json
{
  "type": "container",
  "guid": "container-guid-12345",
  "weight": 100,
  "sizeX": 20,
  "sizeY": 20,
  "sizeZ": 20,
  "containSizeX": 15,
  "containSizeY": 15,
  "containSizeZ": 15,
  "x": 0,
  "y": 0,
  "z": 0
}
```

#### GET /warehouse/:id/cargo

Получить список всех грузов на складе с пагинацией и фильтрацией

**Параметры:**

- `id` - ID склада (число)

**Query параметры:**

- `page` - номер страницы (по умолчанию: 1, минимум: 1)
- `limit` - количество записей на странице (по умолчанию: 10, минимум: 1, максимум: 100)
- Фильтры (все опциональны):
  - `guid` - поиск по GUID (частичное совпадение)
  - `type` - фильтр по типу (`container` или `cargo`)
  - `name` - поиск по названию (частичное совпадение)
  - `description` - поиск по описанию (частичное совпадение)
  - `netWeightMin`, `netWeightMax` - фильтр по чистому весу (диапазон)
  - `packWeightMin`, `packWeightMax` - фильтр по весу упаковки (диапазон)
  - `totalWeightMin`, `totalWeightMax` - фильтр по общему весу (диапазон)
  - `maxLoadWeightMin`, `maxLoadWeightMax` - фильтр по максимальной нагрузке (диапазон, только для контейнеров)
  - `sizeXMin`, `sizeXMax` - фильтр по размеру X (диапазон)
  - `sizeYMin`, `sizeYMax` - фильтр по размеру Y (диапазон)
  - `sizeZMin`, `sizeZMax` - фильтр по размеру Z (диапазон)
  - `transportNumber` - поиск по транспортному номеру (частичное совпадение)
  - `storageDateFrom` - дата хранения от (формат ISO 8601)
  - `storageDateTo` - дата хранения до (формат ISO 8601)
  - `xMin`, `xMax` - фильтр по позиции X на складе (диапазон)
  - `yMin`, `yMax` - фильтр по позиции Y на складе (диапазон)
  - `zMin`, `zMax` - фильтр по позиции Z на складе (диапазон)

**Пример запроса:**

```
GET /warehouse/1/cargo?page=1&limit=20&type=cargo&totalWeightMin=10&totalWeightMax=100
```

**Формат ответа:**

```json
{
  "data": [
    {
      "id": 1,
      "guid": "unique-guid-12345",
      "type": "cargo",
      "name": "Груз №1",
      "weight": 50.5,
      "sizeX": 10,
      "sizeY": 10,
      "sizeZ": 10,
      "x": 0,
      "y": 0,
      "z": 0,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### PATCH /warehouse/:id/cargo/:cargoId

Переместить груз на складе

**Параметры:**

- `id` - ID склада (число)
- `cargoId` - ID груза (число)

**Тело запроса:**

```json
{
  "x": 10,
  "y": 20,
  "z": 30
}
```

**Валидация:**

- `x`, `y`, `z` - обязательные поля, числа >= 0

#### PUT /warehouse/:id/cargo/:cargoId

Обновить данные груза

**Параметры:**

- `id` - ID склада (число)
- `cargoId` - ID груза (число)

**Тело запроса (все поля опциональны):**

```json
{
  "type": "container",
  "name": "Обновленное название",
  "description": "Обновленное описание",
  "weight": 75.5,
  "sizeX": 15,
  "sizeY": 15,
  "sizeZ": 15,
  "containSizeX": 12,
  "containSizeY": 12,
  "containSizeZ": 12,
  "transportNumber": "TR-54321"
}
```

**Примечание:** Поля `containSizeX`, `containSizeY`, `containSizeZ` обязательны только если `type === "container"`

#### DELETE /warehouse/:id/cargo/:cargoId

Удалить груз со склада

**Параметры:**

- `id` - ID склада (число)
- `cargoId` - ID груза (число)

---

## Пагинация и фильтрация

Все эндпоинты, возвращающие списки данных, поддерживают пагинацию и фильтрацию через query-параметры.

### Пагинация

Все списки поддерживают пагинацию через параметры:
- `page` - номер страницы (по умолчанию: 1, минимум: 1)
- `limit` - количество записей на странице (по умолчанию: 10, минимум: 1, максимум: 100)

**Формат ответа с пагинацией:**

```json
{
  "data": [...],  // Массив данных
  "meta": {
    "page": 1,           // Текущая страница
    "limit": 10,         // Количество записей на странице
    "total": 50,         // Общее количество записей
    "totalPages": 5      // Общее количество страниц
  }
}
```

### Фильтрация

Фильтры применяются через query-параметры. Доступные фильтры зависят от эндпоинта:

- **Строковые поля**: поддерживают частичный поиск (LIKE)
- **Числовые поля**: поддерживают диапазоны через `Min` и `Max` суффиксы
- **Даты**: поддерживают диапазоны через `From` и `To` суффиксы
- **Enum поля**: точное совпадение
- **Boolean поля**: точное совпадение (true/false)

**Примеры использования фильтров:**

```
# Поиск пользователей по email и фильтр по активности
GET /users?email=example&isActive=true

# Поиск складов по размеру
GET /warehouse?xMin=50&xMax=200&yMin=50&yMax=200

# Поиск грузов по типу и весу
GET /warehouse/1/cargo?type=cargo&totalWeightMin=10&totalWeightMax=100

# Комбинирование пагинации и фильтров
GET /users?page=2&limit=20&role=manager&createdAtFrom=2024-01-01T00:00:00Z
```

---

## Обработка ошибок

API возвращает стандартные HTTP коды статуса:

- `200 OK` - успешный запрос
- `201 Created` - ресурс успешно создан
- `400 Bad Request` - ошибка валидации данных
- `404 Not Found` - ресурс не найден
- `500 Internal Server Error` - внутренняя ошибка сервера

**Формат ошибки валидации:**

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
