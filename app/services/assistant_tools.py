"""
Инструменты ассистента для обработки запросов пользователя.

Все tools, которые ассистент может использовать через директивы TOOL:xxx,
вынесены в этот модуль для более прозрачного обслуживания.
"""
import os
import json
import logging
import re
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import BackgroundTasks

from app.models import Word, Group, WordRelation
from app.services.enrichment import enrich_and_update_word_records, get_suitable_group_for_word


def add_words_tool(session: Session, inputs: List[str], background_tasks: BackgroundTasks = None) -> dict:
    """
    Инструмент для добавления слов в словарь.
    Используется через TOOL:add_words: ["word1", "word2", ...]
    
    Args:
        session: SQLAlchemy session
        inputs: Список слов для добавления
        background_tasks: FastAPI BackgroundTasks для асинхронного обогащения
        
    Returns:
        dict: {"added_count": int, "created_ids": List[int], "added_texts": List[str]}
    """
    normalized: List[str] = []
    for item in inputs or []:
        if not item:
            continue
        parts = re.split(r"[\n\r,;]+", str(item))
        for p in parts:
            p = (p or "").strip()
            if not p:
                continue
            normalized.append(p[:255])

    if not normalized:
        return {"added_count": 0, "created_ids": [], "added_texts": []}

    existing = {w.text.strip().lower() for w in session.query(Word.text).all() if w and w.text}
    seen_batch: set = set()
    to_add: List[str] = []
    for t in normalized:
        key = t.strip().lower()
        if not key or key in existing or key in seen_batch:
            continue
        to_add.append(t)
        seen_batch.add(key)

    if not to_add:
        return {"added_count": 0, "created_ids": [], "added_texts": []}

    created_ids: List[int] = []
    # Получаем доступные группы для назначения
    available_groups = session.query(Group).all()
    
    for text in to_add:
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

    session.commit()

    if created_ids and background_tasks:
        background_tasks.add_task(enrich_and_update_word_records, created_ids, to_add)

    return {"added_count": len(created_ids), "created_ids": created_ids, "added_texts": to_add}


def suggest_words_tool(topic: str, count: int = 10) -> List[Dict]:
    """
    Инструмент для генерации списка слов на заданную тему.
    Используется через TOOL:suggest_words: {"topic": "Emotions", "count": 10}
    
    Args:
        topic: Тема для генерации слов
        count: Количество слов для генерации (по умолчанию 10)
        
    Returns:
        List[Dict]: Список словарей с полями: text, translation_hint, level_hint
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return []
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        prompt = f"""You are an English vocabulary assistant. Generate {count} English words or phrases related to the topic "{topic}".

For each word, provide:
1. The English word/phrase (most common, useful word)
2. A brief Russian translation hint (one word or short phrase)
3. Suggested CEFR level (A1, A2, B1, B2, C1, or C2)

Return ONLY a JSON object in this format:
{{
  "words": [
    {{"text": "word1", "translation_hint": "перевод1", "level_hint": "B1"}},
    {{"text": "word2", "translation_hint": "перевод2", "level_hint": "A2"}},
    ...
  ]
}}

Rules:
- Provide exactly {count} words
- Words should be diverse and useful for learning
- Include different parts of speech (nouns, verbs, adjectives, etc.)
- Levels should be appropriate for the topic
- Translation hints should be accurate but brief

Topic: {topic}
Count: {count}
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a vocabulary assistant. Return strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7,
            response_format={"type": "json_object"},
            timeout=15.0
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        words_list = data.get("words", [])
        if not isinstance(words_list, list):
            return []
        
        # Ограничиваем до запрошенного количества и валидируем
        result = []
        for word_data in words_list[:count]:
            if isinstance(word_data, dict):
                text = word_data.get("text", "").strip()
                translation_hint = word_data.get("translation_hint", "").strip()
                level_hint = word_data.get("level_hint", "").strip()
                
                if text:
                    result.append({
                        "text": text,
                        "translation_hint": translation_hint or "",
                        "level_hint": level_hint or ""
                    })
        
        return result
        
    except Exception as e:
        logging.error(f"Error generating words for topic '{topic}': {e}")
        return []


def process_tool_directive(
    answer: str,
    session: Session,
    background_tasks: BackgroundTasks = None
) -> Tuple[str, Optional[Dict]]:
    """
    Обрабатывает директивы инструментов в ответе ассистента.
    
    Args:
        answer: Ответ ассистента, который может содержать директивы TOOL:xxx
        session: SQLAlchemy session
        background_tasks: FastAPI BackgroundTasks
        
    Returns:
        tuple: (очищенный ответ, данные suggested_words или None)
    """
    suggested_words_data = None
    
    # 1. Проверяем suggest_words (приоритет выше)
    try:
        # Более гибкий паттерн для поиска JSON объекта
        m = re.match(r"^\s*TOOL:suggest_words:\s*(\{.*?\})\s*(?:\r?\n\r?\n|\r?\n|$)", answer or "", flags=re.DOTALL | re.MULTILINE)
        if not m:
            # Пробуем найти в любом месте ответа (на случай если форматирование не идеальное)
            m = re.search(r"TOOL:suggest_words:\s*(\{.*?\})", answer or "", flags=re.DOTALL)
        if m:
            json_str = m.group(1)
            tool_data = json.loads(json_str)
            topic = tool_data.get("topic") or tool_data.get("topic_name") or tool_data.get("theme") or ""
            count = int(tool_data.get("count") or tool_data.get("number") or tool_data.get("amount") or 10)
            
            logging.info(f"Found TOOL:suggest_words: topic={topic}, count={count}")
            
            if topic:
                suggested_words = suggest_words_tool(topic, count)
                # Отмечаем существующие слова
                existing_words = {w.text.strip().lower() for w in session.query(Word.text).all() if w and w.text}
                for word_data in suggested_words:
                    word_text = word_data.get("text", "").strip().lower()
                    word_data["already_exists"] = word_text in existing_words
                
                suggested_words_data = {
                    "topic": topic,
                    "words": suggested_words
                }
                # Убираем директиву из ответа
                answer = (answer or "")[m.end():].strip()
                if not answer:
                    answer = f"Я подготовил {len(suggested_words)} слов на тему '{topic}'. Выберите слова для добавления в словарь."
                logging.info(f"Generated {len(suggested_words)} words for topic '{topic}'")
    except Exception as e:
        logging.exception("Failed to process TOOL:suggest_words directive")
    
    # 2. Проверяем add_words только если suggest_words не был использован
    if not suggested_words_data:
        try:
            m = re.match(r"^\s*TOOL:add_words:\s*(\[.*?\])\s*(?:\r?\n\r?\n|\r?\n)?", answer or "", flags=re.DOTALL)
            if m:
                arr_str = m.group(1)
                words_from_tool = json.loads(arr_str)
                if isinstance(words_from_tool, list):
                    logging.info(f"Found TOOL:add_words: {len(words_from_tool)} words")
                    _ = add_words_tool(session, [str(x) for x in words_from_tool if isinstance(x, (str, int, float))], background_tasks)
                    answer = (answer or "")[m.end():].strip()
                    if not answer:
                        answer = "Добавил слова. Запускаю обогащение."
        except Exception:
            logging.exception("Failed to process TOOL:add_words directive")
    
    # Гарантируем что answer всегда str
    if answer is None:
        answer = ""
    return str(answer), suggested_words_data

