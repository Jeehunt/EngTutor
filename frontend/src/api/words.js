import client from './client.js'

// GET /words - получить список слов с пагинацией
export const getWords = async (params = {}) => {
  const response = await client.get('/words', {
    params,
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /words/add - добавить слова
export const addWords = async (words) => {
  const response = await client.post('/words/add', {
    words,
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// POST /words/{word_id}/delete - удалить слово
export const deleteWord = async (wordId) => {
  const response = await client.post(`/words/${wordId}/delete`, {}, {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /words/bulk-delete - массовое удаление слов
export const bulkDeleteWords = async (wordIds) => {
  const response = await client.post('/words/bulk-delete', {
    word_ids: wordIds,
  }, {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /words/{word_id}/edit - редактировать слово
export const editWord = async (wordId, data) => {
  const response = await client.post(`/words/${wordId}/edit`, data, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// GET /words/{word_id}/tooltip - получить подсказку для слова
export const getWordTooltip = async (wordId) => {
  const response = await client.get(`/words/${wordId}/tooltip`)
  return response.data
}

// POST /words/{word_id}/examples - сгенерировать примеры
export const generateExamples = async (wordId) => {
  const response = await client.post(`/words/${wordId}/examples`)
  return response.data
}

// POST /words/re-enrich - обогатить слова без переводов
export const reEnrichMissing = async () => {
  const response = await client.post('/words/re-enrich', {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// POST /words/rewrite-all - перезаписать все слова
export const rewriteAllWords = async () => {
  const response = await client.post('/words/rewrite-all', {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// POST /words/reassign-groups - переназначить группы для всех слов через LLM
export const reassignAllGroups = async () => {
  const response = await client.post('/words/reassign-groups', {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// GET /groups - получить список всех групп
export const getGroups = async () => {
  const response = await client.get('/groups', {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data.groups || []
}

// POST /groups/init-defaults - инициализировать недостающие группы
export const initDefaultGroups = async () => {
  const response = await client.post('/groups/init-defaults', {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// POST /groups/consolidate - объединить похожие группы и переназначить слова
export const consolidateGroups = async () => {
  const response = await client.post('/groups/consolidate', {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// POST /words/enrich-synonyms-and-alt-translations - разовое заполнение синонимов и расширение alt_translations
export const enrichSynonymsAndAltTranslations = async () => {
  const response = await client.post('/words/enrich-synonyms-and-alt-translations', {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

