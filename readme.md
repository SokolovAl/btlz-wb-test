# WB Tariff Sync Service

## 📖 Описание

Сервис решает **две задачи**:

1. **Ежечасное получение тарифов WB** (API `https://common-api.wildberries.ru/api/v1/tariffs/box`)
   — данные нормализуются и сохраняются в PostgreSQL (одна запись в день для каждого склада).

2. **Ежечасное обновление Google Sheets**
   — актуальные тарифы выгружаются из БД в Google Sheets (`stocks_coefs`), отсортированные по коэффициенту.

Приложение запускается одной командой:

```bash
docker compose up --build
```
---

## 🗂️ Переменные окружения

Пример файла `.env` :

```dotenv
# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Приложение
APP_PORT=5000

# Wildberries API
WB_API_URL=https://common-api.wildberries.ru/api/v1/tariffs/box
WB_API_TOKEN=YOUR_WB_TOKEN_HERE

GSHEETS_SA_PATH=/app/secrets/service-account.json
```
---

## 🚀 Запуск

### 1. Сборка и запуск

```bash
docker compose up
```

При первом запуске:

* пройдут миграции (`knex migrate:latest`)
* загрузятся данные WB
* выполнится первичная выгрузка в Google Sheets
* запустится cron-задача (`0 * * * *`)

---

### 2. Логи

```bash
docker compose logs -f app
```

Пример вывода:

```
Launch
Migrations applied successfully
Seeds completed successfully
Synchronization completed
Google Sheets export completed successfully
Cron: Launch WB tariff synchronization
```
---

## 🛋️ Проверка функциональности

1. В логах должны появиться сообщения о синхронизации WB и экспорте в Sheets
2. В PostgreSQL должна появиться таблицы `regions, warehouses, wb_tariffs_daily`
3. В Google Sheets должен появиться лист `stocks_coefs`
