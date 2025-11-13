from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.orm import Session
from typing import List
import os
import json
import logging
import re
from sqlalchemy import or_, func, text as sa_text

from .database import get_session
from .models import Word, Group, Conversation, Message, Setting
from .services.assistant_tools import (
    process_tool_directive,
    add_words_tool as _add_words_and_enrich,
    suggest_words_tool,
)


router = APIRouter()


@router.get("/assistant")
def assistant_page(request: Request):
    # Rendered in main router to keep templating context; kept here for logical grouping
    from fastapi.templating import Jinja2Templates
    templates = Jinja2Templates(directory="app/templates")
    return templates.TemplateResponse("assistant.html", {"request": request})


@router.post("/assistant/start")
def assistant_start(session: Session = Depends(get_session)):
    conv = Conversation()
    session.add(conv)
    session.commit()
    return {"conversation_id": conv.id}


def _fetch_kb_for_query(session: Session, query_text: str, limit: int = 20) -> List[dict]:
    """
    Получает релевантные слова для контекста ассистента.
    Старается обеспечить разнообразие: разные группы, случайный выбор для избежания повторений.
    """
    import random
    from sqlalchemy import text as sa_text
    
    search_term = f"%{query_text}%"
    tags_str = func.coalesce(func.array_to_string(Word.tags, ","), "")
    alt_str = func.coalesce(func.array_to_string(Word.alt_translations, ","), "")
    
    # Ищем релевантные слова БЕЗ сортировки по uses_count для разнообразия
    # Используем PostgreSQL RANDOM() для случайного порядка
    # Исключаем слова с to_teach=False (синонимы)
    related: List[Word] = (
        session.query(Word)
        .filter(Word.to_teach == True)
        .filter(
            or_(
                Word.text.ilike(search_term),
                Word.main_translation.ilike(search_term),
                alt_str.ilike(search_term),
                tags_str.ilike(search_term),
                Word.group_name.ilike(search_term),
            )
        )
        .order_by(sa_text("RANDOM()"))  # Случайный порядок для разнообразия
        .limit(limit * 3)  # Берем больше для дальнейшего отбора
        .all()
    )

    if not related:
        # Если релевантных нет, выбираем разнообразные слова из всего словаря
        # Берем слова из разных групп и с разным uses_count
        total_words = session.query(func.count(Word.id)).scalar() or 0
        if total_words == 0:
            return []
        
        # Стратегия разнообразия: берем слова из разных групп
        # Сначала получаем все группы и слова из них
        groups_with_words = (
            session.query(Word.group_name, func.count(Word.id).label("cnt"))
            .filter(Word.group_name.isnot(None))
            .group_by(Word.group_name)
            .having(func.count(Word.id) > 0)
            .all()
        )
        
        # Перемешиваем группы в Python для разнообразия
        groups_list = list(groups_with_words)
        random.shuffle(groups_list)
        groups_list = groups_list[:10]  # Берем до 10 групп
        
        related = []
        words_per_group = max(2, limit // max(1, len(groups_list))) if groups_list else limit
        
        for group_name, _ in groups_list:
            group_words = (
                session.query(Word)
                .filter(Word.to_teach == True)
                .filter(Word.group_name == group_name)
                .limit(words_per_group * 2)  # Берем больше для случайного выбора
                .all()
            )
            # Перемешиваем в Python для разнообразия
            random.shuffle(group_words)
            related.extend(group_words[:words_per_group])
            if len(related) >= limit:
                break
        
        # Если все еще недостаточно слов, дополняем случайными
        if len(related) < limit:
            remaining = limit - len(related)
            existing_ids = {w.id for w in related}
            all_remaining = (
                session.query(Word)
                .filter(Word.to_teach == True)
                .filter(~Word.id.in_(existing_ids) if existing_ids else True)
                .limit(remaining * 3)  # Берем больше для случайного выбора
                .all()
            )
            random.shuffle(all_remaining)
            related.extend(all_remaining[:remaining])
    
    # Если нашли релевантные слова, обеспечиваем разнообразие
    if related:
        # Группируем по группам для разнообразия
        words_by_group = {}
        words_without_group = []
        
        for word in related:
            group = word.group_name or "без_группы"
            if group == "без_группы":
                words_without_group.append(word)
            else:
                if group not in words_by_group:
                    words_by_group[group] = []
                words_by_group[group].append(word)
        
        # Собираем результат с разнообразием: берем по несколько слов из каждой группы
        result = []
        words_per_group = max(1, limit // max(1, len(words_by_group) + 1))
        
        # Перемешиваем порядок групп для разнообразия
        group_names = list(words_by_group.keys())
        random.shuffle(group_names)
        
        for group_name in group_names:
            group_words = words_by_group[group_name]
            random.shuffle(group_words)  # Случайный порядок внутри группы
            result.extend(group_words[:words_per_group])
            if len(result) >= limit:
                break
        
        # Добавляем слова без группы, если нужно
        if len(result) < limit and words_without_group:
            random.shuffle(words_without_group)
            remaining = limit - len(result)
            result.extend(words_without_group[:remaining])
        
        # Если все еще недостаточно, берем оставшиеся релевантные слова
        if len(result) < limit:
            used_ids = {w.id for w in result}
            remaining_words = [w for w in related if w.id not in used_ids]
            random.shuffle(remaining_words)
            result.extend(remaining_words[:limit - len(result)])
        
        related = result[:limit]
    
    kb = []
    for w in related:
        kb.append({
            "id": w.id,
            "text": w.text,
            "translation": w.main_translation,
            "tags": w.tags or [],
            "group": w.group_name,
            "example": w.usage_example,
            "example_ru": w.usage_example_translation,
            "uses": w.uses_count,
        })
    return kb


def _fetch_conversation_history(session: Session, conversation_id: int, limit: int = 20) -> List[dict]:
    rows = session.execute(
        sa_text(
            "SELECT role, content FROM messages WHERE conversation_id = :cid ORDER BY id DESC LIMIT :lim"
        ),
        {"cid": conversation_id, "lim": limit},
    ).fetchall()
    result = [{"role": r[0], "content": r[1]} for r in reversed(rows)]
    return result


# Функции _add_words_and_enrich и _suggest_words_for_topic вынесены в app/services/assistant_tools.py
# Импортированы выше как _add_words_and_enrich и _suggest_words_for_topic для обратной совместимости


@router.post("/assistant/suggest-words")
def suggest_words(payload: dict, session: Session = Depends(get_session)):
    """
    Генерирует список слов на заданную тему.
    Ожидает: {"topic": "Emotions", "count": 10}
    """
    topic = (payload.get("topic") or "").strip()
    count = int(payload.get("count") or 10)
    
    if not topic:
        return {"error": "Topic is required", "words": []}
    
    # Ограничиваем количество
    count = max(1, min(count, 50))
    
    # Проверяем существующие слова для исключения дубликатов
    existing_words = {w.text.strip().lower() for w in session.query(Word.text).all() if w and w.text}
    
    # Генерируем слова
    suggested_words = suggest_words_tool(topic, count)
    
    # Отмечаем какие слова уже есть в базе
    for word_data in suggested_words:
        word_text = word_data.get("text", "").strip().lower()
        word_data["already_exists"] = word_text in existing_words
    
    return {"words": suggested_words, "topic": topic, "count": len(suggested_words)}


@router.post("/assistant/approve-words")
def approve_words(
    payload: dict,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    """
    Добавляет одобренные слова в базу данных.
    Ожидает: {"words": ["word1", "word2", ...]}
    """
    words_list = payload.get("words", [])
    if not words_list or not isinstance(words_list, list):
        return {"error": "Words list is required", "added_count": 0}
    
    # Извлекаем только тексты слов из списка
    word_texts = []
    for item in words_list:
        if isinstance(item, str):
            word_texts.append(item)
        elif isinstance(item, dict):
            text = item.get("text") or item.get("word")
            if text:
                word_texts.append(str(text))
    
    if not word_texts:
        return {"error": "No valid words provided", "added_count": 0}
    
    # Используем инструмент для добавления
    from .services.assistant_tools import add_words_tool
    result = add_words_tool(session, word_texts, background_tasks)
    
    return {
        "added_count": result.get("added_count", 0),
        "created_ids": result.get("created_ids", []),
        "added_texts": result.get("added_texts", [])
    }


@router.post("/assistant/chat")
def assistant_chat(payload: dict, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    message = (payload or {}).get("message", "").strip()
    conversation_id = (payload or {}).get("conversation_id")
    if not message:
        return {"reply": "Введите запрос."}
    if not conversation_id:
        conv = Conversation()
        session.add(conv)
        session.flush()
        conversation_id = conv.id
        session.commit()

    session.add(Message(conversation_id=conversation_id, role="user", content=message))
    session.commit()

    total_words = session.query(func.count(Word.id)).scalar() or 0
    group_counts = (
        session.query(Word.group_name, func.count(Word.id).label("cnt"))
        .filter(Word.group_name.isnot(None))
        .group_by(Word.group_name)
        .order_by(func.count(Word.id).desc())
        .limit(20)
        .all()
    )

    kb = _fetch_kb_for_query(session, message, limit=30)
    stats = {
        "total_words": total_words,
        "top_groups": [(g, int(c)) for g, c in group_counts[:10]],
    }

    history = _fetch_conversation_history(session, conversation_id, limit=20)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        if total_words == 0:
            reply = "В словаре нет слов. Добавьте слова на странице Словарь."
        else:
            if kb:
                preview = "\n".join([f"- {it['text']} — {it.get('translation') or '—'}" for it in kb[:10]])
                reply = f"(OFFLINE) Нашёл по запросу:\n{preview}"
            else:
                top = "\n".join([f"- {g or '—'}: {c}" for g, c in group_counts[:5]]) or "(групп нет)"
                reply = f"(OFFLINE) В словаре {total_words} слов. Топ групп:\n{top}"
        session.add(Message(conversation_id=conversation_id, role="assistant", content=reply))
        session.commit()
        return {"reply": reply, "conversation_id": conversation_id}

    default_prompt = (
        "You are EngTutor assistant with access to the user's personal dictionary. "
        "Tasks: answer questions about the dictionary, create exercises, quizzes, and help memorize words. "
        "Use ONLY the provided dictionary data. If a requested word is missing and the user asks to add it/them, you MUST trigger a tool call. "
        "\n\n"
        "CRITICAL: Tool calling protocols - READ CAREFULLY:\n"
        "\n"
        "1. When user asks to GENERATE/SUGGEST/CREATE/INVENT words on a TOPIC (e.g., 'придумай 10 слов на тему Emotions'):\n"
        "   -> You MUST use TOOL:suggest_words (NEVER use add_words for this!)\n"
        "   -> Output as the VERY FIRST line: TOOL:suggest_words: {{\"topic\": \"Emotions\", \"count\": 10}}\n"
        "   -> Extract topic name and count from user request\n"
        "   -> After tool directive, output a blank line and explain that words are prepared for user approval\n"
        "   -> DO NOT use add_words for topic-based generation! Words must be shown to user first for selection.\n"
        "\n"
        "2. When user provides SPECIFIC WORD NAMES to add (e.g., 'добавь слова happy, sad'):\n"
        "   -> Use TOOL:add_words\n"
        "   -> Output as the VERY FIRST line: TOOL:add_words: [\\\"happy\\\", \\\"sad\\\"]\n"
        "   -> Extract words from user text (commas/semicolons/newlines)\n"
        "   -> Do not ask for confirmation\n"
        "\n"
        "CRITICAL RULE:\n"
        "- If the user's request contains phrases like 'на тему', 'про тему', 'по теме', 'topic', 'theme', "
        "AND asks to generate/create/invent/suggest words -> ALWAYS use TOOL:suggest_words\n"
        "- Only use TOOL:add_words when user explicitly provides word names to add\n"
        "\n"
        "Examples:\n"
        "User: 'придумай 10 слов на тему Emotions' -> TOOL:suggest_words: {{\"topic\": \"Emotions\", \"count\": 10}}\n"
        "User: 'сгенерируй слова про Travel' -> TOOL:suggest_words: {{\"topic\": \"Travel\", \"count\": 10}}\n"
        "User: 'добавь слова happy, sad' -> TOOL:add_words: [\\\"happy\\\", \\\"sad\\\"]"
    )
    db_prompt = session.query(Setting).filter(Setting.key == "assistant_prompt").first()
    system_prompt = (db_prompt.value if db_prompt and db_prompt.value else default_prompt)

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)

        messages = [{"role": "system", "content": system_prompt}]
        for m in history[-10:]:
            messages.append({"role": m["role"], "content": m["content"]})
        user_content = (
            "Вопрос пользователя: " + message + "\n\n"
            + "Статистика (JSON):\n" + json.dumps(stats, ensure_ascii=False) + "\n\n"
            + "Релевантные слова (JSON):\n" + json.dumps(kb, ensure_ascii=False)
        )
        messages.append({"role": "user", "content": user_content})

        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.4,
            max_tokens=700,
            timeout=20.0,
        )
        answer = resp.choices[0].message.content
        logging.info(f"Assistant response (first 200 chars): {answer[:200] if answer else 'None'}")
    except Exception:
        logging.exception("assistant_chat failed")
        preview = "\n".join([f"- {it['text']} — {it.get('translation') or '—'}" for it in kb[:8]]) or "(нет совпадений)"
        answer = f"Не удалось связаться с моделью. Вот подборка из словаря:\n{preview}"

    # Обработка инструментов через централизованную функцию
    answer, suggested_words_data = process_tool_directive(answer, session, background_tasks)

    session.add(Message(conversation_id=conversation_id, role="assistant", content=answer))
    session.commit()
    
    response = {"reply": answer, "conversation_id": conversation_id}
    if suggested_words_data:
        response["suggested_words"] = suggested_words_data
    
    return response


@router.get("/settings/assistant-prompt")
def get_assistant_prompt(session: Session = Depends(get_session)):
    row = session.query(Setting).filter(Setting.key == "assistant_prompt").first()
    value = row.value if row else ""
    return {"prompt": value}


@router.post("/settings/assistant-prompt")
def save_assistant_prompt(payload: dict, session: Session = Depends(get_session)):
    value = (payload or {}).get("prompt")
    if value is None:
        return {"ok": False, "error": "prompt is required"}
    row = session.query(Setting).filter(Setting.key == "assistant_prompt").first()
    if not row:
        row = Setting(key="assistant_prompt", value=str(value))
        session.add(row)
    else:
        row.value = str(value)
    session.commit()
    return {"ok": True}


