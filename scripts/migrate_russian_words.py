#!/usr/bin/env python3
"""
Миграция русских слов: перевод текстов в английский и заполнение полей.

Usage:
  python -m scripts.migrate_russian_words
"""

import os
import sys
import re
import time
from app.database import get_session, init_models
from app.models import Word
from app.services.enrichment import _enrich_single_openai


def detect_russian_text(text: str) -> bool:
    return bool(text and re.search(r"[а-яё]", text.lower()))


def migrate_russian_words() -> None:
    print("🚀 Начинаю миграцию русских слов...")
    init_models()
    session = next(get_session())
    try:
        russian_words = [w for w in session.query(Word).filter(Word.text.isnot(None)).all() if detect_russian_text(w.text)]
        if not russian_words:
            print("✅ Русских слов в базе не найдено")
            return
        print(f"📚 Найдено {len(russian_words)} русских слов для миграции")
        chunk_size = 5
        for i in range(0, len(russian_words), chunk_size):
            chunk = russian_words[i:i + chunk_size]
            print(f"\n🔄 Обрабатываю группу {(i // chunk_size) + 1}/{(len(russian_words) + chunk_size - 1) // chunk_size} ({len(chunk)} слов)")
            for word in chunk:
                try:
                    print(f"  📝 Обрабатываю: '{word.text}' (ID: {word.id})")
                    _enrich_single_openai(word.id, word.text, force_overwrite=True)
                    print(f"  ✅ Обработано: '{word.text}'")
                except Exception as e:
                    print(f"  ❌ Ошибка при обработке '{word.text}': {e}")
                    continue
            if i + chunk_size < len(russian_words):
                print("  ⏳ Пауза 10 секунд перед следующей группой...")
                time.sleep(10)
        print(f"\n🎉 Миграция завершена! Обработано {len(russian_words)} слов")
        total_words = session.query(Word).count()
        english_words = [w for w in session.query(Word).filter(Word.text.isnot(None)).all() if not detect_russian_text(w.text)]
        print("\n📊 Статистика после миграции:")
        print(f"  Всего слов: {total_words}")
        print(f"  Английских слов: {len(english_words)}")
        print(f"  Русских слов: {total_words - len(english_words)}")
    finally:
        session.close()


if __name__ == "__main__":
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Ошибка: OPENAI_API_KEY не установлен")
        sys.exit(1)
    if not os.getenv("DATABASE_URL"):
        print("❌ Ошибка: DATABASE_URL не установлен")
        sys.exit(1)
    print("🔧 Проверка окружения...")
    print(f"  DATABASE_URL: {'✅' if os.getenv('DATABASE_URL') else '❌'}")
    print(f"  OPENAI_API_KEY: {'✅' if os.getenv('OPENAI_API_KEY') else '❌'}")
    migrate_russian_words()


