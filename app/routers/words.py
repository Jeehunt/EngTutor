from typing import List, Optional
import logging
import os
import re
import json

from fastapi import APIRouter, Depends, Request, Form, BackgroundTasks, status, Query, Body
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.database import get_session
from app.models import Word, Group, WordRelation
from app.services.enrichment import enrich_and_update_word_records, get_suitable_group_for_word, generate_synonyms_for_word


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


def _sanitize_str(value: Optional[str], max_len: int) -> Optional[str]:
    if not value:
        return None
    v = value.strip()
    if not v:
        return None
    return v[:max_len]


def _word_to_dict(word: Word, session: Session = None) -> dict:
    """Конвертирует Word модель в словарь для JSON ответа."""
    group_name = word.group_name
    # Try to get group name from relationship if available
    if word.group_id:
        if hasattr(word, 'group') and word.group:
            group_name = word.group.name
        elif not group_name and session:
            # Fallback: query group directly if relationship not loaded
            group = session.get(Group, word.group_id) if word.group_id else None
            if group:
                group_name = group.name
    
    # Безопасная обработка дат
    def format_date(date_value):
        if not date_value:
            return None
        if hasattr(date_value, 'isoformat'):
            return date_value.isoformat()
        if isinstance(date_value, str):
            return date_value
        return str(date_value)
    
    return {
        "id": word.id,
        "text": word.text,
        "main_translation": word.main_translation,
        "alt_translations": word.alt_translations or [],
        "tags": word.tags or [],
        "group_id": word.group_id,
        "group_name": group_name,
        "usage_example": word.usage_example,
        "usage_example_translation": word.usage_example_translation,
        "uses_count": word.uses_count,
        "created_at": format_date(word.created_at),
        "last_used_at": format_date(word.last_used_at),
    }


def _wants_json(request: Request) -> bool:
    """Проверяет, запрашивает ли клиент JSON ответ."""
    accept = (request.headers.get("accept") or "").lower()
    return "application/json" in accept


class AddWordsRequest(BaseModel):
    words: str


@router.get("/words")
def words_page(
    request: Request,
    search: str = Query(None, description="Поиск по слову, переводу, тегам или группе"),
    filter: str = Query(None, description="Фильтр по полю"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    per_page: int = Query(100, ge=1, le=500, description="Количество слов на странице"),
    sort: str = Query("id", description="Сортировка: id|text|uses"),
    dir: str = Query("desc", description="Направление: asc|desc"),
    session: Session = Depends(get_session),
):
    try:
        # Исключаем слова с to_teach=False (синонимы) из основного словаря
        query = session.query(Word).filter(Word.to_teach == True)

        if search:
            search_term = f"%{search}%"
            tags_str = func.coalesce(func.array_to_string(Word.tags, ","), "")
            alt_str = func.coalesce(func.array_to_string(Word.alt_translations, ","), "")
            if filter == "word":
                query = query.filter(Word.text.ilike(search_term))
            elif filter == "translation":
                query = query.filter(
                    or_(
                        Word.main_translation.ilike(search_term),
                        alt_str.ilike(search_term),
                    )
                )
            elif filter == "tags":
                query = query.filter(tags_str.ilike(search_term))
            elif filter == "group":
                query = query.filter(Word.group_name.ilike(search_term))
            else:
                query = query.filter(
                    or_(
                        Word.text.ilike(search_term),
                        Word.main_translation.ilike(search_term),
                        alt_str.ilike(search_term),
                        tags_str.ilike(search_term),
                        Word.group_name.ilike(search_term),
                    )
                )

        sort_field = sort or "id"
        sort_dir = (dir or "desc").lower()
        column_map = {
            "id": Word.id,
            "text": Word.text,
            "uses": Word.uses_count,
            "group": Word.group_name,
        }
        order_col = column_map.get(sort_field, Word.id)
        if sort_dir == "asc":
            query = query.order_by(order_col.asc())
        else:
            query = query.order_by(order_col.desc())

        # Считаем общее количество ДО добавления joinedload
        total_words = query.count()
        offset = (page - 1) * per_page
        
        # Используем options для безопасной загрузки relationship
        from sqlalchemy.orm import joinedload
        words = query.options(joinedload(Word.group)).offset(offset).limit(per_page).all()

        total_pages = max(1, (total_words + per_page - 1) // per_page) if total_words > 0 else 1
        has_prev = page > 1
        has_next = page < total_pages

        start_page = max(1, page - 2)
        end_page = min(total_pages, page + 2)

        if page > total_pages and total_pages > 0:
            page = total_pages
            offset = (page - 1) * per_page
            # Пересоздаем query для повторного запроса
            query_retry = session.query(Word).filter(Word.to_teach == True)
            if search:
                search_term = f"%{search}%"
                tags_str = func.coalesce(func.array_to_string(Word.tags, ","), "")
                alt_str = func.coalesce(func.array_to_string(Word.alt_translations, ","), "")
                if filter == "word":
                    query_retry = query_retry.filter(Word.text.ilike(search_term))
                elif filter == "translation":
                    query_retry = query_retry.filter(
                        or_(
                            Word.main_translation.ilike(search_term),
                            alt_str.ilike(search_term),
                        )
                    )
                elif filter == "tags":
                    query_retry = query_retry.filter(tags_str.ilike(search_term))
                elif filter == "group":
                    query_retry = query_retry.filter(Word.group_name.ilike(search_term))
                else:
                    query_retry = query_retry.filter(
                        or_(
                            Word.text.ilike(search_term),
                            Word.main_translation.ilike(search_term),
                            alt_str.ilike(search_term),
                            tags_str.ilike(search_term),
                            Word.group_name.ilike(search_term),
                        )
                    )
            # Определяем колонку для сортировки
            column_map_retry = {
                "id": Word.id,
                "text": Word.text,
                "uses": Word.uses_count,
                "group": Word.group_name,
            }
            order_col_retry = column_map_retry.get(sort_field, Word.id)
            if sort_dir == "asc":
                query_retry = query_retry.order_by(order_col_retry.asc())
            else:
                query_retry = query_retry.order_by(order_col_retry.desc())
            from sqlalchemy.orm import joinedload
            words = query_retry.options(joinedload(Word.group)).offset(offset).limit(per_page).all()

        # Если запрашивается JSON, возвращаем JSON
        if _wants_json(request):
            return JSONResponse({
                "words": [_word_to_dict(w, session) for w in words],
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total_words": total_words,
                    "total_pages": total_pages,
                    "has_prev": has_prev,
                    "has_next": has_next,
                    "start_page": start_page,
                    "end_page": end_page,
                    "prev_page": page - 1 if has_prev else None,
                    "next_page": page + 1 if has_next else None,
                },
                "filters": {
                    "search": search,
                    "filter": filter,
                    "sort": sort_field,
                    "dir": sort_dir,
                },
            })

        # Иначе возвращаем HTML (старое поведение)
        return templates.TemplateResponse(
            "words.html",
            {
                "request": request,
                "words": words,
                "search": search,
                "filter": filter,
                "page": page,
                "per_page": per_page,
                "total_words": total_words,
                "total_pages": total_pages,
                "has_prev": has_prev,
                "has_next": has_next,
                "start_page": start_page,
                "end_page": end_page,
                "prev_page": page - 1 if has_prev else None,
                "next_page": page + 1 if has_next else None,
                "min": min,
                "sort": sort_field,
                "dir": sort_dir,
            },
        )
    except Exception as e:
        logging.error(f"Error in words_page: {e}", exc_info=True)
        if _wants_json(request):
            return JSONResponse(
                {"error": str(e), "detail": "Ошибка при загрузке слов"},
                status_code=500
            )
        raise


@router.post("/words/add")
async def add_words(
    request: Request,
    words: str = Form(None),
    body: AddWordsRequest = Body(None),
    background_tasks: BackgroundTasks = None,
    session: Session = Depends(get_session),
):
    # Поддержка как Form, так и JSON body
    words_str = None
    
    # Если это JSON запрос, пытаемся получить из body
    if _wants_json(request):
        try:
            # Пытаемся получить из Pydantic модели
            if body and body.words:
                words_str = body.words
            else:
                # Если не получилось через модель, читаем напрямую из request
                try:
                    json_data = await request.json()
                    words_str = json_data.get("words")
                except:
                    pass
        except:
            pass
    
    # Если не получили из JSON, пытаемся из Form
    if not words_str:
        words_str = words
    
    if not words_str:
        if _wants_json(request):
            return JSONResponse({"error": "words field is required"}, status_code=400)
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)

    raw_items = re.split(r"[\n\r,;]+", words_str)
    words_list: List[str] = []

    for w in raw_items:
        w = w.strip()
        if not w:
            continue
        words_list.append(w[:255])

    created_ids: List[int] = []
    existing = {w.text.strip().lower() for w in session.query(Word.text).all() if w and w.text}
    
    # Получаем доступные группы для назначения
    available_groups = session.query(Group).all()

    added_count = 0
    for text in words_list:
        if text.strip().lower() in existing:
            continue
        if re.search(r"[а-яё]", text.lower()):
            logging.info(f"Adding Russian word: {text} - will be translated to English during enrichment")
        else:
            logging.info(f"Adding English word: {text}")

        word = Word(text=text)
        
        # Определяем подходящую группу через LLM
        if available_groups:
            suitable_group = get_suitable_group_for_word(text, available_groups, session)
            if suitable_group:
                word.group_id = suitable_group.id
                word.group_name = suitable_group.name
                logging.info(f"Assigned group '{suitable_group.name}' to word '{text}'")
        
        session.add(word)
        session.flush()
        created_ids.append(word.id)
        existing.add(text.strip().lower())
        added_count += 1

    session.commit()

    if background_tasks and created_ids:
        background_tasks.add_task(enrich_and_update_word_records, created_ids, words_list)

    # Если запрашивается JSON, возвращаем JSON
    if _wants_json(request):
        return JSONResponse({
            "added_count": added_count,
            "created_ids": created_ids,
            "added_texts": words_list[:added_count],
        })

    return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/words/re-enrich")
