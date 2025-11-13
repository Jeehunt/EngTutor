# Модернизация EngTutor под стандарты

## Анализ текущего состояния

**Соответствует инструкциям:**

- Backend: FastAPI (ASGI) + Uvicorn ✓
- База данных: PostgreSQL ✓

**Не соответствует:**

- Frontend: Jinja2 SSR + Bootstrap + vanilla JS ✗ (требуется Vue 3 + Tailwind)
- Устаревшие версии зависимостей (FastAPI 0.104.1 → 0.115+, OpenAI 1.12.0 → 1.40+)
- Устаревшие паттерны FastAPI (`@app.on_event` → `lifespan`)
- Нет системы миграций (ручные ALTER TABLE → Alembic)

## Этапы модернизации

### Этап 1: Обновление зависимостей и рефакторинг Backend

**Файлы:**

- `requirements.txt` - обновить версии
- `app/main.py` - заменить `@app.on_event` на `lifespan`
- `app/routers/*.py` - заменить threading на `BackgroundTasks`
- `app/database.py` - убрать ручные миграции

**Действия:**

1. Обновить `requirements.txt`:

   - FastAPI: 0.104.1 → 0.115.0+
   - OpenAI: 1.12.0 → 1.40.0+
   - Uvicorn: 0.35.0 → 0.32.0+
   - Добавить `alembic==1.13.0`
   - Удалить `anthropic` (legacy)

2. Рефакторинг `app/main.py`:

   - Заменить `@app.on_event("startup")` на `lifespan` context manager
   - Использовать `async def` для lifespan

3. Рефакторинг фоновых задач:

   - В `app/routers/maintenance.py` и других местах заменить `threading.Thread` на `BackgroundTasks.add_task()`

4. Настройка Alembic:

   - Инициализировать `alembic init alembic`
   - Создать начальную миграцию из текущей схемы
   - Перенести логику авто-миграций из `init_models()` в миграции

### Этап 2: Переписывание Frontend на Vue 3 + Tailwind

**Структура:**

```
frontend/
  src/
    components/     # Vue компоненты
    views/          # Страницы (Words, Practice, Assistant, Settings)
    router/         # Vue Router
    api/            # API клиент для FastAPI
    composables/    # Композиции (useWords, usePractice, etc.)
  public/
  package.json
  vite.config.js   # Vite для сборки
  tailwind.config.js
```

**Файлы для переписывания:**

- `app/templates/*.html` → `frontend/src/views/*.vue`
- `app/static/styles.css` → Tailwind utility classes + компоненты
- Весь vanilla JS → Vue 3 Composition API

**Действия:**

1. Инициализировать Vue 3 проект:

   - Создать `frontend/` директорию
   - Настроить Vite + Vue 3 + TypeScript опционально
   - Установить Tailwind CSS + готовую UI библиотеку (PrimeVue / Vuetify / Quasar)

2. Настроить API клиент:

   - Создать `frontend/src/api/client.ts` с axios/fetch
   - Обернуть все FastAPI endpoints в типизированные функции

3. Переписать страницы:

   - **Words** (`words.html` → `Words.vue`): таблица, поиск, пагинация, плавающая панель действий
   - **Practice** (`practice.html` → `Practice.vue`): 4 режима упражнений
   - **Assistant** (`assistant.html` → `Assistant.vue`): чат с фиксированным вводом
   - **Settings** (`settings.html` → `Settings.vue`)

4. Настроить роутинг:

   - Vue Router для SPA навигации
   - FastAPI отдаёт только API endpoints (убрать Jinja2 шаблоны)

5. Стилизация:

   - Переписать все CSS на Tailwind utility classes
   - Использовать готовые UI компоненты для таблиц, форм, модалок

### Этап 3: Интеграция Frontend и Backend

**Файлы:**

- `app/main.py` - настроить CORS для Vue dev server
- `app/main.py` - убрать Jinja2 templates, оставить только API
- Создать API endpoints для всех данных (JSON вместо HTML)

**Действия:**

1. Настроить CORS в FastAPI для `http://localhost:5173` (Vite dev)
2. Преобразовать все `TemplateResponse` в `JSONResponse`
3. Настроить production сборку: Vite build → `frontend/dist/` → FastAPI отдаёт статику

### Этап 4: Тестирование и финализация

**Действия:**

1. Протестировать все функции:

   - Управление словарём (CRUD)
   - Практика (4 режима)
   - Ассистент (чат + авто-добавление слов)
   - Настройки

2. Проверить производительность:

   - Загрузка больших списков слов
   - Фоновые задачи обогащения

3. Обновить документацию:

   - `README.md` - новая структура проекта
   - Инструкции по запуску Vue dev server

## Преимущества модернизации

**Backend:**

- Актуальные версии с исправлениями безопасности
- Современные async паттерны (lifespan)
- Правильная система миграций (Alembic)
- Лучшая производительность (новые версии FastAPI)

**Frontend:**

- Современный SPA подход (Vue 3)
- Быстрая разработка с готовыми компонентами
- Tailwind для быстрой стилизации
- Лучший UX (реактивность, анимации)
- Типизация с TypeScript (опционально)

**Архитектура:**

- Разделение Backend (API) и Frontend (SPA)
- Легче масштабировать и тестировать
- Можно переиспользовать API для мобильных приложений