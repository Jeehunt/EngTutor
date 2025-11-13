#!/bin/bash
set -e

echo "🚀 Настройка сервера для EngTutor..."

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Ошибка: скрипт должен быть запущен от root"
    exit 1
fi

echo "📦 Обновление пакетов..."
apt update && apt upgrade -y

echo "🐳 Установка Docker..."
# Установка Docker (официальный репозиторий)
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker установлен"
else
    echo "✅ Docker уже установлен"
fi

echo "📦 Установка Node.js 20.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo "✅ Node.js установлен"
else
    echo "✅ Node.js уже установлен: $(node --version)"
fi

echo "🌐 Установка Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    echo "✅ Nginx установлен"
else
    echo "✅ Nginx уже установлен"
fi

echo "🐘 Установка PostgreSQL клиента..."
if ! command -v psql &> /dev/null; then
    apt install -y postgresql-client
    echo "✅ PostgreSQL клиент установлен"
else
    echo "✅ PostgreSQL клиент уже установлен"
fi

echo "📝 Установка Git..."
if ! command -v git &> /dev/null; then
    apt install -y git
    echo "✅ Git установлен"
else
    echo "✅ Git уже установлен"
fi

echo "🔥 Настройка Firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
echo "✅ Firewall настроен"

echo "📁 Создание директории проекта..."
mkdir -p /var/www/EngTutor
chown -R root:root /var/www/EngTutor
echo "✅ Директория создана: /var/www/EngTutor"

echo ""
echo "✅ Настройка сервера завершена!"
echo ""
echo "Следующие шаги:"
echo "1. cd /var/www/EngTutor"
echo "2. git clone https://github.com/Jeehunt/EngTutor.git ."
echo "3. cp .env.production.example .env.production"
echo "4. nano .env.production  # Заполнить значения"
echo "5. ./scripts/deploy_server.sh"