def re_enrich_missing(
    request: Request,
    session: Session = Depends(get_session),
    background_tasks: BackgroundTasks = None
):
    missing = (
        session.query(Word)
        .filter(
            (Word.main_translation.is_(None))
            | (Word.tags.is_(None))
            | (Word.usage_example.is_(None))
        )
        .all()
    )
    if not missing:
        if _wants_json(request):
            return JSONResponse({"message": "No words need enrichment", "count": 0})
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    ids = [w.id for w in missing]
    texts = [w.text for w in missing]
    if background_tasks:
        background_tasks.add_task(enrich_and_update_word_records, ids, texts)
    
    if _wants_json(request):
        return JSONResponse({
            "message": "Enrichment started",
            "count": len(ids),
            "word_ids": ids
        })
    return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/words/rewrite-all")
def rewrite_all_words(
    request: Request,
    session: Session = Depends(get_session),
    background_tasks: BackgroundTasks = None
):
    all_words = session.query(Word).all()
    if not all_words:
        if _wants_json(request):
            return JSONResponse({"message": "No words to rewrite", "count": 0})
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    ids = [w.id for w in all_words]
    texts = [w.text for w in all_words]
    if background_tasks:
        background_tasks.add_task(enrich_and_update_word_records, ids, texts, force_overwrite=True)
    
    if _wants_json(request):
        return JSONResponse({
            "message": "Rewrite started",
            "count": len(ids),
            "word_ids": ids
        })
    return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


def _reassign_groups_for_words(word_ids: List[int], session: Session = None) -> None:
    """Переназначает группы для списка слов через LLM."""
    import time
    
    if session is None:
        from app.database import get_session
        session = next(get_session())
        should_close = True
    else:
        should_close = False
    
    try:
        # Получаем все доступные группы один раз
        available_groups = session.query(Group).all()
        if not available_groups:
            logging.warning("No groups available for reassignment")
            return
        
        # Получаем слова
        words = session.query(Word).filter(Word.id.in_(word_ids)).all()
        if not words:
            logging.warning(f"No words found for IDs: {word_ids}")
            return
        
        logging.info(f"Starting group reassignment for {len(words)} words")
        updated_count = 0
        
        for i, word in enumerate(words, 1):
            try:
                # Определяем подходящую группу через LLM
                suitable_group = get_suitable_group_for_word(word.text or "", available_groups, session)
                
                if suitable_group:
                    # Обновляем только если группа изменилась
                    if word.group_id != suitable_group.id:
                        word.group_id = suitable_group.id
                        word.group_name = suitable_group.name
                        updated_count += 1
                        logging.info(f"[{i}/{len(words)}] Updated '{word.text}' -> group '{suitable_group.name}'")
                    else:
                        logging.debug(f"[{i}/{len(words)}] '{word.text}' already has correct group '{suitable_group.name}'")
                
                # Небольшая задержка между запросами, чтобы не перегружать API
                if i % 10 == 0:
                    session.commit()
                    logging.info(f"Committed batch, processed {i}/{len(words)} words")
                    time.sleep(1)  # Пауза каждые 10 слов
                    
            except Exception as e:
                logging.error(f"Error processing word '{word.text}' (ID: {word.id}): {e}")
                continue
        
        # Финальный коммит
        session.commit()
        logging.info(f"Group reassignment completed: {updated_count} words updated out of {len(words)}")
        
    finally:
        if should_close:
            session.close()


@router.post("/words/reassign-groups")
def reassign_all_groups(
    request: Request,
    session: Session = Depends(get_session),
    background_tasks: BackgroundTasks = None
):
    """Переназначить группы для всех слов через LLM."""
    all_words = session.query(Word).all()
    if not all_words:
        if _wants_json(request):
            return JSONResponse({"message": "No words to reassign", "count": 0})
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    
    word_ids = [w.id for w in all_words]
    
    if background_tasks:
        background_tasks.add_task(_reassign_groups_for_words, word_ids)
        if _wants_json(request):
            return JSONResponse({
                "message": "Group reassignment started in background",
                "count": len(word_ids),
                "word_ids": word_ids
            })
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    else:
        # Синхронное выполнение (не рекомендуется для больших баз)
        try:
            _reassign_groups_for_words(word_ids, session)
            if _wants_json(request):
                return JSONResponse({
                    "message": "Group reassignment completed",
                    "count": len(word_ids)
                })
            return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
        except Exception as e:
            logging.error(f"Error in group reassignment: {e}")
            if _wants_json(request):
                return JSONResponse({
                    "message": f"Error: {str(e)}",
                    "count": 0
                }, status_code=500)
            return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


def _enrich_synonyms_and_alt_translations(word_ids: List[int], session: Session = None) -> None:
    """
    Разовое заполнение синонимов и расширение alt_translations для списка слов.
    Выполняется в фоновом режиме.
    """
    should_close = session is None
    if session is None:
        session = next(get_session())
    
    try:
        total_words = len(word_ids)
        processed = 0
        errors = 0
        
        for idx, word_id in enumerate(word_ids):
            try:
                word = session.query(Word).filter(Word.id == word_id).first()
                if not word:
                    continue
                
                word_text = word.text or ""
                if not word_text:
                    continue
                
                # Расширяем alt_translations до 10 если их меньше
                current_alts = word.alt_translations or []
                needs_expansion = len(current_alts) < 10
                
                # Проверяем наличие синонимов
                existing_synonyms = session.query(WordRelation).filter(
                    WordRelation.word_id == word_id,
                    WordRelation.relation_type == "synonym"
                ).count()
                needs_synonyms = existing_synonyms == 0
                
                if needs_expansion:
                    # Используем обогащение для генерации дополнительных переводов
                    # force_overwrite=True чтобы гарантированно получить до 10 переводов
                    from app.services.enrichment import _enrich_single_openai
                    try:
                        _enrich_single_openai(word_id, word_text, force_overwrite=True, session=session)
                        # Обновляем слово после обогащения
                        session.refresh(word)
                    except Exception as e:
                        logging.error(f"Error enriching alt_translations for word {word_id} ({word_text}): {e}")
                
                # Генерируем синонимы если их нет
                if needs_synonyms:
                    try:
                        generate_synonyms_for_word(word_id, word_text, session)
                    except Exception as e:
                        logging.error(f"Error generating synonyms for word {word_id} ({word_text}): {e}")
                
                processed += 1
                
                # Логируем прогресс каждые 10 слов
                if processed % 10 == 0:
                    logging.info(f"Processed {processed}/{total_words} words for synonyms/alt_translations enrichment")
                
                # Задержка между словами для избежания rate limits
                # 3 секунды между словами, чтобы не превысить лимиты API
                import time
                time.sleep(3)
                
            except Exception as e:
                errors += 1
                logging.error(f"Error processing word {word_id}: {e}")
                continue
        
        logging.info(f"Completed enrichment: {processed} processed, {errors} errors")
        
    finally:
        if should_close:
            session.close()


