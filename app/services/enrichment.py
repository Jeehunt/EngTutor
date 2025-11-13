import os
import logging
import re
from typing import List, Optional, Dict, Any
import json
import time
from sqlalchemy.orm import Session
from app.models import Word, Group, WordRelation
from app.database import get_session

# OpenAI import
from openai import OpenAI
from openai import RateLimitError, APIError

PROMPT = """
You are a precise translation assistant for English-Russian vocabulary. Your task is to provide EXACT, LITERAL translations and ensure proper language structure.

CRITICAL RULES:
1. If input is RUSSIAN, first translate it to ENGLISH, then provide Russian translations
2. If input is ENGLISH, provide Russian translations directly
3. The "text" field should ALWAYS contain the ENGLISH word/phrase
4. "to sob" = "рыдать" (NOT "суета" or "плач")
5. "book" = "книга" (NOT "том" or "издание" unless specifically requested)
6. Always translate to the most common, direct meaning first
7. Be extremely precise with parts of speech

REQUIRED OUTPUT FORMAT (single JSON object):
{
  "text": "ENGLISH_WORD_OR_PHRASE",
  "main_translation": "MOST_ACCURATE_RUSSIAN_TRANSLATION",
  "alt_translations": ["ALTERNATIVE1", "ALTERNATIVE2", "ALTERNATIVE3", ...up to 10 alternatives],
  "tags": ["CEFR_LEVEL", "PART_OF_SPEECH", "TOPIC"],
  "group_name": "TOPIC_CATEGORY_IN_ENGLISH",
  "usage_example": "Simple English sentence using the word",
  "usage_example_translation": "Accurate Russian translation of the example"
}

EXAMPLES:
Input: "to sob" (English)
Output: {"text": "to sob", "main_translation": "рыдать", "alt_translations": ["всхлипывать", "плакать", "взрываться плачем", "рыдать", "причитать"], "tags": ["B1", "verb", "emotions"], "group_name": "Emotions", "usage_example": "She began to sob uncontrollably.", "usage_example_translation": "Она начала рыдать безудержно."}

Input: "книга" (Russian)
Output: {"text": "book", "main_translation": "книга", "alt_translations": ["том", "издание"], "tags": ["A1", "noun", "education"], "group_name": "Education", "usage_example": "I read an interesting book.", "usage_example_translation": "Я прочитал интересную книгу."}

Input: "красивый" (Russian)
Output: {"text": "beautiful", "main_translation": "красивый", "alt_translations": ["прекрасный", "очаровательный"], "tags": ["A2", "adjective", "appearance"], "group_name": "Appearance", "usage_example": "She is a beautiful woman.", "usage_example_translation": "Она красивая женщина."}

IMPORTANT: 
- Output ONLY the JSON object, no explanations, no markdown, no code fences
- The "text" field MUST contain the ENGLISH word/phrase
- If input was Russian, translate it to English first, then provide Russian translations
- Provide up to 10 alternative translations if available
"""

SYNONYMS_PROMPT = """
You are an English vocabulary assistant. Generate 5-10 synonyms for the given English word or phrase.

For each synonym, provide:
1. The English synonym word/phrase
2. Its Russian translation (most common, accurate translation)

Return ONLY a JSON object in this format:
{
  "synonyms": [
    {"word": "synonym1", "translation": "перевод1"},
    {"word": "synonym2", "translation": "перевод2"},
    ...
  ]
}

Rules:
- Provide 5-10 high-quality synonyms (common, frequently used words)
- Synonyms should be similar in meaning, not just related words
- Translations must be accurate and commonly used
- If the word has different meanings, focus on synonyms for the primary meaning
- Do NOT include the original word itself in the synonyms list
"""

