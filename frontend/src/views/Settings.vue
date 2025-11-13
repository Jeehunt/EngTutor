<template>
  <div class="min-h-screen bg-gray-100">
    <div class="w-full px-3 py-3">
      <!-- Заголовок -->
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-gray-900">Настройки</h1>
      </div>

      <!-- Действия -->
      <div class="bg-white rounded-xl shadow-lg mb-4">
        <div class="px-6 py-4 border-b-2 border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>⚙️</span>
            Настройки
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              @click="enrichMissing"
              :disabled="isEnriching"
              class="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">✨</span>
                <span class="font-semibold text-gray-900">
                  {{ isEnriching ? 'Автозаполнение...' : 'Автозаполнить пропущенные поля (OpenAI GPT-4)' }}
                </span>
              </div>
            </button>
            <button
              @click="rewriteAll"
              :disabled="isRewriting"
              class="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔄</span>
                <span class="font-semibold text-gray-900">
                  {{ isRewriting ? 'Перезапись...' : 'Перезаписать ВСЕ данные (OpenAI GPT-4)' }}
                </span>
              </div>
            </button>
            <button
              @click="reassignGroups"
              :disabled="isReassigning"
              class="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">🏷️</span>
                <span class="font-semibold text-gray-900">
                  {{ isReassigning ? 'Переназначение...' : 'Переназначить группы для всех слов (LLM)' }}
                </span>
              </div>
            </button>
            <button
              @click="enrichSynonymsAndAlt"
              :disabled="isEnrichingSynonyms"
              class="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">📚</span>
                <span class="font-semibold text-gray-900">
                  {{ isEnrichingSynonyms ? 'Обогащение...' : 'Сгенерировать синонимы и расширить переводы (LLM)' }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Промпт ассистента -->
      <div class="bg-white rounded-xl shadow-lg mb-4">
        <div class="px-6 py-4 border-b-2 border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🤖</span>
            Промпт ассистента
          </h3>
        </div>
        <div class="p-6">
          <div class="mb-2 text-sm text-gray-600">
            Эта подсказка отправляется как системное сообщение модели. Можно использовать любой текст. Сохранение вступает в силу сразу.
          </div>
          <textarea
            v-model="promptText"
            class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)] hover:border-gray-300"
            rows="8"
            placeholder="Введите системный промпт ассистента..."
          ></textarea>
          <div class="flex gap-2 mt-2">
            <button
              @click="savePrompt"
              :disabled="isSaving"
              class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button
              @click="loadPrompt"
              :disabled="isLoading"
              class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Загрузка...' : 'Обновить' }}
            </button>
          </div>
          <div v-if="promptStatus" class="mt-2 text-sm" :class="promptStatusType === 'success' ? 'text-green-600' : 'text-red-600'">
            {{ promptStatus }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAssistantPrompt, saveAssistantPrompt } from '../api/assistant.js'
import { reEnrichMissing, rewriteAllWords, reassignAllGroups, enrichSynonymsAndAltTranslations } from '../api/words.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const promptText = ref('')
const promptStatus = ref('')
const promptStatusType = ref('success')
const isSaving = ref(false)
const isLoading = ref(false)
const isEnriching = ref(false)
const isRewriting = ref(false)
const isReassigning = ref(false)
const isEnrichingSynonyms = ref(false)

// Загрузка промпта
const loadPrompt = async () => {
  isLoading.value = true
  promptStatus.value = ''
  try {
    const data = await getAssistantPrompt()
    promptText.value = data.prompt || ''
    promptStatus.value = 'Загружено.'
    promptStatusType.value = 'success'
  } catch (error) {
    console.error('Error loading prompt:', error)
    promptStatus.value = 'Не удалось загрузить промпт.'
    promptStatusType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

// Сохранение промпта
const savePrompt = async () => {
  isSaving.value = true
  promptStatus.value = ''
  try {
    const data = await saveAssistantPrompt(promptText.value)
    if (data && data.ok) {
      promptStatus.value = 'Сохранено.'
      promptStatusType.value = 'success'
    } else {
      promptStatus.value = 'Ошибка сохранения.'
      promptStatusType.value = 'error'
    }
  } catch (error) {
    console.error('Error saving prompt:', error)
    promptStatus.value = 'Не удалось сохранить промпт.'
    promptStatusType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

// Автозаполнение пропущенных полей
const enrichMissing = async () => {
  if (!confirm('Автозаполнить все пропущенные поля для существующих слов? Это может занять несколько минут.')) {
    return
  }

  isEnriching.value = true
  try {
    await reEnrichMissing()
    alert('Автозаполнение запущено. Процесс выполняется в фоновом режиме.')
  } catch (error) {
    console.error('Error enriching missing:', error)
    alert('Ошибка запуска автозаполнения')
  } finally {
    isEnriching.value = false
  }
}

// Перезапись всех данных
const rewriteAll = async () => {
  if (!confirm('ВНИМАНИЕ! Это действие перезапишет ВСЕ данные в словаре. Продолжить?')) {
    return
  }

  isRewriting.value = true
  try {
    await rewriteAllWords()
    alert('Перезапись запущена. Процесс выполняется в фоновом режиме.')
  } catch (error) {
    console.error('Error rewriting all:', error)
    alert('Ошибка запуска перезаписи')
  } finally {
    isRewriting.value = false
  }
}

// Переназначение групп для всех слов
const reassignGroups = async () => {
  if (!confirm('Переназначить группы для всех слов через LLM? Это может занять несколько минут.')) {
    return
  }

  isReassigning.value = true
  try {
    const result = await reassignAllGroups()
    alert(`Переназначение групп запущено для ${result.count || 0} слов. Процесс выполняется в фоновом режиме.`)
  } catch (error) {
    console.error('Error reassigning groups:', error)
    alert('Ошибка запуска переназначения групп')
  } finally {
    isReassigning.value = false
  }
}

// Генерация синонимов и расширение alt_translations
const enrichSynonymsAndAlt = async () => {
  if (!confirm('Сгенерировать синонимы (5-10 для каждого слова) и расширить альтернативные переводы до 10 для всех слов? Это может занять много времени.')) {
    return
  }

  isEnrichingSynonyms.value = true
  try {
    const result = await enrichSynonymsAndAltTranslations()
    alert(`Обогащение запущено для ${result.count || 0} слов. Процесс выполняется в фоновом режиме.`)
  } catch (error) {
    console.error('Error enriching synonyms:', error)
    alert('Ошибка запуска обогащения')
  } finally {
    isEnrichingSynonyms.value = false
  }
}

// Инициализация
onMounted(async () => {
  await loadPrompt()
})
</script>