@router.post("/words/enrich-synonyms-and-alt-translations")
def enrich_synonyms_and_alt_translations(
    request: Request,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    """
    Разовое заполнение синонимов и расширение alt_translations для всех слов.
    Запускается в фоновом режиме.
    """
    # Получаем все слова с to_teach=True
    all_words = session.query(Word).filter(Word.to_teach == True).all()
    if not all_words:
        if _wants_json(request):
            return JSONResponse({"message": "No words to enrich", "count": 0})
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    
    word_ids = [w.id for w in all_words]
    
    if background_tasks:
        background_tasks.add_task(_enrich_synonyms_and_alt_translations, word_ids)
        if _wants_json(request):
            return JSONResponse({
                "message": "Enrichment started in background",
                "count": len(word_ids),
                "details": "Generating synonyms and expanding alt_translations to 10 for all words"
            })
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    else:
        # Синхронное выполнение (не рекомендуется)
        try:
            _enrich_synonyms_and_alt_translations(word_ids, session)
            if _wants_json(request):
                return JSONResponse({
                    "message": "Enrichment completed",
                    "count": len(word_ids)
                })
            return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
        except Exception as e:
            logging.error(f"Error in enrichment: {e}")
            if _wants_json(request):
                return JSONResponse({
                    "message": f"Error: {str(e)}",
                    "count": 0
                }, status_code=500)
            return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


@router.get("/groups")
def get_groups(request: Request, session: Session = Depends(get_session)):
    """Получить список всех групп."""
    try:
        groups = session.query(Group).order_by(Group.name).all()
        groups_list = [{"id": g.id, "name": g.name} for g in groups]
        
        if _wants_json(request):
            return JSONResponse({"groups": groups_list})
        
        return {"groups": groups_list}
    except Exception as e:
        logging.error(f"Error in get_groups: {e}", exc_info=True)
        if _wants_json(request):
            return JSONResponse(
                {"error": str(e), "detail": "Ошибка при загрузке групп", "groups": []},
                status_code=500
            )
        raise


@router.post("/groups/init-defaults")
def init_default_groups(request: Request, session: Session = Depends(get_session)):
    """Инициализировать недостающие популярные группы."""
    default_groups = [
        "Emotions", "Education", "Appearance", "Food", "Travel", "Business",
        "Health", "Technology", "Sports", "Nature", "Family", "Time",
        "Weather", "Colors", "Numbers", "Body", "Clothing", "Home",
        "Transport", "Animals", "Music", "Art", "Science", "Politics",
        "Communication", "Work", "Shopping", "Hobbies", "Entertainment", "Abstract"
    ]
    
    added_count = 0
    for group_name in default_groups:
        existing = session.query(Group).filter(Group.name == group_name).first()
        if not existing:
            group = Group(name=group_name)
            session.add(group)
            added_count += 1
    
    session.commit()
    
    if _wants_json(request):
        return JSONResponse({"message": f"Added {added_count} new groups", "added_count": added_count})
    
    return {"message": f"Added {added_count} new groups"}


@router.post("/groups/consolidate")
def consolidate_groups(request: Request, session: Session = Depends(get_session)):
    """Объединить похожие группы и переназначить слова.
    
    Эта функция:
    1. Объединяет похожие группы по маппингу
    2. Переназначает слова из удаленных групп на новые
    3. Обрабатывает группы, не попавшие в маппинг
    4. Удаляет неиспользуемые группы
    5. Гарантирует, что итоговое количество групп не превышает 50
    """
    import random
    
    # Маппинг для объединения групп: {старая_группа: новая_группа}
    consolidation_map = {
        # Actions variations -> Actions
        "Actions": "Actions",
        "Actions and Behavior": "Actions",
        "Actions and Behaviors": "Actions",
        "Actions and Movements": "Actions",
        "Actions and Reactions": "Actions",
        "Actions and Sounds": "Actions",
        
        # Abstract variations -> Abstract
        "Abstract": "Abstract",
        "Abstract Concepts": "Abstract",
        "Abstract Ideas": "Abstract",
        "Abstract Nouns": "Abstract",
        
        # Academic variations -> Education
        "Academic": "Education",
        "Academic Writing": "Education",
        "Academic Terms": "Education",
        "Academic Vocabulary": "Education",
        
        # Abilities variations -> Abilities
        "Abilities": "Abilities",
        "Abilities and Skills": "Abilities",
        "Skills": "Abilities",
        "Skills and Abilities": "Abilities",
        
        # Emotions variations -> Emotions
        "Emotions": "Emotions",
        "Emotional States": "Emotions",
        "Emotional Expressions": "Emotions",
        "Feelings": "Emotions",
        "Feelings and Emotions": "Emotions",
        
        # Appearance variations -> Appearance
        "Appearance": "Appearance",
        "Physical Appearance": "Appearance",
        "Looks": "Appearance",
        "Looks and Appearance": "Appearance",
        
        # Food variations -> Food
        "Food": "Food",
        "Food and Drink": "Food",
        "Food and Cooking": "Food",
        "Cooking": "Food",
        "Meals": "Food",
        "Drinks": "Food",
        
        # Travel variations -> Travel
        "Travel": "Travel",
        "Travel and Transportation": "Travel",
        "Traveling": "Travel",
        "Tourism": "Travel",
        
        # Business variations -> Business
        "Business": "Business",
        "Business and Finance": "Business",
        "Business Terms": "Business",
        "Finance": "Business",
        "Economics": "Business",
        
        # Health variations -> Health
        "Health": "Health",
        "Health and Medicine": "Health",
        "Medicine": "Health",
        "Medical": "Health",
        "Healthcare": "Health",
        
        # Technology variations -> Technology
        "Technology": "Technology",
        "Technology and Computing": "Technology",
        "Computing": "Technology",
        "IT": "Technology",
        "Internet": "Technology",
        
        # Sports variations -> Sports
        "Sports": "Sports",
        "Sports and Games": "Sports",
        "Games": "Sports",
        "Athletics": "Sports",
        
        # Nature variations -> Nature
        "Nature": "Nature",
        "Nature and Environment": "Nature",
        "Environment": "Nature",
        "Natural World": "Nature",
        "Plants": "Nature",
        "Trees": "Nature",
        "Flowers": "Nature",
        
        # Family variations -> Family
        "Family": "Family",
        "Family and Relationships": "Family",
        "Relationships": "Family",
        "Family Members": "Family",
        
        # Time variations -> Time
        "Time": "Time",
        "Time and Duration": "Time",
        "Duration": "Time",
        "Temporal Concepts": "Time",
        
        # Weather variations -> Weather
        "Weather": "Weather",
        "Weather and Climate": "Weather",
        "Climate": "Weather",
        
        # Colors variations -> Colors
        "Colors": "Colors",
        "Color": "Colors",
        "Colours": "Colors",
        
        # Numbers variations -> Numbers
        "Numbers": "Numbers",
        "Number": "Numbers",
        "Quantities": "Numbers",
        "Math": "Numbers",
        
        # Body variations -> Body
        "Body": "Body",
        "Body Parts": "Body",
        "Human Body": "Body",
        "Anatomy": "Body",
        
        # Clothing variations -> Clothing
        "Clothing": "Clothing",
        "Clothes": "Clothing",
        "Fashion": "Clothing",
        "Accessories": "Clothing",
        "Apparel": "Clothing",
        
        # Home variations -> Home
        "Home": "Home",
        "Home and Household": "Home",
        "Household": "Home",
        "House": "Home",
        "Housing": "Home",
        
        # Transport variations -> Transport
        "Transport": "Transport",
        "Transportation": "Transport",
        "Vehicles": "Transport",
        
        # Animals variations -> Animals
        "Animals": "Animals",
        "Animal": "Animals",
        "Wildlife": "Animals",
        "Pets": "Animals",
        
        # Music variations -> Music
        "Music": "Music",
        "Musical": "Music",
        "Songs": "Music",
        
        # Art variations -> Art
        "Art": "Art",
        "Arts": "Art",
        "Artistic": "Art",
        "Creative": "Art",
        
        # Science variations -> Science
        "Science": "Science",
        "Scientific": "Science",
        "Research": "Science",
        "Physics": "Science",
        "Chemistry": "Science",
        "Biology": "Science",
        
        # Politics variations -> Politics
        "Politics": "Politics",
        "Political": "Politics",
        "Government": "Politics",
        "Law": "Politics",
        
        # Communication variations -> Communication
        "Communication": "Communication",
        "Communications": "Communication",
        "Language": "Communication",
        "Speaking": "Communication",
        
        # Work variations -> Work
        "Work": "Work",
        "Work and Career": "Work",
        "Career": "Work",
        "Jobs": "Work",
        "Employment": "Work",
        "Professions": "Work",
        
        # Shopping variations -> Shopping
        "Shopping": "Shopping",
        "Shopping and Commerce": "Shopping",
        "Commerce": "Shopping",
        
        # Hobbies variations -> Hobbies
        "Hobbies": "Hobbies",
        "Hobby": "Hobbies",
        "Leisure": "Hobbies",
        "Recreation": "Hobbies",
        
        # Entertainment variations -> Entertainment
        "Entertainment": "Entertainment",
        "Entertainment and Media": "Entertainment",
        "Media": "Entertainment",
        "Movies": "Entertainment",
        "TV": "Entertainment",
        
        # Other common consolidations
        "Movement": "Actions",
        "Movements": "Actions",
        "Behavior": "Actions",
        "Behaviors": "Actions",
        
        "Concepts": "Abstract",
        "Ideas": "Abstract",
        
        "Education": "Education",
        "Learning": "Education",
        "Teaching": "Education",
        "School": "Education",
        "Study": "Education",
        
        "Abundance": "Abstract",
        "Accuracy": "Abstract",
        "Achievement": "Abstract",
        "Activity": "Actions",
        "Adjectives": "Abstract",
        "Adverbs": "Abstract",
        "Agreement": "Communication",
        "Amount": "Numbers",
        "Analysis": "Science",
        "Anger": "Emotions",
        "Animals and Nature": "Animals",
        "Aspect": "Abstract",
        "Attention": "Abstract",
        "Attitude": "Abstract",
        "Awareness": "Abstract",
        "Balance": "Abstract",
        "Beauty": "Appearance",
        "Belief": "Abstract",
        "Belongings": "Home",
        "Benefits": "Business",
        "Birth": "Family",
        "Blame": "Communication",
        "Body Language": "Communication",
        "Books": "Education",
        "Buildings": "Home",
        "Business and Finance": "Business",
        "Care": "Health",
        "Cause": "Abstract",
        "Challenges": "Abstract",
        "Change": "Abstract",
        "Character": "Abstract",
        "Characteristics": "Appearance",
        "Choice": "Abstract",
        "Circumstances": "Abstract",
        "Clarity": "Abstract",
        "Class": "Education",
        "Cleanliness": "Home",
        "Clothing and Accessories": "Clothing",
        "Comfort": "Abstract",
        "Common": "Abstract",
        "Communication and Language": "Communication",
        "Comparison": "Abstract",
        "Competition": "Sports",
        "Complexity": "Abstract",
        "Concepts and Ideas": "Abstract",
        "Concern": "Emotions",
        "Condition": "Abstract",
        "Conflict": "Abstract",
        "Connection": "Abstract",
        "Consciousness": "Abstract",
        "Consequences": "Abstract",
        "Consideration": "Abstract",
        "Consistency": "Abstract",
        "Content": "Abstract",
        "Context": "Abstract",
        "Control": "Abstract",
        "Conversation": "Communication",
        "Cooperation": "Work",
        "Cost": "Business",
        "Courage": "Emotions",
        "Creation": "Abstract",
        "Creativity": "Art",
        "Crisis": "Abstract",
        "Criticism": "Communication",
        "Culture": "Abstract",
        "Damage": "Abstract",
        "Danger": "Abstract",
        "Data": "Technology",
        "Death": "Abstract",
        "Debate": "Communication",
        "Decision": "Abstract",
        "Decrease": "Abstract",
        "Defense": "Abstract",
        "Definition": "Abstract",
        "Degree": "Abstract",
        "Delay": "Time",
        "Demand": "Business",
        "Description": "Communication",
        "Desire": "Emotions",
        "Destruction": "Abstract",
        "Detail": "Abstract",
        "Development": "Abstract",
        "Difference": "Abstract",
        "Difficulty": "Abstract",
        "Direction": "Abstract",
        "Disagreement": "Communication",
        "Disappointment": "Emotions",
        "Disaster": "Abstract",
        "Discovery": "Abstract",
        "Discussion": "Communication",
        "Disease": "Health",
        "Distance": "Abstract",
        "Distribution": "Abstract",
        "Division": "Abstract",
        "Doubt": "Emotions",
        "Dream": "Abstract",
        "Duty": "Work",
        "Ease": "Abstract",
        "Economy": "Business",
        "Effect": "Abstract",
        "Effort": "Work",
        "Emotion": "Emotions",
        "Emotional": "Emotions",
        "Employment and Work": "Work",
        "Encouragement": "Communication",
        "Energy": "Abstract",
        "Enjoyment": "Emotions",
        "Enthusiasm": "Emotions",
        "Environment and Nature": "Nature",
        "Equipment": "Abstract",
        "Error": "Abstract",
        "Event": "Abstract",
        "Evidence": "Abstract",
        "Example": "Education",
        "Excellence": "Abstract",
        "Exception": "Abstract",
        "Excitement": "Emotions",
        "Existence": "Abstract",
        "Expectation": "Emotions",
        "Experience": "Abstract",
        "Explanation": "Communication",
        "Expression": "Communication",
        "Extent": "Abstract",
        "Failure": "Abstract",
        "Fairness": "Abstract",
        "Faith": "Abstract",
        "Fame": "Abstract",
        "Family and Relationships": "Family",
        "Fashion and Style": "Clothing",
        "Fault": "Abstract",
        "Fear": "Emotions",
        "Feature": "Abstract",
        "Feeling": "Emotions",
        "Fiction": "Entertainment",
        "Financial": "Business",
        "Fitness": "Health",
        "Flexibility": "Abstract",
        "Focus": "Abstract",
        "Food and Cooking": "Food",
        "Force": "Abstract",
        "Form": "Abstract",
        "Formality": "Abstract",
        "Fortune": "Abstract",
        "Freedom": "Abstract",
        "Friendship": "Family",
        "Function": "Abstract",
        "Future": "Time",
        "Gain": "Business",
        "Gap": "Abstract",
        "Gathering": "Abstract",
        "Gender": "Abstract",
        "Generation": "Family",
        "Gesture": "Communication",
        "Gift": "Abstract",
        "Goal": "Abstract",
        "Goods": "Shopping",
        "Government and Politics": "Politics",
        "Grace": "Abstract",
        "Gratitude": "Emotions",
        "Greatness": "Abstract",
        "Grief": "Emotions",
        "Group": "Abstract",
        "Growth": "Abstract",
        "Guilt": "Emotions",
        "Habit": "Abstract",
        "Happiness": "Emotions",
        "Harm": "Abstract",
        "Harmony": "Abstract",
        "Hate": "Emotions",
        "Health and Medicine": "Health",
        "Health and Wellness": "Health",
        "Hearing": "Abstract",
        "Help": "Abstract",
        "History": "Education",
        "Honor": "Abstract",
        "Hope": "Emotions",
        "Hospitality": "Home",
        "House and Home": "Home",
        "Human": "Abstract",
        "Humor": "Entertainment",
        "Idea": "Abstract",
        "Identity": "Abstract",
        "Ignorance": "Abstract",
        "Illness": "Health",
        "Image": "Abstract",
        "Imagination": "Abstract",
        "Impact": "Abstract",
        "Importance": "Abstract",
        "Impression": "Abstract",
        "Improvement": "Abstract",
        "Inaccuracy": "Abstract",
        "Inclusion": "Abstract",
        "Income": "Business",
        "Increase": "Abstract",
        "Independence": "Abstract",
        "Individual": "Abstract",
        "Industry": "Business",
        "Influence": "Abstract",
        "Information": "Abstract",
        "Injury": "Health",
        "Innovation": "Technology",
        "Input": "Abstract",
        "Inquiry": "Communication",
        "Insight": "Abstract",
        "Inspiration": "Abstract",
        "Instruction": "Education",
        "Intelligence": "Abstract",
        "Intention": "Abstract",
        "Interest": "Abstract",
        "Internet and Technology": "Technology",
        "Interpretation": "Communication",
        "Interview": "Communication",
        "Introduction": "Communication",
        "Intuition": "Abstract",
        "Invitation": "Communication",
        "Involvement": "Abstract",
        "Issue": "Abstract",
        "Joy": "Emotions",
        "Judgment": "Abstract",
        "Justice": "Politics",
        "Kindness": "Emotions",
        "Knowledge": "Education",
        "Labor": "Work",
        "Lack": "Abstract",
        "Language and Communication": "Communication",
        "Law and Politics": "Politics",
        "Leadership": "Work",
        "Learning and Education": "Education",
        "Leisure and Hobbies": "Hobbies",
        "Length": "Abstract",
        "Level": "Abstract",
        "Liability": "Abstract",
        "Liberty": "Abstract",
        "Life": "Abstract",
        "Lifestyle": "Abstract",
        "Light": "Abstract",
        "Limit": "Abstract",
        "Line": "Abstract",
        "Link": "Abstract",
        "List": "Abstract",
        "Literature": "Education",
        "Location": "Abstract",
        "Logic": "Abstract",
        "Loss": "Abstract",
        "Love": "Emotions",
        "Luck": "Abstract",
        "Luxury": "Abstract",
        "Machine": "Technology",
        "Magic": "Abstract",
        "Maintenance": "Abstract",
        "Management": "Work",
        "Manner": "Abstract",
        "Market": "Business",
        "Marriage": "Family",
        "Material": "Abstract",
        "Matter": "Abstract",
        "Meaning": "Abstract",
        "Measurement": "Abstract",
        "Media and Entertainment": "Entertainment",
        "Medicine and Health": "Health",
        "Meeting": "Communication",
        "Memory": "Abstract",
        "Mental": "Abstract",
        "Message": "Communication",
        "Method": "Abstract",
        "Mind": "Abstract",
        "Mistake": "Abstract",
        "Mode": "Abstract",
        "Modification": "Abstract",
        "Money": "Business",
        "Mood": "Emotions",
        "Moral": "Abstract",
        "Motion": "Actions",
        "Motivation": "Abstract",
        "Movement and Motion": "Actions",
        "Music and Sound": "Music",
        "Mystery": "Abstract",
        "Myth": "Abstract",
        "Name": "Abstract",
        "Nature and Environment": "Nature",
        "Need": "Abstract",
        "Neglect": "Abstract",
        "Negotiation": "Communication",
        "Nervousness": "Emotions",
        "Network": "Technology",
        "News": "Entertainment",
        "Noise": "Abstract",
        "Norm": "Abstract",
        "Note": "Communication",
        "Notice": "Communication",
        "Number and Quantity": "Numbers",
        "Object": "Abstract",
        "Obligation": "Abstract",
        "Observation": "Abstract",
        "Obstacle": "Abstract",
        "Occasion": "Abstract",
        "Occupation": "Work",
        "Offer": "Business",
        "Operation": "Abstract",
        "Opinion": "Communication",
        "Opportunity": "Abstract",
        "Opposition": "Abstract",
        "Option": "Abstract",
        "Order": "Abstract",
        "Organization": "Work",
        "Origin": "Abstract",
        "Outcome": "Abstract",
        "Output": "Abstract",
        "Ownership": "Abstract",
        "Pain": "Health",
        "Pair": "Abstract",
        "Part": "Abstract",
        "Participation": "Abstract",
        "Partner": "Family",
        "Passion": "Emotions",
        "Past": "Time",
        "Path": "Abstract",
        "Patience": "Emotions",
        "Pattern": "Abstract",
        "Peace": "Abstract",
        "People": "Abstract",
        "Perception": "Abstract",
        "Performance": "Abstract",
        "Permission": "Abstract",
        "Person": "Abstract",
        "Personality": "Abstract",
        "Perspective": "Abstract",
        "Phenomenon": "Abstract",
        "Philosophy": "Abstract",
        "Phone": "Communication",
        "Physical": "Body",
        "Place": "Abstract",
        "Plan": "Abstract",
        "Pleasure": "Emotions",
        "Point": "Abstract",
        "Policy": "Politics",
        "Politics and Government": "Politics",
        "Pollution": "Nature",
        "Position": "Abstract",
        "Possibility": "Abstract",
        "Posture": "Body",
        "Potential": "Abstract",
        "Power": "Abstract",
        "Practice": "Abstract",
        "Praise": "Communication",
        "Prayer": "Abstract",
        "Preference": "Abstract",
        "Preparation": "Abstract",
        "Presence": "Abstract",
        "Presentation": "Communication",
        "Pressure": "Abstract",
        "Price": "Business",
        "Pride": "Emotions",
        "Principle": "Abstract",
        "Priority": "Abstract",
        "Privacy": "Abstract",
        "Problem": "Abstract",
        "Process": "Abstract",
        "Product": "Business",
        "Production": "Business",
        "Profession": "Work",
        "Profit": "Business",
        "Progress": "Abstract",
        "Project": "Work",
        "Promise": "Communication",
        "Proof": "Abstract",
        "Property": "Abstract",
        "Proposal": "Communication",
        "Prospect": "Abstract",
        "Protection": "Abstract",
        "Psychology": "Abstract",
        "Public": "Abstract",
        "Purpose": "Abstract",
        "Quality": "Abstract",
        "Quantity": "Numbers",
        "Question": "Communication",
        "Race": "Abstract",
        "Range": "Abstract",
        "Rank": "Abstract",
        "Rate": "Abstract",
        "Ratio": "Abstract",
        "Reaction": "Actions",
        "Reading": "Education",
        "Reality": "Abstract",
        "Reason": "Abstract",
        "Reception": "Abstract",
        "Recognition": "Abstract",
        "Record": "Abstract",
        "Recovery": "Health",
        "Reduction": "Abstract",
        "Reference": "Abstract",
        "Reflection": "Abstract",
        "Region": "Abstract",
        "Regret": "Emotions",
        "Regulation": "Politics",
        "Relation": "Abstract",
        "Relationship": "Family",
        "Relaxation": "Hobbies",
        "Release": "Abstract",
        "Relevance": "Abstract",
        "Relief": "Emotions",
        "Religion": "Abstract",
        "Remedy": "Health",
        "Reminder": "Communication",
        "Removal": "Abstract",
        "Repair": "Abstract",
        "Repetition": "Abstract",
        "Reply": "Communication",
        "Report": "Communication",
        "Representation": "Abstract",
        "Reputation": "Abstract",
        "Request": "Communication",
        "Requirement": "Abstract",
        "Rescue": "Abstract",
        "Research": "Science",
        "Reservation": "Abstract",
        "Residence": "Home",
        "Resistance": "Abstract",
        "Resolution": "Abstract",
        "Resource": "Abstract",
        "Respect": "Emotions",
        "Response": "Communication",
        "Responsibility": "Work",
        "Rest": "Hobbies",
        "Restriction": "Abstract",
        "Result": "Abstract",
        "Retirement": "Work",
        "Return": "Abstract",
        "Revelation": "Abstract",
        "Revenge": "Emotions",
        "Review": "Communication",
        "Revolution": "Politics",
        "Reward": "Abstract",
        "Rhythm": "Music",
        "Rights": "Politics",
        "Risk": "Abstract",
        "Ritual": "Abstract",
        "Role": "Abstract",
        "Romance": "Family",
        "Room": "Home",
        "Root": "Abstract",
        "Route": "Travel",
        "Rule": "Abstract",
        "Rumor": "Communication",
        "Safety": "Abstract",
        "Sale": "Shopping",
        "Satisfaction": "Emotions",
        "Scale": "Abstract",
        "Scandal": "Abstract",
        "Scene": "Abstract",
        "Schedule": "Time",
        "Scheme": "Abstract",
        "School and Education": "Education",
        "Science and Research": "Science",
        "Scope": "Abstract",
        "Score": "Sports",
        "Script": "Entertainment",
        "Search": "Abstract",
        "Season": "Time",
        "Secret": "Abstract",
        "Section": "Abstract",
        "Security": "Abstract",
        "Selection": "Abstract",
        "Self": "Abstract",
        "Sense": "Abstract",
        "Sensitivity": "Abstract",
        "Sentence": "Communication",
        "Separation": "Abstract",
        "Sequence": "Abstract",
        "Series": "Abstract",
        "Service": "Business",
        "Session": "Abstract",
        "Setting": "Abstract",
        "Sex": "Abstract",
        "Shape": "Abstract",
        "Share": "Abstract",
        "Shock": "Emotions",
        "Shopping and Commerce": "Shopping",
        "Show": "Entertainment",
        "Sight": "Abstract",
        "Sign": "Communication",
        "Signal": "Communication",
        "Significance": "Abstract",
        "Silence": "Communication",
        "Similarity": "Abstract",
        "Situation": "Abstract",
        "Size": "Abstract",
        "Skill": "Abilities",
        "Sleep": "Health",
        "Smell": "Abstract",
        "Society": "Abstract",
        "Software": "Technology",
        "Solution": "Abstract",
        "Sorrow": "Emotions",
        "Sound": "Music",
        "Source": "Abstract",
        "Space": "Abstract",
        "Spark": "Abstract",
        "Speaking and Communication": "Communication",
        "Species": "Animals",
        "Speech": "Communication",
        "Speed": "Abstract",
        "Spirit": "Abstract",
        "Sport": "Sports",
        "Sports and Recreation": "Sports",
        "Stability": "Abstract",
        "Stage": "Abstract",
        "Standard": "Abstract",
        "State": "Abstract",
        "Statement": "Communication",
        "Status": "Abstract",
        "Step": "Abstract",
        "Stimulus": "Abstract",
        "Story": "Entertainment",
        "Strategy": "Abstract",
        "Strength": "Abstract",
        "Stress": "Health",
        "Strike": "Actions",
        "Structure": "Abstract",
        "Struggle": "Abstract",
        "Student": "Education",
        "Study": "Education",
        "Style": "Clothing",
        "Subject": "Education",
        "Submission": "Abstract",
        "Substance": "Abstract",
        "Substitution": "Abstract",
        "Success": "Abstract",
        "Suggestion": "Communication",
        "Suit": "Clothing",
        "Summary": "Communication",
        "Sun": "Weather",
        "Supply": "Business",
        "Support": "Abstract",
        "Surprise": "Emotions",
        "Surroundings": "Abstract",
        "Survey": "Communication",
        "Survival": "Abstract",
        "Suspicion": "Emotions",
        "Symbol": "Abstract",
        "Sympathy": "Emotions",
        "System": "Abstract",
        "Talent": "Abilities",
        "Taste": "Abstract",
        "Tax": "Business",
        "Teacher": "Education",
        "Teaching and Learning": "Education",
        "Team": "Work",
        "Technique": "Abstract",
        "Technology and Computing": "Technology",
        "Telephone": "Communication",
        "Television": "Entertainment",
        "Temper": "Emotions",
        "Temperature": "Weather",
        "Tension": "Abstract",
        "Term": "Abstract",
        "Territory": "Abstract",
        "Test": "Education",
        "Text": "Communication",
        "Texture": "Abstract",
        "Theater": "Entertainment",
        "Theme": "Abstract",
        "Theory": "Science",
        "Thing": "Abstract",
        "Thought": "Abstract",
        "Threat": "Abstract",
        "Time and Duration": "Time",
        "Tone": "Communication",
        "Tool": "Abstract",
        "Topic": "Abstract",
        "Touch": "Abstract",
        "Tradition": "Abstract",
        "Traffic": "Transport",
        "Training": "Education",
        "Transaction": "Business",
        "Transformation": "Abstract",
        "Transition": "Abstract",
        "Transport and Travel": "Travel",
        "Transportation and Vehicles": "Transport",
        "Travel and Tourism": "Travel",
        "Treatment": "Health",
        "Trial": "Abstract",
        "Trick": "Abstract",
        "Trouble": "Abstract",
        "Trust": "Emotions",
        "Truth": "Abstract",
        "Turn": "Abstract",
        "Type": "Abstract",
        "Understanding": "Abstract",
        "Unemployment": "Work",
        "Uniqueness": "Abstract",
        "Unit": "Abstract",
        "Unity": "Abstract",
        "University": "Education",
        "Unrest": "Abstract",
        "Update": "Abstract",
        "Urge": "Emotions",
        "Use": "Abstract",
        "Usefulness": "Abstract",
        "User": "Technology",
        "Value": "Abstract",
        "Variation": "Abstract",
        "Variety": "Abstract",
        "Vehicle": "Transport",
        "Version": "Abstract",
        "Vibration": "Abstract",
        "View": "Abstract",
        "Violence": "Abstract",
        "Virtue": "Abstract",
        "Vision": "Abstract",
        "Visit": "Travel",
        "Voice": "Communication",
        "Volume": "Abstract",
        "Vote": "Politics",
        "Wage": "Business",
        "War": "Abstract",
        "Warning": "Communication",
        "Waste": "Abstract",
        "Water": "Nature",
        "Way": "Abstract",
        "Weakness": "Abstract",
        "Wealth": "Business",
        "Weapon": "Abstract",
        "Weather Conditions": "Weather",
        "Weight": "Abstract",
        "Welcome": "Communication",
        "Welfare": "Health",
        "Wellness": "Health",
        "Wheel": "Transport",
        "Width": "Abstract",
        "Will": "Abstract",
        "Wind": "Weather",
        "Wisdom": "Abstract",
        "Wish": "Emotions",
        "Witness": "Abstract",
        "Wonder": "Emotions",
        "Word": "Communication",
        "Work and Career": "Work",
        "Work and Employment": "Work",
        "Workplace": "Work",
        "World": "Abstract",
        "Worry": "Emotions",
        "Worth": "Abstract",
        "Writing": "Communication",
        "Year": "Time",
        "Youth": "Abstract",
        "Zone": "Abstract",
    }
    
    # Получаем все группы
    all_groups = session.query(Group).all()
    group_map = {g.name: g for g in all_groups}
    
    # Создаем список целевых групп (те, к которым будем объединять)
    target_groups = set(consolidation_map.values())
    
    # Создаем целевые группы, если их нет
    created_targets = {}
    for target_name in target_groups:
        if target_name not in group_map:
            new_group = Group(name=target_name)
            session.add(new_group)
            session.flush()
            created_targets[target_name] = new_group
            group_map[target_name] = new_group
            logging.info(f"Created target group: {target_name}")
    
    session.commit()
    
    # Обновляем маппинг после создания новых групп
    for target_name in target_groups:
        if target_name not in group_map:
            group_map[target_name] = session.query(Group).filter(Group.name == target_name).first()
    
    # Объединяем группы и переназначаем слова
    merged_count = 0
    reassigned_words = 0
    
    for old_name, target_name in consolidation_map.items():
        if old_name not in group_map:
            continue  # Группа не существует, пропускаем
        
        old_group = group_map[old_name]
        target_group = group_map[target_name]
        
        if old_group.id == target_group.id:
            continue  # Это та же группа, пропускаем
        
        # Переназначаем слова из старой группы в новую
        words_count = session.query(Word).filter(Word.group_id == old_group.id).count()
        if words_count > 0:
            session.query(Word).filter(Word.group_id == old_group.id).update({
                "group_id": target_group.id,
                "group_name": target_name
            })
            reassigned_words += words_count
            logging.info(f"Merged {words_count} words from '{old_name}' to '{target_name}'")
        
        # Удаляем старую группу
        session.delete(old_group)
        merged_count += 1
        del group_map[old_name]
    
    session.commit()
    
    # Переназначаем слова из удаленных групп на случайные группы из доступных
    all_group_ids = {g.id for g in session.query(Group).all()}
    orphaned_words = session.query(Word).filter(
        Word.group_id.isnot(None),
        ~Word.group_id.in_(all_group_ids)
    ).all()
    
    available_groups = session.query(Group).all()
    if available_groups and orphaned_words:
        for word in orphaned_words:
            random_group = random.choice(available_groups)
            word.group_id = random_group.id
            word.group_name = random_group.name
        session.commit()
        reassigned_words += len(orphaned_words)
        logging.info(f"Reassigned {len(orphaned_words)} orphaned words to random groups")
    
    # Обрабатываем группы, которые не попали в маппинг
    # Сначала получаем все существующие группы после объединения
    remaining_groups = {g.name: g for g in session.query(Group).all()}
    target_group_names = set(consolidation_map.values())
    
    # Для групп, не попавших в маппинг, пытаемся найти похожую целевую группу
    # или назначаем в "Abstract" как универсальную
    unmapped_groups = [g for g in remaining_groups.values() if g.name not in target_group_names]
    
    for unmapped_group in unmapped_groups:
        # Ищем похожую группу по названию (простое сравнение)
        best_match = None
        best_score = 0
        
        for target_name in target_group_names:
            # Простое сравнение: если название содержит ключевые слова
            unmapped_lower = unmapped_group.name.lower()
            target_lower = target_name.lower()
            
            # Если названия совпадают частично
            if target_lower in unmapped_lower or unmapped_lower in target_lower:
                score = len(set(unmapped_lower.split()) & set(target_lower.split()))
                if score > best_score:
                    best_score = score
                    best_match = target_name
        
        # Если не нашли совпадение, используем "Abstract" как универсальную группу
        if not best_match:
            best_match = "Abstract"
        
        # Создаем целевую группу, если её нет
        if best_match not in remaining_groups:
            new_group = Group(name=best_match)
            session.add(new_group)
            session.flush()
            remaining_groups[best_match] = new_group
        
        target_group = remaining_groups[best_match]
        
        # Переназначаем слова
        words_count = session.query(Word).filter(Word.group_id == unmapped_group.id).count()
        if words_count > 0:
            session.query(Word).filter(Word.group_id == unmapped_group.id).update({
                "group_id": target_group.id,
                "group_name": best_match
            })
            reassigned_words += words_count
            logging.info(f"Merged {words_count} words from unmapped '{unmapped_group.name}' to '{best_match}'")
        
        # Удаляем несопоставленную группу
        if unmapped_group.id != target_group.id:
            session.delete(unmapped_group)
            merged_count += 1
    
    session.commit()
    
    # Удаляем дубликаты групп (если есть группы с одинаковыми названиями)
    all_groups = session.query(Group).all()
    seen_names = {}
    duplicates_to_delete = []
    
    for group in all_groups:
        if group.name in seen_names:
            # Переназначаем слова из дубликата в основную группу
            main_group = seen_names[group.name]
            dup_words = session.query(Word).filter(Word.group_id == group.id).all()
            for word in dup_words:
                word.group_id = main_group.id
                word.group_name = main_group.name
            duplicates_to_delete.append(group)
        else:
            seen_names[group.name] = group
    
    for dup in duplicates_to_delete:
        session.delete(dup)
        merged_count += 1
    
    session.commit()
    
    # Удаляем неиспользуемые группы, оставляя только популярные
    used_group_ids = {w.group_id for w in session.query(Word.group_id).filter(Word.group_id.isnot(None)).distinct().all()}
    unused_groups = session.query(Group).filter(~Group.id.in_(used_group_ids) if used_group_ids else True).all()
    
    # Оставляем только популярные группы, даже если они не используются
    popular_groups = [
        "Emotions", "Education", "Appearance", "Food", "Travel", "Business",
        "Health", "Technology", "Sports", "Nature", "Family", "Time",
        "Weather", "Colors", "Numbers", "Body", "Clothing", "Home",
        "Transport", "Animals", "Music", "Art", "Science", "Politics",
        "Communication", "Work", "Shopping", "Hobbies", "Entertainment", "Abstract",
        "Actions", "Abilities"
    ]
    
    for unused_group in unused_groups:
        if unused_group.name not in popular_groups:
            session.delete(unused_group)
            merged_count += 1
    
    session.commit()
    
    final_count = session.query(Group).count()
    
    # Если все еще слишком много групп, удаляем наименее используемые
    if final_count > 50:
        # Подсчитываем использование групп
        from sqlalchemy import func
        group_usage = session.query(
            Group.id,
            Group.name,
            func.count(Word.id).label('word_count')
        ).outerjoin(Word, Group.id == Word.group_id).group_by(Group.id, Group.name).all()
        
        # Сортируем по использованию (сначала популярные, затем по количеству слов)
        sorted_groups = sorted(
            group_usage,
            key=lambda x: (x.name in popular_groups, x.word_count or 0),
            reverse=True
        )
        
        # Оставляем топ-50 групп
        keep_ids = {g.id for g in sorted_groups[:50]}
        
        # Переназначаем слова из удаляемых групп
        groups_to_remove = [g for g in all_groups if g.id not in keep_ids]
        keep_groups = [g for g in all_groups if g.id in keep_ids]
        
        if keep_groups:
            for group_to_remove in groups_to_remove:
                words_to_reassign = session.query(Word).filter(Word.group_id == group_to_remove.id).all()
                for word in words_to_reassign:
                    random_group = random.choice(keep_groups)
                    word.group_id = random_group.id
                    word.group_name = random_group.name
                session.delete(group_to_remove)
                merged_count += 1
                reassigned_words += len(words_to_reassign)
        
        session.commit()
        final_count = session.query(Group).count()
    
    result = {
        "merged_groups": merged_count,
        "reassigned_words": reassigned_words,
        "final_group_count": final_count,
        "message": f"Consolidated groups: merged {merged_count} groups, reassigned {reassigned_words} words, final count: {final_count}"
    }
    
    if _wants_json(request):
        return JSONResponse(result)
    
    return result


@router.post("/words/{word_id}/delete")
def delete_word(word_id: int, request: Request, session: Session = Depends(get_session)):
    try:
        word = session.get(Word, word_id)
        if not word:
            if _wants_json(request):
                return JSONResponse({"error": "Word not found"}, status_code=404)
            return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
        
        # CASCADE удаление связей обработается автоматически через ForeignKey ondelete="CASCADE"
        session.delete(word)
        session.commit()
        
        if _wants_json(request):
            return JSONResponse({"success": True, "deleted_id": word_id})
        
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    except Exception as e:
        logging.exception(f"Error deleting word {word_id}: {e}")
        session.rollback()
        if _wants_json(request):
            return JSONResponse({"error": str(e)}, status_code=500)
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/words/bulk-delete")
async def bulk_delete_words(request: Request, session: Session = Depends(get_session)):
    """Массовое удаление слов"""
    try:
        if _wants_json(request):
            payload = await request.json()
        else:
            from fastapi import Form
            payload = await request.form()
            word_ids_str = payload.get("word_ids", "[]")
            import json
            payload = {"word_ids": json.loads(word_ids_str) if word_ids_str else []}
        
        word_ids = payload.get("word_ids", [])
        if not word_ids or not isinstance(word_ids, list):
            if _wants_json(request):
                return JSONResponse({"error": "word_ids array is required"}, status_code=400)
            return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
        
        # Удаляем слова
        deleted_count = 0
        for word_id in word_ids:
            try:
                word = session.get(Word, int(word_id))
                if word:
                    session.delete(word)
                    deleted_count += 1
            except Exception as e:
                logging.warning(f"Error deleting word {word_id}: {e}")
                continue
        
        session.commit()
        
        if _wants_json(request):
            return JSONResponse({"success": True, "deleted_count": deleted_count, "requested_count": len(word_ids)})
        
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)
    except Exception as e:
        logging.exception(f"Error in bulk delete: {e}")
        session.rollback()
        if _wants_json(request):
            return JSONResponse({"error": str(e)}, status_code=500)
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


