# План развертывания EngTutor на Ubuntu 24.04 LTS

## Обзор
Полностью автоматизированное развертывание EngTutor на сервере 91.239.23.141 (Ubuntu 24.04 LTS) с синхронизацией кода через Git и скриптами для синхронизации БД. Все действия выполняются автоматически без участия пользователя.

## Файлы для создания/изменения

### 1. Dockerfile для Backend
**Новый файл: `Dockerfile`**
- Базовый образ: `python:3.11-slim`
- Установка зависимостей из `requirements.txt`
- Копирование `app/`, `alembic/`, `alembic.ini`
- Запуск uvicorn на порту 8000
- Рабочая директория: `/app`

### 2. Dockerfile для Frontend Build
**Новый файл: `Dockerfile.frontend`**
- Базовый образ: `node:20-alpine`
- Установка npm зависимостей
- Сборка через `npm run build`
- Результат в `frontend/dist/`
- Multi-stage build для минимального размера

### 3. Production Docker Compose
**Новый файл: `docker-compose.prod.yml`**
- `db`: PostgreSQL 16-alpine с volume `pgdata`
- `backend`: FastAPI контейнер из Dockerfile
- `nginx`: Reverse proxy для API и статики
- Все сервисы в одной Docker сети
- Health checks для db и backend
- Restart policies: `unless-stopped`

### 4. Nginx конфигурация
**Новый файл: `nginx/nginx.conf`**
- Проксирование `/api/*` на `backend:8000`
- Статика из `/usr/share/nginx/html` (монтируется `frontend/dist`)
- SPA fallback: все не-API запросы → `index.html` (для Vue Router)
- Логирование в `/var/log/nginx/`
- Gzip compression
- Client max body size: 10M

### 5. Скрипт первоначальной настройки сервера
**Новый файл: `scripts/setup_server.sh`**
- Проверка прав root
- Обновление пакетов: `apt update && apt upgrade -y`
- Установка Docker (официальный репозиторий Docker)
- Установка Docker Compose v2 (как plugin)
- Установка Node.js 20.x через NodeSource
- Установка Nginx: `apt install -y nginx`
- Установка PostgreSQL клиента: `apt install -y postgresql-client`
- Установка Git: `apt install -y git`
- Настройка firewall (ufw): порты 22, 80, 443
- Создание директории `/var/www/EngTutor`
- Настройка прав доступа

### 6. Скрипт деплоя на сервере
**Новый файл: `scripts/deploy_server.sh`**
- Проверка окружения (Docker, Node.js, Git)
- Переход в директорию проекта
- Остановка контейнеров: `docker-compose -f docker-compose.prod.yml down`
- Git pull: `git pull origin main` (или текущая ветка)
- Загрузка переменных из `.env.production`
- Сборка frontend: `cd frontend && npm ci && npm run build && cd ..`
- Применение миграций: `docker-compose -f docker-compose.prod.yml run --rm backend alembic upgrade head`
- Сборка и запуск контейнеров: `docker-compose -f docker-compose.prod.yml up -d --build`
- Проверка здоровья: ожидание готовности backend и nginx
- Вывод статуса контейнеров: `docker-compose -f docker-compose.prod.yml ps`

### 7. Скрипт деплоя из локалки
**Новый файл: `scripts/deploy.sh`**
- Проверка наличия изменений: `git status`
- Git push: `git push origin main` (или текущая ветка)
- SSH подключение к серверу: `ssh root@91.239.23.141`
- Выполнение `deploy_server.sh` на сервере
- Вывод логов выполнения
- Проверка результата (HTTP запрос к API)

### 8. Скрипт синхронизации БД
**Новый файл: `scripts/sync_db.sh`**
- Параметры: `--to-server` или `--from-server`
- Чтение DATABASE_URL из локального `.env` и серверного `.env.production`
- Для `--to-server`:
  - `pg_dump` локальной БД → временный файл
  - Передача через `scp` на сервер
  - `psql` на сервере для восстановления
  - Очистка временных файлов
- Для `--from-server`:
  - `pg_dump` на сервере через SSH
  - Сохранение в локальный файл
  - `psql` локально для восстановления
  - Очистка временных файлов
- Валидация подключений перед синхронизацией
- Подтверждение перед выполнением (опционально, флаг `--yes`)

### 9. Environment файлы
**Новый файл: `.env.production.example`**
- Шаблон с комментариями для всех переменных
- `DATABASE_URL=postgresql+psycopg://engtutor:PASSWORD@db:5432/engtutor`
- `DB_PASSWORD=your_secure_password`
- `OPENAI_API_KEY=your_openai_key`
- Все необходимые переменные окружения

**Новый файл: `.env.production`** (создается на сервере, не коммитится)
- Реальные значения для production

### 10. Обновление .gitignore
**Обновить: `.gitignore`**
- Добавить `.env.production`
- Добавить `frontend/dist/` (будет собираться на сервере)
- Убедиться что `*.log`, `__pycache__/` уже есть

### 11. Обновление FastAPI для production статики
**Обновить: `app/main.py`**
- Проверка существования `frontend/dist` перед монтированием
- Монтирование `frontend/dist` как статика на `/`
- SPA fallback: все GET запросы не начинающиеся с `/api` → `index.html`
- Сохранение существующих API endpoints

## Пошаговая реализация

### Этап 1: Подготовка локальных файлов (выполняется автоматически)

