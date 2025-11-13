from typing import List
import random

from fastapi import APIRouter, Depends, Request, Form, Body
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_session
from app.models import Word, WordRelation


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


def _wants_json(request: Request) -> bool:
    """Проверяет, запрашивает ли клиент JSON ответ."""
    accept = (request.headers.get("accept") or "").lower()
    return "application/json" in accept


def _word_to_dict(word: Word) -> dict:
    """Конвертирует Word модель в словарь для JSON ответа."""
    return {
        "id": word.id,
        "text": word.text,
        "main_translation": word.main_translation,
        "alt_translations": word.alt_translations or [],
        "tags": word.tags or [],
        "group_name": word.group_name,
        "usage_example": word.usage_example,
        "usage_example_translation": word.usage_example_translation,
        "uses_count": word.uses_count,
    }


class PracticeSubmitRequest(BaseModel):
    answers: List[str]
    ids: List[int]


def _pick_quiz_items(session: Session, limit: int = 10) -> List[Word]:
    """
    Выбирает слова для упражнений, приоритизируя те, которые использовались меньше всего.
    Сортирует по uses_count (по возрастанию), затем случайно перемешивает среди слов
    с одинаковым uses_count для разнообразия.
    """
    # Сортируем слова по количеству использований (меньше -> больше)
    # Берем больше слов, чтобы потом выбрать случайно из наименее используемых
    # Исключаем слова с to_teach=False (синонимы)
    words = (
        session.query(Word)
        .filter(Word.to_teach == True)
        .order_by(Word.uses_count.asc())
        .limit(limit * 3)  # Берем больше для разнообразия
        .all()
    )
    
    if not words:
        return []
    
    # Если слов меньше лимита, возвращаем все
    if len(words) <= limit:
        random.shuffle(words)
        return words
    
    # Группируем слова по uses_count
    words_by_uses = {}
    for word in words:
        uses = word.uses_count or 0
        if uses not in words_by_uses:
            words_by_uses[uses] = []
        words_by_uses[uses].append(word)
    
    # Сортируем группы по uses_count (по возрастанию)
    sorted_uses = sorted(words_by_uses.keys())
    
    # Собираем результат, начиная с наименьшего uses_count
    result = []
    for uses in sorted_uses:
        if len(result) >= limit:
            break
        
        # Перемешиваем слова в группе для разнообразия
        group_words = words_by_uses[uses]
        random.shuffle(group_words)
        
        # Добавляем слова из этой группы, пока не достигнем лимита
        remaining = limit - len(result)
        result.extend(group_words[:remaining])
    
    return result[:limit]


def _make_cloze_for_word(word: Word) -> dict:
    answer = (word.text or "").strip()
    base = (word.usage_example or "").strip()
    cloze = None
    if base and answer:
        try:
            import re
            pattern = re.compile(re.escape(answer), re.IGNORECASE)
            masked = pattern.sub("_____", base)
            if masked != base:
                cloze = masked
        except Exception:
            pass
    if not cloze:
        cloze = "I often use _____ in daily conversations." if answer else "_____"
    return {"id": word.id, "cloze": cloze, "answer": answer}


@router.get("/practice")
def practice_page(request: Request, session: Session = Depends(get_session)):
    total_words = session.query(func.count(Word.id)).scalar() or 0
    total_uses = session.query(func.coalesce(func.sum(Word.uses_count), 0)).scalar() or 0
    zero_uses = (
        session.query(func.count(Word.id))
        .filter((Word.uses_count.is_(None)) | (Word.uses_count == 0))
        .scalar()
        or 0
    )
    missing_translation = (
        session.query(func.count(Word.id))
        .filter((Word.main_translation.is_(None)) | (func.trim(Word.main_translation) == ""))
        .scalar()
        or 0
    )
    missing_examples = (
        session.query(func.count(Word.id))
        .filter((Word.usage_example.is_(None)) | (func.trim(Word.usage_example) == ""))
        .scalar()
        or 0
    )
    practiced_today = (
        session.query(func.count(Word.id))
        .filter(Word.last_used_at.isnot(None))
        .filter(func.date(Word.last_used_at) == func.current_date())
        .scalar()
        or 0
    )
    
    stats = {
        "total_words": int(total_words),
        "total_uses": int(total_uses),
        "zero_uses": int(zero_uses),
        "missing_translation": int(missing_translation),
        "missing_examples": int(missing_examples),
        "practiced_today": int(practiced_today),
    }
    
    if _wants_json(request):
        return JSONResponse(stats)
    
    return templates.TemplateResponse(
        "practice.html",
        {
            "request": request,
            **stats,
        },
    )