class EditWordRequest(BaseModel):
    text: Optional[str] = None
    main_translation: Optional[str] = None
    group_id: Optional[int] = None
    group_name: Optional[str] = None  # Legacy support


@router.post("/words/{word_id}/edit")
async def quick_edit_word(
    word_id: int,
    request: Request,
    text: Optional[str] = Form(None),
    main_translation: Optional[str] = Form(None),
    group_id: Optional[int] = Form(None),
    group_name: Optional[str] = Form(None),
    body: EditWordRequest = Body(None),
    session: Session = Depends(get_session),
):
    word = session.get(Word, word_id)
    if not word:
        if _wants_json(request):
            return JSONResponse({"error": "Word not found"}, status_code=404)
        return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)

    # Поддержка как Form, так и JSON body
    group_id_value = None
    if _wants_json(request):
        try:
            if body:
                text = body.text if body.text is not None else text
                main_translation = body.main_translation if body.main_translation is not None else main_translation
                group_id_value = body.group_id if body.group_id is not None else None
                group_name = body.group_name if body.group_name is not None and group_id_value is None else group_name
            else:
                try:
                    json_data = await request.json()
                    text = json_data.get("text") if json_data.get("text") is not None else text
                    main_translation = json_data.get("main_translation") if json_data.get("main_translation") is not None else main_translation
                    group_id_value = json_data.get("group_id")
                    if group_id_value is None:
                        group_name = json_data.get("group_name") if json_data.get("group_name") is not None else group_name
                except:
                    pass
        except:
            pass
    else:
        if body:
            text = body.text if body.text is not None else text
            main_translation = body.main_translation if body.main_translation is not None else main_translation
            group_id_value = body.group_id if body.group_id is not None else None
            group_name = body.group_name if body.group_name is not None and group_id_value is None else group_name

    if text is not None:
        word.text = _sanitize_str(text, 255) or word.text
    if main_translation is not None:
        word.main_translation = _sanitize_str(main_translation, 255)
    
    # Handle group assignment
    if group_id_value is not None:
        # Use group_id if provided
        group = session.get(Group, group_id_value)
        if group:
            word.group_id = group.id
            word.group_name = group.name  # Keep legacy field in sync
        else:
            word.group_id = None
            word.group_name = None
    elif group_name is not None:
        # Use group_name if provided (legacy support)
        group_name_clean = _sanitize_str(group_name, 128)
        if group_name_clean:
            # Try to find existing group
            group = session.query(Group).filter(Group.name == group_name_clean).first()
            if group:
                word.group_id = group.id
                word.group_name = group.name
            else:
                # Create new group
                group = Group(name=group_name_clean)
                session.add(group)
                session.flush()
                word.group_id = group.id
                word.group_name = group.name
        else:
            word.group_id = None
            word.group_name = None

    session.commit()
    
    if _wants_json(request):
        return JSONResponse({"success": True, "word": _word_to_dict(word, session)})
    
    return RedirectResponse(url="/words", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/words/{word_id}/examples")
def generate_examples(word_id: int, session: Session = Depends(get_session)):
    word = session.get(Word, word_id)
    if not word:
        return {"examples": []}
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"examples": []}
    client = OpenAI(api_key=api_key)
    prompt = (
        "Give exactly 5 short English example sentences using the word or phrase '"
        + (word.text or "")
        + "' in different simple contexts, and provide precise Russian translations.\n"
        "Respond as strict JSON array of objects: [{\"en\": \"...\", \"ru\": \"...\"}] with 5 items, no markdown."
    )
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Return strict JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=400,
            timeout=15.0,
        )
        content = resp.choices[0].message.content
        data = json.loads(content)
        if isinstance(data, list):
            return {"examples": data[:5]}
    except Exception:
        pass
    return {"examples": []}


