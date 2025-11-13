#!/usr/bin/env python3
"""
Проверяет одно слово по ID или выводит обзор русских слов.

Usage:
  python -m scripts.check_word 123
  python -m scripts.check_word
"""

import sys
import re
from app.database import get_session, init_models
from app.models import Word


def check_word(word_id: int) -> None:
    print(f"🔍 Проверяю слово с ID: {word_id}")
    init_models()
    session = next(get_session())
    try:
        word = session.query(Word).filter(Word.id == word_id).first()
        if not word:
            print(f"❌ Слово с ID {word_id} не найдено")
            return
        print(f"📝 Слово: '{word.text}'")
        print(f"🔄 Перевод: '{word.main_translation}'")
        print(f"🏷️ Теги: {word.tags}")
        print(f"📚 Группа: '{word.group_name}'")
        print(f"💡 Пример: '{word.usage_example}'")
        print(f"🌍 Перевод примера: '{word.usage_example_translation}'")
        print(f"📊 Использований: {word.uses_count}")
        has_russian = bool(re.search(r"[а-яё]", word.text.lower())) if word.text else False
        print(f"🇷🇺 Содержит русские символы: {'Да' if has_russian else 'Нет'}")
    finally:
        session.close()


def check_all_russian_words() -> None:
    print("🔍 Проверяю все русские слова в базе...")
    init_models()
    session = next(get_session())
    try:
        all_words = session.query(Word).all()
        russian_words = [w for w in all_words if w.text and re.search(r"[а-яё]", w.text.lower())]
        print(f"📚 Найдено {len(russian_words)} русских слов:")
        for word in russian_words[:10]:
            print(f"  ID {word.id}: '{word.text}' -> '{word.main_translation}'")
        if len(russian_words) > 10:
            print(f"  ... и еще {len(russian_words) - 10} слов")
    finally:
        session.close()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_word(int(sys.argv[1]))
    else:
        check_all_russian_words()