@router.get("/practice/mode1")
def practice_mode1_form(request: Request, session: Session = Depends(get_session)):
    items = _pick_quiz_items(session)
    
    if _wants_json(request):
        return JSONResponse({
            "mode": 1,
            "items": [_word_to_dict(w) for w in items],
        })
    
    return templates.TemplateResponse("practice.html", {"request": request, "mode": 1, "items": items})


@router.post("/practice/mode1")
async def practice_mode1_submit(
    request: Request,
    answers: List[str] = Form(None),
    ids: List[int] = Form(None),
    body: PracticeSubmitRequest = Body(None),
    session: Session = Depends(get_session),
):
    # Поддержка как Form, так и JSON body
    answers_list = None
    ids_list = None
    
    # Если это JSON запрос, пытаемся получить из body
    if _wants_json(request):
        try:
            # Пытаемся получить из Pydantic модели
            if body and body.answers and body.ids:
                answers_list = body.answers
                ids_list = body.ids
            else:
                # Если не получилось через модель, читаем напрямую из request
                try:
                    json_data = await request.json()
                    answers_list = json_data.get("answers")
                    ids_list = json_data.get("ids")
                except:
                    pass
        except:
            pass
    
    # Если не получили из JSON, пытаемся из Form
    if not answers_list:
        answers_list = answers
    if not ids_list:
        ids_list = ids
    
    if not answers_list or not ids_list:
        if _wants_json(request):
            return JSONResponse({"error": "answers and ids are required"}, status_code=400)
        return templates.TemplateResponse("practice.html", {"request": request, "mode": 1})
    
    answers = answers_list
    ids = ids_list
    
    correct = 0
    items_result = []
    for idx, word_id in enumerate(ids):
        word = session.get(Word, int(word_id))
        if not word:
            continue
        user_answer = (answers[idx] or "").strip().lower()
        is_ok = False
        candidates = [word.main_translation or ""] + (word.alt_translations or [])
        candidates = [c.strip().lower() for c in candidates if c]
        if user_answer and user_answer in candidates:
            is_ok = True
        if is_ok:
            correct += 1
        
        # Формируем правильный ответ (основной перевод или все варианты)
        correct_answer = word.main_translation or ""
        if word.alt_translations:
            all_translations = [word.main_translation] + word.alt_translations
            all_translations = [t for t in all_translations if t]
            if len(all_translations) > 1:
                correct_answer = ", ".join(all_translations)
        
        items_result.append(
            {
                "id": word.id if word else None,
                "user_answer": answers[idx],
                "correct_answer": correct_answer,
                "is_correct": is_ok,
            }
        )
        
        word.uses_count += 1
        try:
            from sqlalchemy import func as sa_func
            word.last_used_at = sa_func.now()
        except Exception:
            pass
    session.commit()
    
    result = {"correct": correct, "total": len(ids)}
    
    if _wants_json(request):
        return JSONResponse({"mode": 1, "result": result, "items": items_result})
    
    return templates.TemplateResponse(
        "practice.html",
        {"request": request, "mode": 1, "result": result},
    )


@router.get("/practice/mode2")
def practice_mode2_form(request: Request, session: Session = Depends(get_session)):
    items = _pick_quiz_items(session)
    mcq = []
    translations_pool = [w.main_translation for w in session.query(Word).all() if w.main_translation]
    for w in items:
        options = set([w.main_translation] if w.main_translation else [])
        import random as _r
        while len(options) < 4 and translations_pool:
            options.add(_r.choice(translations_pool))
        options_list = list(options)[:4]
        _r.shuffle(options_list)
        mcq.append({"word": w, "options": options_list})

    if _wants_json(request):
        return JSONResponse({
            "mode": 2,
            "mcq": [
                {
                    "word": _word_to_dict(m["word"]),
                    "options": m["options"],
                }
                for m in mcq
            ],
        })
    
    return templates.TemplateResponse("practice.html", {"request": request, "mode": 2, "mcq": mcq})