@router.get("/words/{word_id}/tooltip")
def word_tooltip(word_id: int, session: Session = Depends(get_session)):
    word = session.get(Word, word_id)
    if not word:
        return JSONResponse({"html": "<div>Слово не найдено</div>"})

    text = (word.text or "").strip()
    main_tr = (word.main_translation or "").strip()
    # Показываем все альтернативные переводы (до 10)
    alt_list = [a for a in (word.alt_translations or []) if a]
    alts = ", ".join(alt_list)

    # Загружаем синонимы из базы данных
    synonyms_data: List[dict] = []
    try:
        from sqlalchemy.orm import joinedload
        relations = (
            session.query(WordRelation)
            .options(joinedload(WordRelation.related_word))
            .filter(
                WordRelation.word_id == word_id,
                WordRelation.relation_type == "synonym"
            )
            .all()
        )
        
        for relation in relations:
            if relation.related_word:
                synonym_word = relation.related_word.text or ""
                synonym_translation = relation.related_word.main_translation or ""
                if synonym_word and synonym_translation:
                    synonyms_data.append({
                        "word": synonym_word,
                        "translation": synonym_translation
                    })
    except Exception as e:
        logging.error(f"Error loading synonyms for word {word_id}: {e}")
        synonyms_data = []

    # Генерируем примеры через LLM (если нужно)
    api_key = os.getenv("OPENAI_API_KEY")
    examples: list = []
    error_note: str = ""
    if api_key and text:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            prompt = (
                "You are an English language assistant. Given a target term, return 5 short, simple English example sentences using the target term. "
                "If the target term is in Russian, first infer the most common English equivalent and use that English form for examples. "
                "Do NOT include any translations. Respond as strict JSON: {\"examples\": [..]}."
            )
            user_part = f"Target: {text}"
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Return strict JSON only."},
                    {"role": "user", "content": prompt + "\n\n" + user_part},
                ],
                temperature=0.3,
                max_tokens=300,
                timeout=15.0,
                response_format={"type": "json_object"},
            )
            content = resp.choices[0].message.content
            data = json.loads(content)
            if isinstance(data, dict):
                examples = [e for e in (data.get("examples") or []) if isinstance(e, str)][:5]
        except Exception:
            logging.exception("word_tooltip examples generation failed")
            error_note = "Генерация примеров недоступна."

    def esc(s: str) -> str:
        return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    parts: List[str] = []
    parts.append(f"<div class=\"tooltip-word\"><strong>{esc(text)}</strong></div>")
    
    # Показываем все альтернативные переводы
    tr_line = esc(main_tr) if main_tr else "—"
    if alt_list:
        tr_line += " — " + esc(", ".join(alt_list))
    parts.append(f"<div class=\"tooltip-translations\">{tr_line}</div>")
    
    # Показываем синонимы из базы данных
    if synonyms_data:
        synonyms_text = ", ".join([f"{esc(s['word'])} — {esc(s['translation'])}" for s in synonyms_data])
        parts.append(f"<div class=\"tooltip-synonyms\"><em>Синонимы:</em> {synonyms_text}</div>")
    else:
        parts.append(f"<div class=\"tooltip-synonyms\"><em>Синонимы:</em> <span class=\"text-muted\">нет</span></div>")
    
    # Показываем примеры
    if examples:
        lis = "".join([f"<li>{esc(e)}</li>" for e in examples])
        parts.append(f"<div class=\"tooltip-examples\"><ol style=\"margin:0 0 0 16px; padding:0;\">{lis}</ol></div>")
    else:
        msg = esc(error_note or 'недоступно')
        parts.append(f"<div class=\"tooltip-examples\"><ol style=\"margin:0 0 0 16px; padding:0;\"><li class=\"text-muted\">{msg}</li></ol></div>")
    html = "".join(parts) or "<div>Нет данных</div>"

    return JSONResponse({"html": html})


