#!/usr/bin/env python3
"""
Заполняет отсутствующие переводы и сопутствующие поля для слов в БД,
используя существующую службу обогащения (OpenAI).

Пример:
  python -m scripts.fill_missing_translations --limit 25 --overwrite false
"""

import os
import sys
import argparse
from typing import List

from app.database import get_session, init_models
from app.models import Word
from app.services.enrichment import enrich_and_update_word_records
from sqlalchemy import func


def main(limit: int, overwrite: bool) -> None:
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY не установлен")
        sys.exit(1)

    if not os.getenv("DATABASE_URL"):
        print("❌ DATABASE_URL не установлен")
        sys.exit(1)

    init_models()

    session = next(get_session())
    try:
        missing: List[Word] = (
            session.query(Word)
            .filter((Word.main_translation.is_(None)) | (func.trim(Word.main_translation) == ""))
            .limit(limit)
            .all()
        )
        if not missing:
            print("✅ Нет слов с пустым переводом")
            return

        word_ids = [w.id for w in missing]
        words_texts = [w.text for w in missing]

        print(f"🚀 Запускаю обогащение для {len(word_ids)} слов (overwrite={overwrite})...")
        enrich_and_update_word_records(word_ids, words_texts, overwrite)
        print("🎉 Готово")
    finally:
        session.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Заполнение отсутствующих переводов")
    parser.add_argument("--limit", type=int, default=25, help="Сколько слов обработать")
    parser.add_argument("--overwrite", type=str, default="false", help="Перезаписывать существующие поля (true/false)")
    args = parser.parse_args()
    overwrite_flag = str(args.overwrite).lower() in ("1", "true", "yes", "y")
    main(args.limit, overwrite_flag)


