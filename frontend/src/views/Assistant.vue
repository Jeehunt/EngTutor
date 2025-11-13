<template>
  <div class="min-h-screen bg-gray-100 assistant-page">
    <div ref="chatContainer" class="chat-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.role === 'user' ? 'user' : 'assistant']"
      >
        <div class="avatar">
          {{ msg.role === 'user' ? 'Вы' : 'AI' }}
        </div>
        <div class="bubble" v-html="formatBB(msg.content)"></div>
      </div>
      
      <!-- Индикатор печати -->
      <div v-if="isTyping" class="message assistant typing">
        <div class="avatar">AI</div>
        <div class="bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
      
      <!-- Компонент выбора слов для добавления -->
      <div v-if="suggestedWords && suggestedWords.words && suggestedWords.words.length > 0" class="message assistant suggested-words">
        <div class="avatar">AI</div>
        <div class="bubble suggested-words-bubble">
          <div class="suggested-words-header">
            <strong>Предложенные слова на тему "{{ suggestedWords.topic }}"</strong>
            <div class="text-sm text-gray-600 mt-1 mb-3">
              Выберите слова для добавления в словарь
            </div>
          </div>
          <div class="suggested-words-list">
            <label
              v-for="(word, index) in suggestedWords.words"
              :key="index"
              :class="[
                'suggested-word-item',
                word.already_exists ? 'already-exists' : '',
                selectedWords.includes(word.text) ? 'selected' : ''
              ]"
            >
              <input
                type="checkbox"
                :value="word.text"
                v-model="selectedWords"
                :disabled="word.already_exists"
                class="word-checkbox"
              />
              <div class="word-info">
                <span class="word-text">{{ word.text }}</span>
                <span v-if="word.translation_hint" class="word-hint">{{ word.translation_hint }}</span>
                <span v-if="word.level_hint" class="word-level">{{ word.level_hint }}</span>
                <span v-if="word.already_exists" class="word-exists-badge">(уже есть)</span>
              </div>
            </label>
          </div>
          <div class="suggested-words-actions">
            <button
              @click="selectAllWords"
              class="action-btn select-all"
              :disabled="isAddingWords"
            >
              Выбрать все
            </button>
            <button
              @click="deselectAllWords"
              class="action-btn deselect-all"
              :disabled="isAddingWords"
            >
              Снять все
            </button>
            <button
              @click="addSelectedWords"
              class="action-btn add-words"
              :disabled="selectedWords.length === 0 || isAddingWords"
            >
              {{ isAddingWords ? 'Добавление...' : `Добавить (${selectedWords.length})` }}
            </button>
            <button
              @click="dismissSuggestedWords"
              class="action-btn cancel"
              :disabled="isAddingWords"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="chat-form chat-fixed">
      <div class="chat-input-row">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          @keydown="handleKeyDown"
          @input="autosizeTextarea"
          class="chat-input"
          rows="1"
          placeholder="Напишите сообщение… (Shift+Enter — перенос строки)"
          required
        ></textarea>
        <button class="send-btn" type="submit" title="Отправить">➤</button>
      </div>
      <div class="chat-actions mt-2">
        <button
          type="button"
          @click="resetConversation"
          class="px-3 py-1.5 text-sm bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-100"
        >
          Новая беседа
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { startConversation, sendChatMessage, approveWords } from '../api/assistant.js'

const chatContainer = ref(null)
const textareaRef = ref(null)
const inputText = ref('')
const messages = ref([])
const conversationId = ref(null)
const isTyping = ref(false)
const suggestedWords = ref(null)
const selectedWords = ref([])
const isAddingWords = ref(false)
let resizeTimer = null

// Форматирование BB-кодов
const formatBB = (text) => {
  if (!text) return ''
  // Escape HTML first
  let s = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Bold variations
  s = s.replace(/__([\s\S]*?)__/g, '<strong>$1</strong>')
  s = s.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
  // Italic variations
  s = s.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
  s = s.replace(/_([\s\S]*?)_/g, '<em>$1</em>')
  s = s.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>')
  // New lines
  s = s.replace(/\r?\n/g, '<br/>')
  return s
}

// Добавление сообщения
const addMessage = (role, content) => {
  messages.value.push({ role, content })
  nextTick(() => {
    scrollToBottom()
  })
}

// Прокрутка вниз
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Показать индикатор печати
const showTyping = () => {
  isTyping.value = true
  nextTick(() => {
    scrollToBottom()
  })
}

// Скрыть индикатор печати
const hideTyping = () => {
  isTyping.value = false
}

// Начать новую беседу
const startNewConversation = async () => {
  try {
    const data = await startConversation()
    conversationId.value = data.conversation_id || null
  } catch (error) {
    console.error('Error starting conversation:', error)
  }
}

// Сброс беседы
const resetConversation = async () => {
  messages.value = []
  conversationId.value = null
  await startNewConversation()
  resizeChat()
}

// Отправка сообщения
const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text) return

  addMessage('user', text)
  inputText.value = ''
  autosizeTextarea()

  try {
    // Авто-старт беседы, если нужно
    if (!conversationId.value) {
      await startNewConversation()
    }

    showTyping()

    const data = await sendChatMessage(text, conversationId.value)

    if (data.conversation_id) {
      conversationId.value = data.conversation_id
    }

    hideTyping()
    addMessage('assistant', data.reply || '')
    
    // Обрабатываем предложенные слова
    if (data.suggested_words) {
      suggestedWords.value = data.suggested_words
      selectedWords.value = []
    } else {
      suggestedWords.value = null
      selectedWords.value = []
    }
    
    resizeChat()
  } catch (error) {
    hideTyping()
    console.error('Error sending message:', error)
    addMessage('assistant', error.response?.status ? `Ошибка: ${error.response.status}` : 'Сетевая ошибка')
  }
}

