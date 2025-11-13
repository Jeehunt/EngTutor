import client from './client.js'

// GET /assistant - получить страницу ассистента
export const getAssistantPage = async () => {
  const response = await client.get('/assistant')
  return response.data
}

// POST /assistant/start - начать новую беседу
export const startConversation = async () => {
  const response = await client.post('/assistant/start')
  return response.data
}

// POST /assistant/chat - отправить сообщение
export const sendChatMessage = async (message, conversationId) => {
  const response = await client.post('/assistant/chat', {
    message,
    conversation_id: conversationId,
  })
  return response.data
}

// GET /settings/assistant-prompt - получить промпт ассистента
export const getAssistantPrompt = async () => {
  const response = await client.get('/settings/assistant-prompt')
  return response.data
}

// POST /settings/assistant-prompt - сохранить промпт ассистента
export const saveAssistantPrompt = async (prompt) => {
  const response = await client.post('/settings/assistant-prompt', {
    prompt,
  })
  return response.data
}

// POST /assistant/suggest-words - сгенерировать слова на тему
export const suggestWords = async (topic, count = 10) => {
  const response = await client.post('/assistant/suggest-words', {
    topic,
    count,
  })
  return response.data
}

// POST /assistant/approve-words - добавить одобренные слова
export const approveWords = async (words) => {
  const response = await client.post('/assistant/approve-words', {
    words,
  })
  return response.data
}

