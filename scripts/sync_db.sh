#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

usage() {
    echo "Использование: $0 [--to-server|--from-server] [--yes]"
    echo ""
    echo "Опции:"
    echo "  --to-server    Синхронизировать БД с локальной на сервер"
    echo "  --from-server  Синхронизировать БД с сервера на локальную"
    echo "  --yes          Пропустить подтверждение"
    exit 1
}

# Проверка аргументов
if [ $# -eq 0 ]; then
    usage
fi

DIRECTION=""
SKIP_CONFIRM=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --to-server)
            DIRECTION="to-server"
            shift
            ;;
        --from-server)
            DIRECTION="from-server"
            shift
            ;;
        --yes)
            SKIP_CONFIRM=true
            shift
            ;;
        *)
            echo -e "${RED}❌ Неизвестный аргумент: $1${NC}"
            usage
            ;;
    esac
done

if [ -z "$DIRECTION" ]; then
    echo -e "${RED}❌ Необходимо указать направление: --to-server или --from-server${NC}"
    usage
fi

# Загрузка переменных окружения
if [ "$DIRECTION" = "to-server" ]; then
    if [ -f "$PROJECT_DIR/.env" ]; then
        source "$PROJECT_DIR/.env"
    else
        echo -e "${RED}❌ Файл .env не найден в $PROJECT_DIR${NC}"
        exit 1
    fi
    LOCAL_DB_URL="$DATABASE_URL"
    echo -e "${GREEN}📥 Локальная БД:${NC} $LOCAL_DB_URL"
else
    # Для from-server нужно получить DATABASE_URL с сервера
    echo -e "${YELLOW}📥 Получение DATABASE_URL с сервера...${NC}"
    REMOTE_DB_URL=$(ssh engtutor-server "cd /var/www/EngTutor && source .env.production && echo \$DATABASE_URL")
    if [ -z "$REMOTE_DB_URL" ]; then
        echo -e "${RED}❌ Не удалось получить DATABASE_URL с сервера${NC}"
        exit 1
    fi
    echo -e "${GREEN}📥 Серверная БД:${NC} $REMOTE_DB_URL"
fi

# Подтверждение
if [ "$SKIP_CONFIRM" = false ]; then
    if [ "$DIRECTION" = "to-server" ]; then
        echo -e "${YELLOW}⚠️  ВНИМАНИЕ: Это перезапишет БД на сервере данными с локальной машины!${NC}"
    else
        echo -e "${YELLOW}⚠️  ВНИМАНИЕ: Это перезапишет локальную БД данными с сервера!${NC}"
    fi
    read -p "Продолжить? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "❌ Отменено"
        exit 1
    fi
fi

# Создание временного файла для дампа
DUMP_FILE="/tmp/engtutor_dump_$(date +%Y%m%d_%H%M%S).sql"

if [ "$DIRECTION" = "to-server" ]; then
    echo -e "${GREEN}📤 Создание дампа локальной БД...${NC}"
    pg_dump "$LOCAL_DB_URL" > "$DUMP_FILE" || {
        echo -e "${RED}❌ Ошибка при создании дампа${NC}"
        exit 1
    }
    
    echo -e "${GREEN}📤 Передача дампа на сервер...${NC}"
    scp "$DUMP_FILE" engtutor-server:/tmp/engtutor_dump.sql || {
        echo -e "${RED}❌ Ошибка при передаче дампа${NC}"
        rm -f "$DUMP_FILE"
        exit 1
    }
    
    echo -e "${GREEN}📥 Восстановление БД на сервере...${NC}"
    ssh engtutor-server << ENDSSH
        cd /var/www/EngTutor
        source .env.production
        export PGPASSWORD=\$DB_PASSWORD
        psql -h db -U engtutor -d engtutor -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" || true
        psql -h db -U engtutor -d engtutor < /tmp/engtutor_dump.sql
        rm -f /tmp/engtutor_dump.sql
        echo "✅ БД восстановлена на сервере"
ENDSSH
    
    rm -f "$DUMP_FILE"
    echo -e "${GREEN}✅ Синхронизация завершена: локальная → сервер${NC}"
else
    echo -e "${GREEN}📤 Создание дампа БД на сервере...${NC}"
    ssh engtutor-server << ENDSSH
        cd /var/www/EngTutor
        source .env.production
        export PGPASSWORD=\$DB_PASSWORD
        pg_dump -h db -U engtutor -d engtutor > /tmp/engtutor_dump.sql
        echo "✅ Дамп создан на сервере"
ENDSSH
    
    echo -e "${GREEN}📥 Скачивание дампа с сервера...${NC}"
    scp engtutor-server:/tmp/engtutor_dump.sql "$DUMP_FILE" || {
        echo -e "${RED}❌ Ошибка при скачивании дампа${NC}"
        exit 1
    }
    
    echo -e "${GREEN}📥 Восстановление локальной БД...${NC}"
    if [ -f "$PROJECT_DIR/.env" ]; then
        source "$PROJECT_DIR/.env"
        export PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
        psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" || true
        psql "$DATABASE_URL" < "$DUMP_FILE" || {
            echo -e "${RED}❌ Ошибка при восстановлении БД${NC}"
            rm -f "$DUMP_FILE"
            exit 1
        }
    else
        echo -e "${RED}❌ Файл .env не найден${NC}"
        rm -f "$DUMP_FILE"
        exit 1
    fi
    
    # Очистка на сервере
    ssh engtutor-server "rm -f /tmp/engtutor_dump.sql"
    rm -f "$DUMP_FILE"
    echo -e "${GREEN}✅ Синхронизация завершена: сервер → локальная${NC}"
fi