@router.post("/practice/mode2")
async def practice_mode2_submit(
    request: Request,
    answers: List[str] = Form(None),
    ids: List[int] = Form(None),
    body: PracticeSubmitRequest = Body(None),
    session: Session = Depends(get_session),
):
    # Поддержка как Form, так и JSON body
    answers_list = None
    ids_list = None
    
    # Если это JSON запрос, пытаемся получить из body
    if _wants_json(request):
        try:
            # Пытаемся получить из Pydantic модели
            if body and body.answers and body.ids:
                answers_list = body.answers
                ids_list = body.ids
            else:
                # Если не получилось через модель, читаем напрямую из request
                try:
                    json_data = await request.json()
                    answers_list = json_data.get("answers")
                    ids_list = json_data.get("ids")
                except:
                    pass
        except:
            pass
    
    # Если не получили из JSON, пытаемся из Form
    if not answers_list:
        answers_list = answers
    if not ids_list:
        ids_list = ids
    
    if not answers_list or not ids_list:
        if _wants_json(request):
            return JSONResponse({"error": "answers and ids are required"}, status_code=400)
        return templates.TemplateResponse("practice.html", {"request": request, "mode": 2})
    
    answers = answers_list
    ids = ids_list
    
    correct = 0
    items_result = []
    for idx, word_id in enumerate(ids):
        word = session.get(Word, int(word_id))
        if not word:
            continue
        user_answer = (answers[idx] or "").strip().lower()
        is_ok = False
        correct_answer = (word.main_translation or "").strip()
        correct_answer_lower = correct_answer.lower()
        if user_answer and user_answer == correct_answer_lower:
            is_ok = True
        if is_ok:
            correct += 1
        
        items_result.append(
            {
                "id": word.id if word else None,
                "user_answer": answers[idx],
                "correct_answer": correct_answer,
                "is_correct": is_ok,
            }
        )
        
        word.uses_count += 1
        try:
            from sqlalchemy import func as sa_func
            word.last_used_at = sa_func.now()
        except Exception:
            pass
    session.commit()
    
    result = {"correct": correct, "total": len(ids)}
    
    if _wants_json(request):
        return JSONResponse({"mode": 2, "result": result, "items": items_result})
    
    return templates.TemplateResponse(
        "practice.html",
        {"request": request, "mode": 2, "result": result},
    )


@router.get("/practice/mode3")
def practice_mode3_form(request: Request, session: Session = Depends(get_session)):
    items = _pick_quiz_items(session)
    
    if _wants_json(request):
        return JSONResponse({
            "mode": 3,
            "items": [_word_to_dict(w) for w in items],
        })
    
    return templates.TemplateResponse("practice.html", {"request": request, "mode": 3, "items": items})


