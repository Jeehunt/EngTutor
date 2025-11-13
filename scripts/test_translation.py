#!/usr/bin/env python3
"""
Тестирование перевода русского слова через OpenAI обогащение.

Usage:
  python -m scripts.test_translation
"""

import os
import sys
from app.database import get_session, init_models
from app.models import Word
from app.services.enrichment import _enrich_single_openai


def test_translation() -> None:
    print("🧪 Тестирую перевод русского слова...")
    init_models()
    session = next(get_session())
    try:
        test_word = Word(text="тест")
        session.add(test_word)
        session.flush()
        word_id = test_word.id
        print(f"📝 Создал тестовое слово: '{test_word.text}' (ID: {word_id})")
        print("🔄 Тестирую обогащение...")
        _enrich_single_openai(word_id, test_word.text, force_overwrite=True, session=session)
        session.refresh(test_word)
        print("✅ Результат обогащения:")
        print(f"  Слово: '{test_word.text}'")
        print(f"  Перевод: '{test_word.main_translation}'")
        print(f"  Теги: {test_word.tags}")
        print(f"  Группа: '{test_word.group_name}'")
        session.delete(test_word)
        session.commit()
        print("🗑️ Тестовое слово удалено")
    except Exception as e:
        print(f"❌ Ошибка при тестировании: {e}")
        session.rollback()
    finally:
        session.close()


if __name__ == "__main__":
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Ошибка: OPENAI_API_KEY не установлен")
        sys.exit(1)
    if not os.getenv("DATABASE_URL"):
        print("❌ Ошибка: DATABASE_URL не установлен")
        sys.exit(1)
    test_translation()


