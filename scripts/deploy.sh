#!/bin/bash
set -e

echo "🚀 Деплой EngTutor на сервер из локальной машины..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# Проверка наличия изменений
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Обнаружены незакоммиченные изменения:"
    git status --short
    read -p "Продолжить деплой? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Деплой отменен"
        exit 1
    fi
fi

# Определение текущей ветки
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
fi

echo "📤 Push в Git (ветка: $CURRENT_BRANCH)..."
git push origin "$CURRENT_BRANCH" || {
    echo "⚠️  Push не удался, возможно нет изменений"
}

echo "🔌 Подключение к серверу и выполнение деплоя..."
ssh engtutor-server << 'ENDSSH'
    cd /var/www/EngTutor
    if [ ! -d .git ]; then
        echo "❌ Репозиторий не найден. Выполните сначала setup_server.sh"
        exit 1
    fi
    ./scripts/deploy_server.sh
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Деплой успешно завершен!"
    echo ""
    echo "Проверьте приложение:"
    echo "  - http://91.239.23.141"
    echo "  - http://91.239.23.141/api/words?page=1&per_page=5"
else
    echo "❌ Ошибка при деплое"
    exit 1
fi

