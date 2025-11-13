# Vue Frontend - Инструкция по запуску

## Проверка работы

1. **Убедитесь, что FastAPI запущен:**
   ```bash
   cd /Users/vladimirlinev/Documents/GitHub/EngTutor
   source .venv/bin/activate
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Запустите Vue dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Откройте в браузере:**
   - http://localhost:5173

## Что должно работать:

- ✅ Навигация между страницами (Words, Practice, Assistant, Settings)
- ✅ Tailwind CSS стили применяются
- ✅ Роутинг работает
- ✅ API запросы через прокси `/api/*`

## Если что-то не работает:

1. Проверьте консоль браузера (F12 → Console)
2. Проверьте Network tab - работают ли запросы к API
3. Проверьте, что FastAPI запущен на порту 8000
4. Проверьте логи Vite dev server

## Структура:

- `src/App.vue` - главный компонент с навигацией
- `src/router/index.js` - роутинг
- `src/views/*.vue` - страницы
- `src/api/*.js` - API клиенты

