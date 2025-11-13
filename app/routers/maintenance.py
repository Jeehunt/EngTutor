from fastapi import APIRouter, BackgroundTasks, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_session
from app.models import Word
from app.services.enrichment import enrich_and_update_word_records


router = APIRouter()


@router.post("/maintenance/enrich-missing")
def enrich_missing_translations(
    background_tasks: BackgroundTasks,
    background_tasks_disabled: bool = False,
    session: Session = Depends(get_session),
    limit: int = Query(25, ge=1, le=200, description="Сколько слов обработать за запуск"),
    overwrite: bool = Query(False, description="Перезаписывать существующие поля"),
):
    missing = (
        session.query(Word)
        .filter((Word.main_translation.is_(None)) | (func.trim(Word.main_translation) == ""))
        .limit(limit)
        .all()
    )
    if not missing:
        return JSONResponse({"scheduled": 0, "message": "Нет слов с пустым переводом"})

    word_ids = [w.id for w in missing]
    words_texts = [w.text for w in missing]

    if background_tasks_disabled:
        try:
            enrich_and_update_word_records(word_ids, words_texts, overwrite)
        except Exception:
            pass
        return JSONResponse({"scheduled": len(word_ids), "message": "Обогащение выполнено синхронно"})

    background_tasks.add_task(enrich_and_update_word_records, word_ids, words_texts, overwrite)

    return JSONResponse({
        "scheduled": len(word_ids),
        "message": "Запущено обогащение для слов без перевода (пакет)",
        "sample": word_ids[:10],
    })


