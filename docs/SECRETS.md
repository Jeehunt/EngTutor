# Секреты (Secrets) - что это и как использовать

## Что такое секреты?

**Секреты** - это конфиденциальные данные (пароли, API ключи, токены), которые:
- Не должны попадать в Git
- Должны храниться безопасно
- Должны быть доступны только приложению в runtime

## Типы секретов в вашем проекте

### 1. API ключи
- `OPENAI_API_KEY` - ключ для OpenAI API
- `ANTHROPIC_API_KEY` - ключ для Anthropic (legacy)

### 2. Пароли базы данных
- `DB_PASSWORD` - пароль для PostgreSQL
- `DATABASE_URL` - полная строка подключения (содержит пароль)

### 3. Другие конфиденциальные данные
- SSH ключи
- Токены доступа к сервисам

## Где хранить секреты?

### ✅ Правильно (текущий подход)

**Локально:**
- Файл `.env` (в `.gitignore`)
- Загружается через `python-dotenv` в `app/database.py`

**На сервере:**
- Файл `.env.production` (в `.gitignore`)
- Загружается в `docker-compose.prod.yml` через `env_file`

**В Git:**
- Только шаблоны: `sample.env`, `.env.production.example`
- Без реальных значений

### ❌ Неправильно

- Коммитить `.env` файлы в Git
- Хранить секреты в коде
- Передавать секреты через командную строку (видны в `ps aux`)

## GitHub Secrets (для автоматического деплоя)

Если вы решите использовать GitHub Actions, можно использовать GitHub Secrets:

### Как добавить секрет в GitHub:

1. Откройте репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret
4. Добавьте:
   - `SERVER_HOST` = `91.239.23.141`
   - `SERVER_USER` = `root`
   - `SSH_PRIVATE_KEY` = содержимое `~/.ssh/id_ed25519_engtutor`
   - `OPENAI_API_KEY` = ваш ключ OpenAI

### Использование в GitHub Actions:

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd /var/www/EngTutor
      ./scripts/deploy_server.sh
```

## Безопасность секретов

### ✅ Хорошие практики:

1. **Никогда не коммитить секреты в Git**
   - Проверьте: `git log --all --full-history -- .env`

2. **Использовать разные секреты для dev и production**
   - Локально: `.env`
   - На сервере: `.env.production`

3. **Регулярно ротировать секреты**
   - Меняйте пароли БД раз в несколько месяцев
   - Обновляйте API ключи при утечке

4. **Ограничивать доступ к секретам**
   - `.env.production` доступен только root на сервере
   - Права: `chmod 600 .env.production`

5. **Не логировать секреты**
   - В коде нет `print(OPENAI_API_KEY)`
   - В логах не выводятся пароли

### ❌ Плохие практики:

- Хранить секреты в коде
- Передавать через URL параметры
- Использовать один секрет для всех окружений
- Делиться секретами в чатах/email

## Текущая реализация в проекте

### Локально:
```bash
# .env (не в Git)
DATABASE_URL=postgresql+psycopg://engtutor:engtutor@localhost:5432/engtutor
OPENAI_API_KEY=sk-proj-...
```

### На сервере:
```bash
# .env.production (не в Git)
DB_PASSWORD=engtutor_prod_abc123...
DATABASE_URL=postgresql+psycopg://engtutor:${DB_PASSWORD}@db:5432/engtutor
OPENAI_API_KEY=sk-proj-...
```

### В Git (только шаблоны):
```bash
# sample.env
DATABASE_URL=postgresql+psycopg://engtutor:engtutor@localhost:5432/engtutor
OPENAI_API_KEY=your_openai_api_key_here
```

## Проверка безопасности

### Проверить, нет ли секретов в Git:
```bash
# Поиск возможных API ключей
git log --all --full-history -p | grep -i "sk-"

# Поиск паролей
git log --all --full-history -p | grep -i "password"
```

### Проверить права на .env файлы:
```bash
# Локально
ls -la .env

# На сервере
ssh engtutor-server 'ls -la /var/www/EngTutor/.env.production'
```

## Рекомендации

1. **Текущий подход правильный** - секреты в `.env` файлах, не в Git
2. **Для автоматического деплоя** - используйте GitHub Secrets
3. **Регулярно проверяйте** - нет ли секретов в истории Git
4. **Ротируйте секреты** - меняйте пароли и ключи периодически