def generate_synonyms_for_word(word_id: int, word_text: str, session: Session) -> None:
    """
    Генерирует синонимы для слова с помощью LLM и создает связи в базе данных.
    Создает двусторонние связи автоматически.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logging.warning("OPENAI_API_KEY is missing; synonym generation skipped")
        return
    
    # Проверяем, есть ли уже синонимы для этого слова
    existing_relations = session.query(WordRelation).filter(
        WordRelation.word_id == word_id,
        WordRelation.relation_type == "synonym"
    ).count()
    
    if existing_relations > 0:
        logging.info(f"Synonyms already exist for word '{word_text}' (ID: {word_id}), skipping generation")
        return
    
    try:
        client = OpenAI(api_key=api_key)
        
        prompt = f"{SYNONYMS_PROMPT}\n\nWord: {word_text}\n\nOutput:"
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Используем более дешевую модель для синонимов
            messages=[
                {"role": "system", "content": "You are a vocabulary assistant. Return strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.3,
            response_format={"type": "json_object"},
            timeout=15.0
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        synonyms_list = data.get("synonyms", [])
        if not synonyms_list or not isinstance(synonyms_list, list):
            logging.warning(f"No synonyms generated for '{word_text}'")
            return
        
        # Ограничиваем до 10 синонимов
        synonyms_list = synonyms_list[:10]
        
        created_count = 0
        for synonym_data in synonyms_list:
            if not isinstance(synonym_data, dict):
                continue
            
            synonym_word = (synonym_data.get("word") or "").strip()
            synonym_translation = (synonym_data.get("translation") or "").strip()
            
            if not synonym_word or not synonym_translation:
                continue
            
            # Проверяем, существует ли слово уже в словаре
            existing_word = session.query(Word).filter(
                Word.text.ilike(synonym_word)
            ).first()
            
            if existing_word:
                # Слово уже существует - используем его
                related_word_id = existing_word.id
            else:
                # Создаем новое слово с to_teach=False
                new_word = Word(
                    text=synonym_word,
                    main_translation=synonym_translation,
                    to_teach=False
                )
                session.add(new_word)
                session.flush()  # Получаем ID нового слова
                related_word_id = new_word.id
                logging.info(f"Created synonym word '{synonym_word}' with translation '{synonym_translation}'")
            
            # Проверяем, не существует ли уже такая связь
            existing_relation = session.query(WordRelation).filter(
                WordRelation.word_id == word_id,
                WordRelation.related_word_id == related_word_id,
                WordRelation.relation_type == "synonym"
            ).first()
            
            if existing_relation:
                continue  # Связь уже существует
            
            # Создаем двусторонние связи
            # Связь 1: word_id -> related_word_id
            relation1 = WordRelation(
                word_id=word_id,
                related_word_id=related_word_id,
                relation_type="synonym"
            )
            session.add(relation1)
            
            # Связь 2: related_word_id -> word_id (обратная)
            # Проверяем, не существует ли уже обратная связь
            reverse_relation = session.query(WordRelation).filter(
                WordRelation.word_id == related_word_id,
                WordRelation.related_word_id == word_id,
                WordRelation.relation_type == "synonym"
            ).first()
            
            if not reverse_relation:
                relation2 = WordRelation(
                    word_id=related_word_id,
                    related_word_id=word_id,
                    relation_type="synonym"
                )
                session.add(relation2)
            
            created_count += 1
        
        session.commit()
        logging.info(f"Generated {created_count} synonyms for word '{word_text}' (ID: {word_id})")
        
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse synonyms JSON for '{word_text}': {e}")
    except Exception as e:
        logging.error(f"Failed to generate synonyms for '{word_text}': {e}")
        session.rollback()

def _enrich_single_openai(word_id: int, text: str, force_overwrite: bool = False, max_retries: int = 3, session: Session = None) -> None:
    """Enrich a single word record with OpenAI API data"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logging.warning("OPENAI_API_KEY is missing; enrichment will be skipped")
        return

    # Use provided session or create new one
    should_close_session = session is None
    if session is None:
        session = next(get_session())

    for attempt in range(max_retries):
        try:
            client = OpenAI(api_key=api_key)
            
            # Detect if input is Russian
            is_russian = bool(re.search(r'[а-яё]', text.lower()))
            
            if is_russian:
                prompt = f"{PROMPT}\n\nInput: {text} (Russian word/phrase)\n\nOutput: single JSON object with English text field, no markdown, no code fences."
                logging.info(f"Processing Russian word '{text}' - will translate to English first")
            else:
                prompt = f"{PROMPT}\n\nInput: {text} (English word/phrase)\n\nOutput: single JSON object, no markdown, no code fences."
                logging.info(f"Processing English word '{text}'")
            
            logging.info(f"Starting OpenAI enrichment for word: {text} (ID: {word_id}, attempt {attempt + 1})")
            
            response = client.chat.completions.create(
                model="gpt-4o",  # Using GPT-4 which definitely exists
                messages=[
                    {"role": "system", "content": "You are a precise translation assistant. Respond with strict JSON only."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.1,
                response_format={"type": "json_object"}  # Force JSON response
            )
            
            content = response.choices[0].message.content
            logging.info(f"OpenAI response for '{text}': {content[:100]}...")
            
            try:
                data = json.loads(content)
                if not isinstance(data, dict):
                    raise ValueError("Response is not a dictionary")
                    
                # Validate required fields
                if not data.get("text") or not data.get("main_translation"):
                    logging.warning(f"Missing required fields in response for '{text}'")
                    return
                
                # Ensure the text field contains English
                english_text = data.get("text", "").strip()
                if not english_text or re.search(r'[а-яё]', english_text.lower()):
                    logging.warning(f"Text field should contain English, got: {english_text}")
                    return
                    
            except Exception as e:
                logging.error(f"OpenAI response parse error for '{text}': {e}")
                logging.error(f"Raw content: {content[:200]}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                return

            try:
                word = session.query(Word).filter(Word.id == word_id).first()
                if not word:
                    logging.error(f"Word with ID {word_id} not found")
                    return

                # Update the word text to English if it was Russian
                if is_russian:
                    word.text = english_text
                    logging.info(f"Updated Russian word '{text}' to English '{english_text}'")

                # Ограничиваем alt_translations до 10 элементов
                alt_translations = data.get("alt_translations")
                if alt_translations and isinstance(alt_translations, list):
                    alt_translations = alt_translations[:10]
                
                if force_overwrite:
                    # Force overwrite all fields
                    word.main_translation = data.get("main_translation")
                    word.alt_translations = alt_translations
                    word.tags = data.get("tags")
                    word.group_name = data.get("group_name")
                    word.usage_example = data.get("usage_example")
                    word.usage_example_translation = data.get("usage_example_translation")
                    logging.info(f"Force overwrote data for '{english_text}': {data.get('main_translation')}")
                else:
                    # Only update if field is empty
                    word.main_translation = data.get("main_translation") or word.main_translation
                    word.alt_translations = alt_translations or word.alt_translations
                    word.tags = data.get("tags") or word.tags
                    word.group_name = data.get("group_name") or word.group_name
                    word.usage_example = data.get("usage_example") or word.usage_example
                    word.usage_example_translation = data.get("usage_example_translation") or word.usage_example_translation
                    logging.info(f"Updated empty fields for '{english_text}': {data.get('main_translation')}")

                session.commit()
                logging.info(f"Successfully enriched word: {english_text}")
                
                # Генерируем синонимы после обогащения
                try:
                    generate_synonyms_for_word(word.id, english_text, session)
                except Exception as e:
                    logging.error(f"Failed to generate synonyms for '{english_text}': {e}")
                    # Не прерываем процесс, если генерация синонимов не удалась
                
                return  # Success, exit retry loop
                
            except Exception as e:
                session.rollback()
                logging.error(f"Database error while updating word {text}: {e}")
                return
                
        except RateLimitError as e:
            logging.warning(f"Rate limit hit for '{text}' (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                # Wait longer for rate limit errors
                wait_time = min(30, 2 ** (attempt + 3))  # 8, 16, 32 seconds
                logging.info(f"Waiting {wait_time} seconds before retry...")
                time.sleep(wait_time)
                continue
            else:
                logging.error(f"Rate limit exceeded for '{text}' after {max_retries} attempts")
                return
                
        except APIError as e:
            logging.error(f"OpenAI API error for '{text}' (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(5 * (attempt + 1))  # Progressive delay
                continue
            else:
                logging.error(f"OpenAI API failed for '{text}' after {max_retries} attempts")
                return
                
        except Exception as e:
            logging.error(f"Unexpected error for '{text}' (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            else:
                logging.error(f"Failed to enrich '{text}' after {max_retries} attempts")
                return
    
    # Close session if we created it
    if should_close_session:
        session.close()

def _enrich_single(word_id: int, text: str, force_overwrite: bool = False) -> None:
    """Main enrichment function - now uses OpenAI by default"""
    return _enrich_single_openai(word_id, text, force_overwrite)

def enrich_and_update_word_records(word_ids: List[int], words_list: List[str], force_overwrite: bool = False) -> None:
    """Enrich and update word records with OpenAI API data"""
    if not word_ids or not words_list:
        return
    
    # OpenAI has much higher rate limits, so we can process more words at once
    chunk_size = 2  # Smaller chunks to further avoid rate limits
    total_chunks = (len(word_ids) + chunk_size - 1) // chunk_size
    
    for i in range(0, len(word_ids), chunk_size):
        chunk_ids = word_ids[i:i + chunk_size]
        chunk_words = words_list[i:i + chunk_size]
        chunk_num = (i // chunk_size) + 1
        
        logging.info(f"Processing chunk {chunk_num}/{total_chunks} ({len(chunk_ids)} words)")
        
        for word_id, word_text in zip(chunk_ids, chunk_words):
            try:
                _enrich_single(word_id, word_text, force_overwrite)
                # OpenAI has higher rate limits, but we'll be conservative
                time.sleep(3)  # 3 seconds between requests to avoid rate limits
            except Exception as e:
                logging.error(f"Failed to enrich word {word_text} (ID: {word_id}): {e}")
                continue
        
        # Longer delay between chunks to be safe
        if i + chunk_size < len(word_ids):
            logging.info(f"Waiting 15 seconds before next chunk...")
            time.sleep(15)
    
    logging.info("Enrichment completed for all words")


def get_suitable_group_for_word(text: str, available_groups: List[Group], session: Session) -> Optional[Group]:
    """Определяет подходящую группу для слова с помощью LLM."""
    if not available_groups:
        return None
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logging.warning("OPENAI_API_KEY is missing; using random group")
        import random
        return random.choice(available_groups) if available_groups else None
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        # Формируем список доступных групп
        group_names = [g.name for g in available_groups]
        groups_list = ", ".join(group_names)
        
        # Определяем язык слова
        is_russian = bool(re.search(r'[а-яё]', text.lower()))
        
        prompt = f"""You are a vocabulary categorization assistant. Given an English word or phrase, assign it to the most appropriate category from the provided list.

Available categories: {groups_list}

Return ONLY the category name (exact match from the list), nothing else.

Word/phrase: {text}
Category:"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a categorization assistant. Return only the category name, nothing else."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.1,
            timeout=10.0
        )
        
        suggested_group = response.choices[0].message.content.strip()
        
        # Ищем точное совпадение
        for group in available_groups:
            if group.name.lower() == suggested_group.lower():
                return group
        
        # Если точного совпадения нет, ищем похожие
        suggested_lower = suggested_group.lower()
        for group in available_groups:
            if suggested_lower in group.name.lower() or group.name.lower() in suggested_lower:
                return group
        
        # Если ничего не нашли, возвращаем случайную группу или "Abstract"
        abstract_group = next((g for g in available_groups if g.name == "Abstract"), None)
        if abstract_group:
            return abstract_group
        
        import random
        return random.choice(available_groups) if available_groups else None
        
    except Exception as e:
        logging.error(f"Error in get_suitable_group_for_word for '{text}': {e}")
        import random
        return random.choice(available_groups) if available_groups else None