@router.post("/practice/mode3")
async def practice_mode3_submit(
    request: Request,
    answers: List[str] = Form(None),
    ids: List[int] = Form(None),
    body: PracticeSubmitRequest = Body(None),
    session: Session = Depends(get_session),
):
    # Поддержка как Form, так и JSON body
    answers_list = None
    ids_list = None
    
    # Если это JSON запрос, пытаемся получить из body
    if _wants_json(request):
        try:
            # Пытаемся получить из Pydantic модели
            if body and body.answers and body.ids:
                answers_list = body.answers
                ids_list = body.ids
            else:
                # Если не получилось через модель, читаем напрямую из request
                try:
                    json_data = await request.json()
                    answers_list = json_data.get("answers")
                    ids_list = json_data.get("ids")
                except:
                    pass
        except:
            pass
    
    # Если не получили из JSON, пытаемся из Form
    if not answers_list:
        answers_list = answers
    if not ids_list:
        ids_list = ids
    
    if not answers_list or not ids_list:
        if _wants_json(request):
            return JSONResponse({"error": "answers and ids are required"}, status_code=400)
        return templates.TemplateResponse("practice.html", {"request": request, "mode": 3})
    
    answers = answers_list
    ids = ids_list
    
    correct = 0
    items_result = []
    for idx, word_id in enumerate(ids):
        word = session.get(Word, int(word_id))
        if not word:
            continue
        user_answer = (answers[idx] or "").strip().lower()
        is_ok = False
        if word.text and user_answer == word.text.strip().lower():
            is_ok = True
        if is_ok:
            correct += 1
        items_result.append(
            {
                "id": word.id if word else None,
                "user_answer": answers[idx],
                "correct_answer": (word.text if word and word.text else ""),
                "is_correct": is_ok,
            }
        )
        word.uses_count += 1
        try:
            from sqlalchemy import func as sa_func
            word.last_used_at = sa_func.now()
        except Exception:
            pass
    session.commit()
    
    if _wants_json(request):
        return JSONResponse({"mode": 3, "correct": correct, "total": len(ids), "items": items_result})
    
    return templates.TemplateResponse(
        "practice.html",
        {"request": request, "mode": 3, "result": {"correct": correct, "total": len(ids)}},
    )


@router.get("/practice/mode4")
def practice_mode4_form(request: Request, session: Session = Depends(get_session)):
    items = _pick_quiz_items(session, limit=5)
    cloze_items = [_make_cloze_for_word(w) for w in items]
    
    if _wants_json(request):
        return JSONResponse({
            "mode": 4,
            "cloze": cloze_items,
        })
    
    return templates.TemplateResponse("practice.html", {"request": request, "mode": 4, "cloze": cloze_items})


@router.post("/practice/mode4")
async def practice_mode4_submit(
    request: Request,
    answers: List[str] = Form(None),
    ids: List[int] = Form(None),
    body: PracticeSubmitRequest = Body(None),
    session: Session = Depends(get_session),
):
    # Поддержка как Form, так и JSON body
    answers_list = None
    ids_list = None
    
    # Если это JSON запрос, пытаемся получить из body
    if _wants_json(request):
        try:
            # Пытаемся получить из Pydantic модели
            if body and body.answers and body.ids:
                answers_list = body.answers
                ids_list = body.ids
            else:
                # Если не получилось через модель, читаем напрямую из request
                try:
                    json_data = await request.json()
                    answers_list = json_data.get("answers")
                    ids_list = json_data.get("ids")
                except:
                    pass
        except:
            pass
    
    # Если не получили из JSON, пытаемся из Form
    if not answers_list:
        answers_list = answers
    if not ids_list:
        ids_list = ids
    
    if not answers_list or not ids_list:
        if _wants_json(request):
            return JSONResponse({"error": "answers and ids are required"}, status_code=400)
        return templates.TemplateResponse("practice.html", {"request": request, "mode": 4})
    
    answers = answers_list
    ids = ids_list
    
    correct = 0
    words_map = {w.id: w for w in session.query(Word).filter(Word.id.in_([int(x) for x in ids])).all()}
    items_result = []
    for idx, word_id in enumerate(ids):
        wid = int(word_id)
        word = words_map.get(wid)
        if not word:
            continue
        user_answer = (answers[idx] or "").strip().lower()
        is_ok = False
        target = (word.text or "").strip().lower()
        if user_answer and target and user_answer == target:
            is_ok = True
            correct += 1
        word.uses_count += 1
        try:
            from sqlalchemy import func as sa_func
            word.last_used_at = sa_func.now()
        except Exception:
            pass
        items_result.append(
            {
                "id": word.id,
                "user_answer": answers[idx],
                "correct_answer": (word.text or ""),
                "is_correct": is_ok,
            }
        )
    session.commit()
    
    result = {"correct": correct, "total": len(ids)}
    
    if _wants_json(request):
        return JSONResponse({"mode": 4, "result": result, "items": items_result})
    
    return templates.TemplateResponse(
        "practice.html",
        {
            "request": request,
            "mode": 4,
            "result": result,
            "items": items_result,
        },
    )


