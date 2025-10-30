# 🧩 WB Tariff Sync Service

## 📖 Описание

Сервис решает **две задачи**:

1. **Ежечасное получение тарифов WB** (API `https://common-api.wildberries.ru/api/v1/tariffs/box`)
   — данные нормализуются и сохраняются в PostgreSQL (одна запись в день для каждого склада).

2. **Ежечасное обновление Google Sheets**
   — актуальные тарифы выгружаются из БД в Google Sheets (`stocks_coefs`), отсортированные по коэффициенту.

Приложение запускается одной командой:

```bash
docker compose up
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

# Google Sheets
# Укажи нужные ID таблиц через запятую — именно они будут использоваться при экспорте данных
GSHEETS_IDS=1AbCDeF...,1XyZ...

# Путь к JSON-ключу сервисного аккаунта (Docker secret)
GSHEETS_SA_JSON_PATH=/run/secrets/gsa_key.json
```

> ⚠️ Важно: Убедись, что в переменной `GSHEETS_IDS` указаны корректные идентификаторы Google-таблиц, куда должен выполняться экспорт.
> Таблица `spreadsheets` в БД заполняется автоматически на основе этих ID при первом запуске.

---

## 🚀 Запуск

### 1. Сборка и запуск

```bash
docker compose up
```

При первом запуске:

* пройдут миграции (`knex migrate:latest`)
* выполнится первичная загрузка данных WB
* таблица `spreadsheets` автоматически наполнится из `GSHEETS_IDS`
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

1. Убедись, что в `.env` заданы реальные ID таблиц в `GSHEETS_IDS`
2. В логах должны появиться сообщения о синхронизации WB и экспорте в Sheets
3. В PostgreSQL должны появиться таблицы `regions`, `warehouses`, `wb_tariffs_daily`, `spreadsheets`
4. В Google Sheets должен появиться лист `stocks_coefs`