1. Создать `Dockerfile` для backend
2. Создать `Dockerfile.frontend` для сборки frontend
3. Создать `docker-compose.prod.yml` с полным стеком
4. Создать `nginx/nginx.conf` с правильной конфигурацией
5. Создать `scripts/setup_server.sh` для первоначальной настройки
6. Создать `scripts/deploy_server.sh` для деплоя на сервере
7. Создать `scripts/deploy.sh` для деплоя из локалки
8. Создать `scripts/sync_db.sh` для синхронизации БД
9. Создать `.env.production.example` как шаблон
10. Обновить `.gitignore`
11. Обновить `app/main.py` для production статики

### Этап 2: Первоначальная настройка сервера (выполняется автоматически)

1. Подключение к серверу через SSH: `ssh root@91.239.23.141`
2. Выполнение `setup_server.sh`:
   ```bash
   # Вариант A: через SSH из локалки
   ssh root@91.239.23.141 'bash -s' < scripts/setup_server.sh
   
   # Вариант B: вручную на сервере
   # Скопировать setup_server.sh на сервер и выполнить
   ```
3. Клонирование репозитория (если еще не клонирован):
   ```bash
   cd /var/www
   git clone <repository-url> EngTutor
   cd EngTutor
   ```
4. Создание `.env.production`:
   ```bash
   cp .env.production.example .env.production
   # Редактирование .env.production с реальными значениями
   ```

### Этап 3: Первый деплой (выполняется автоматически)

1. Из локальной директории проекта:
   ```bash
   ./scripts/deploy.sh
   ```
   Или вручную на сервере:
   ```bash
   ssh root@91.239.23.141
   cd /var/www/EngTutor
   ./scripts/deploy_server.sh
   ```

### Этап 4: Последующие деплои (выполняется автоматически)

Из локалки:
```bash
./scripts/deploy.sh
```

Это автоматически:
- Делает git push
- Подключается к серверу
- Выполняет deploy_server.sh
- Проверяет результат

### Этап 5: Синхронизация БД (по необходимости)

**Из локалки на сервер:**
```bash
./scripts/sync_db.sh --to-server
```

**С сервера на локалку:**
```bash
./scripts/sync_db.sh --from-server
```

## Детали реализации для Ubuntu 24.04 LTS

### Установка Docker (официальный репозиторий)
```bash
# Добавление GPG ключа
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление репозитория
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Проверка
docker --version
docker compose version
```

### Установка Node.js 20.x (NodeSource)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version
```

### Установка Nginx
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### Установка PostgreSQL клиента
```bash
apt install -y postgresql-client
```

### Настройка Firewall (ufw)
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
ufw status
```

## Структура на сервере

```
/var/www/EngTutor/
├── app/                      # Backend код
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── routers/
├── frontend/                 # Frontend исходники
│   ├── dist/                 # Собранный frontend (генерируется)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── alembic/                  # Миграции БД
│   ├── versions/
│   └── env.py
├── scripts/                  # Скрипты деплоя и синхронизации
│   ├── setup_server.sh
│   ├── deploy_server.sh
│   └── sync_db.sh
├── nginx/                    # Nginx конфигурация
│   └── nginx.conf
├── docker-compose.prod.yml   # Production Docker Compose
├── Dockerfile                # Backend образ
├── Dockerfile.frontend       # Frontend build образ
├── .env.production           # Production env (не в Git)
├── .env.production.example   # Шаблон env
├── requirements.txt
├── alembic.ini
└── logs/                     # Логи приложения
```

## Docker Compose Production конфигурация

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: engtutor-db
    environment:
      POSTGRES_USER: engtutor
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: engtutor
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U engtutor -d engtutor"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: engtutor-backend
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - .env.production
    environment:
      - DATABASE_URL=postgresql+psycopg://engtutor:${DB_PASSWORD}@db:5432/engtutor
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/words?page=1&per_page=1"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: engtutor-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  pgdata:
```

## Безопасность

1. **Firewall**: только порты 22 (SSH), 80 (HTTP), 443 (HTTPS)
2. **SSL/TLS**: настройка через Let's Encrypt (опционально, после деплоя)
3. **.env файлы**: в .gitignore, не коммитятся
4. **Бэкапы БД**: cron job для ежедневных дампов (опционально, можно добавить позже)
5. **Пароли БД**: хранятся в .env.production, не в Git

## Workflow разработки

1. **Локальные изменения** → commit → `./scripts/deploy.sh`
2. **Автоматически**: git push → SSH на сервер → deploy_server.sh → проверка
3. **Синхронизация БД**: `./scripts/sync_db.sh --to-server` или `--from-server`

## Проверка работоспособности

После деплоя автоматически проверяется:
- Backend API: `curl http://91.239.23.141/api/words?page=1&per_page=5`
- Frontend: открыть `http://91.239.23.141` в браузере
- Логи: `docker-compose -f docker-compose.prod.yml logs -f`

## Важные замечания

1. Все скрипты должны быть исполняемыми: `chmod +x scripts/*.sh`
2. На сервере должен быть настроен SSH доступ с ключом (или паролем из правил)
3. Git репозиторий должен быть доступен с сервера (публичный или с настроенным доступом)
4. Первый запуск может занять время из-за сборки образов и установки npm зависимостей
5. Миграции БД применяются автоматически при каждом деплое

## Данные для доступа к серверу

- **IP**: 91.239.23.141
- **Пользователь**: root
- **Пароль**: UK9pbZLP