// Авто-увеличение textarea
const autosizeTextarea = () => {
  if (!textareaRef.value) return
  textareaRef.value.style.height = '0px'
  const next = Math.min(textareaRef.value.scrollHeight, 200)
  textareaRef.value.style.height = next + 'px'
  resizeChat()
}

// Обработка клавиатуры
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Расчет высоты чата
const resizeChat = () => {
  try {
    const form = document.querySelector('.chat-fixed')
    const headerEl = document.querySelector('header')
    const headerH = headerEl ? headerEl.offsetHeight : 0
    const formH = form ? form.offsetHeight : 0
    const padding = 16
    const available = Math.max(200, window.innerHeight - headerH - formH - padding)
    if (chatContainer.value) {
      chatContainer.value.style.height = available + 'px'
      chatContainer.value.style.overflowY = 'auto'
    }
  } catch (e) {
    console.error('Error resizing chat:', e)
  }
}

// Обработчик изменения размера окна
const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resizeChat, 100)
}

// Инициализация
onMounted(async () => {
  await startNewConversation()
  resizeChat()
  window.addEventListener('resize', handleResize)
  if (textareaRef.value) {
    autosizeTextarea()
  }
})

// Работа с предложенными словами
const selectAllWords = () => {
  if (!suggestedWords.value || !suggestedWords.value.words) return
  selectedWords.value = suggestedWords.value.words
    .filter(w => !w.already_exists)
    .map(w => w.text)
}

const deselectAllWords = () => {
  selectedWords.value = []
}

const addSelectedWords = async () => {
  if (selectedWords.value.length === 0) return
  
  isAddingWords.value = true
  try {
    const result = await approveWords(selectedWords.value)
    addMessage('assistant', `Добавлено ${result.added_count || 0} слов. Обогащение запущено в фоновом режиме.`)
    suggestedWords.value = null
    selectedWords.value = []
    resizeChat()
  } catch (error) {
    console.error('Error adding words:', error)
    addMessage('assistant', 'Ошибка при добавлении слов')
  } finally {
    isAddingWords.value = false
  }
}

const dismissSuggestedWords = () => {
  suggestedWords.value = null
  selectedWords.value = []
  resizeChat()
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
})
</script>

<style scoped>
.assistant-page {
  position: relative;
  min-height: 100vh;
  padding-bottom: 120px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 12px 12px;
  min-height: calc(100vh - 200px);
  max-height: none;
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: fadeIn 0.2s ease-out;
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  user-select: none;
}

.message.assistant .avatar {
  background: #e9ecef;
  color: #212529;
  border: 1px solid #dee2e6;
}

.message.user .avatar {
  background: #212529;
  color: #ffffff;
}

.bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  line-height: 1.5;
  font-size: 0.975rem;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.message.assistant .bubble {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #212529;
}

.message.user .bubble {
  background: #1a1a1a;
  color: #ffffff;
}

.message.typing .bubble {
  display: flex;
  gap: 6px;
  align-items: center;
}

.typing-dot {
  width: 6px;
  height: 6px;
  background: #adb5bd;
  border-radius: 50%;
  opacity: 0.7;
  animation: typingBlink 1.2s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

.suggested-words-bubble {
  max-width: 600px;
  padding: 16px;
}

.suggested-words-header {
  margin-bottom: 12px;
}

.suggested-words-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 12px;
  background: #f9fafb;
}

.suggested-word-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggested-word-item:hover:not(.already-exists) {
  border-color: #3b82f6;
  background: #eff6ff;
}

.suggested-word-item.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}

.suggested-word-item.already-exists {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.word-checkbox {
  margin-right: 12px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.word-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.word-text {
  font-weight: 600;
  color: #1f2937;
  font-size: 15px;
}

.word-hint {
  color: #6b7280;
  font-size: 14px;
  font-style: italic;
}

.word-level {
  padding: 2px 8px;
  background: #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.word-exists-badge {
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
}

.suggested-words-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.select-all {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.action-btn.select-all:hover:not(:disabled) {
  background: #e5e7eb;
}

.action-btn.deselect-all {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.action-btn.deselect-all:hover:not(:disabled) {
  background: #e5e7eb;
}

.action-btn.add-words {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.action-btn.add-words:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn.cancel {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
}

.action-btn.cancel:hover:not(:disabled) {
  background: #e5e7eb;
}

@keyframes typingBlink {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-form {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 10px 0;
  background: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(8px);
}

.chat-fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(8px);
}

.chat-input-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 0.975rem;
  font-family: inherit;
  resize: none;
  overflow-y: auto;
  max-height: 200px;
  transition: all 0.2s ease;
  background: #ffffff;
}

.chat-input:focus {
  outline: none;
  border-color: #495057;
  box-shadow: 0 0 0 3px rgba(73, 80, 87, 0.1);
}

.send-btn {
  flex: 0 0 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: #212529;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover {
  background: #495057;
  transform: translateY(-1px);
}

.send-btn:active {
  transform: translateY(0);
}

.chat-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .bubble {
    max-width: 85%;
  }
}
</style>
