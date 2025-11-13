#!/bin/bash
set -e

echo "🚀 Деплой EngTutor на сервер..."

# Переход в директорию проекта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

echo "📂 Рабочая директория: $PROJECT_DIR"

# Проверка окружения
echo "🔍 Проверка окружения..."
if ! command -v docker &> /dev/null; then
    echo "❌ Ошибка: Docker не установлен"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Ошибка: Node.js не установлен"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Ошибка: Git не установлен"
    exit 1
fi

# Проверка .env.production
if [ ! -f .env.production ]; then
    echo "❌ Ошибка: файл .env.production не найден"
    echo "Создайте его из .env.production.example"
    exit 1
fi

# Загрузка переменных окружения
set -a
source .env.production
set +a

echo "🛑 Остановка существующих контейнеров..."
docker compose -f docker-compose.prod.yml down || true

echo "📥 Обновление кода из Git..."
git fetch origin
git pull origin main || git pull origin master || true

echo "🏗️  Сборка frontend..."
cd frontend
if [ ! -d node_modules ]; then
    echo "📦 Установка npm зависимостей..."
    npm ci
else
    echo "📦 Обновление npm зависимостей..."
    npm ci
fi
echo "🔨 Сборка production версии..."
npm run build
cd ..

echo "🗄️  Применение миграций БД..."
docker compose -f docker-compose.prod.yml run --rm backend alembic upgrade head || echo "⚠️  Миграции не применены (возможно, БД еще не создана)"

echo "🐳 Сборка и запуск контейнеров..."
docker compose -f docker-compose.prod.yml up -d --build

echo "⏳ Ожидание готовности сервисов..."
sleep 5

# Проверка здоровья контейнеров
echo "🏥 Проверка здоровья контейнеров..."
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml ps | grep -q "Up (healthy)"; then
        echo "✅ Сервисы запущены и здоровы"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Таймаут ожидания готовности сервисов"
    fi
    sleep 2
done

echo ""
echo "📊 Статус контейнеров:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "Проверьте приложение:"
echo "  - Frontend: http://$(hostname -I | awk '{print $1}')"
echo "  - API: http://$(hostname -I | awk '{print $1}')/api/words?page=1&per_page=5"

