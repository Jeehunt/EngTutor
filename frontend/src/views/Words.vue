<template>
  <div class="min-h-screen bg-gray-100 w-full">
    <div class="w-full py-2 px-2">
      <!-- Заголовок -->
      <div class="mb-4 px-1">
        <h1 class="text-2xl font-bold text-gray-900">Словарь</h1>
      </div>

      <!-- Две колонки: добавление и поиск -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 px-1">
        <!-- Форма добавления слов -->
        <div class="bg-white rounded-xl shadow-lg border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="p-3">
            <form @submit.prevent="handleAddWords" class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-1.5">
                  Слова или фразы:
                </label>
                <textarea
                  v-model="addWordsText"
                  rows="4"
                  class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)] hover:border-gray-300"
                  style="height: 70px;"
                  placeholder="Введите слова или фразы через запятую или с новой строки. Например:&#10;hello, world&#10;beautiful&#10;to study"
                  required
                ></textarea>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  :disabled="isAdding"
                  class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)] disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <span v-if="!isAdding">Добавить</span>
                  <span v-else class="flex items-center gap-2">
                    <span class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Добавление...
                  </span>
                </button>
                <button
                  type="button"
                  @click="addWordsText = ''"
                  class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
                >
                  Очистить
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Поиск и фильтрация -->
        <div class="bg-white rounded-xl shadow-lg border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="p-3">
            <form @submit.prevent="handleSearch" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-900 mb-1.5">
                    Поиск:
                  </label>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)] hover:border-gray-300"
                    placeholder="Поиск по слову, переводу, тегам или группе..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-1.5">
                    Фильтр:
                  </label>
                  <select
                    v-model="filterType"
                    class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)] hover:border-gray-300"
                  >
                    <option value="">Все поля</option>
                    <option value="word">Только слова</option>
                    <option value="translation">Только переводы</option>
                    <option value="tags">Только теги</option>
                    <option value="group">Только группы</option>
                  </select>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)]"
                >
                  <span>🔍</span>
                  Найти
                </button>
                <button
                  type="button"
                  @click="resetSearch"
                  class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5"
                >
                  ↻
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Пагинация и настройки -->
      <div class="flex justify-between items-center gap-2.5 my-2 px-1">
        <!-- Массовые действия -->
        <div v-if="selectedWords.length > 0" class="flex items-center gap-2">
          <span class="text-sm font-semibold text-gray-700">
            Выбрано: {{ selectedWords.length }}
          </span>
          <button
            @click="handleBulkDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Удалить выбранные ({{ selectedWords.length }})
          </button>
          <button
            @click="selectedWords = []; selectAll = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-gray-300"
          >
            Снять выбор
          </button>
        </div>
        <div v-else></div>
        
        <div class="flex justify-end items-center gap-2.5">
          <span class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold text-gray-900">
            {{ pagination.total_words }} слов
          </span>
        <select
          v-model="perPage"
          @change="handlePerPageChange"
          class="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 min-w-[84px]"
        >
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="200">200</option>
          <option :value="500">500</option>
        </select>
        <span class="text-sm text-gray-600 font-medium">
          Страница {{ pagination.page }} из {{ pagination.total_pages }}
        </span>
        </div>
      </div>

      <!-- Таблица слов -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-4 w-full">
        <div class="overflow-x-auto" style="padding-right: 8px;">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-2 py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100" style="width: 40px;">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="handleSelectAll"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    title="Выбрать все"
                  />
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100">
                  <a @click="handleSort('id')" class="cursor-pointer hover:border-b hover:border-dashed hover:border-gray-900 text-inherit no-underline">
                    # {{ sortField === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}
                  </a>
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100" style="max-width: 224px; width: 1%;">
                  <a @click="handleSort('text')" class="cursor-pointer hover:border-b hover:border-dashed hover:border-gray-900 text-inherit no-underline">
                    Слово/фраза {{ sortField === 'text' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}
                  </a>
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-100" style="max-width: 280px; width: 1%;">
                  Переводы
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100">
                  Теги
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-100" style="max-width: 160px; width: 1%;">
                  <a @click="handleSort('group')" class="cursor-pointer hover:border-b hover:border-dashed hover:border-gray-900 text-inherit no-underline">
                    Группа {{ sortField === 'group' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}
                  </a>
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100">
                  Пример использования
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100">
                  Перевод примера
                </th>
                <th class="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-100">
                  <a @click="handleSort('uses')" class="cursor-pointer hover:border-b hover:border-dashed hover:border-gray-900 text-inherit no-underline">
                    Использований {{ sortField === 'uses' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}
                  </a>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-50">
              <tr
                v-for="word in words"
                :key="word.id"
                @mouseenter="handleRowHover($event, word)"
                @mouseleave="handleRowLeave"
                :class="[
                  'transition-all duration-200 hover:bg-gray-50/50',
                  selectedWords.includes(word.id) ? 'bg-blue-50' : ''
                ]"
              >
                <td class="px-2 py-2 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    :value="word.id"
                    v-model="selectedWords"
                    @change="handleWordSelect"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td class="px-2 py-2 text-center text-sm text-gray-500 whitespace-nowrap">
                  {{ word.id }}
                </td>
                <td class="px-2 py-2 text-sm truncate" style="max-width: 224px;">
                  <a
                    @click.prevent="showWordTooltip($event, word)"
                    class="text-blue-600 hover:text-blue-800 cursor-pointer border-b border-dashed border-transparent hover:border-blue-500 font-semibold"
                    :title="word.text"
                  >
                    {{ word.text }}
                  </a>
                </td>
                <td class="px-2 py-2 text-sm truncate" :title="getTranslationsTooltip(word)" style="max-width: 280px;">
                  <span v-if="word.main_translation">
                    <strong>{{ word.main_translation }}</strong>
                  </span>
                  <span v-else class="text-gray-400 italic">—</span>
                  <span v-if="word.alt_translations && word.alt_translations.length > 0">
                    — {{ word.alt_translations.slice(0, 3).join(', ') }}
                    <span v-if="word.alt_translations.length > 3" class="text-gray-500">
                      , +{{ word.alt_translations.length - 3 }}
                    </span>
                  </span>
                </td>
                <td class="px-2 py-2 text-sm">
                  <div v-if="word.tags && word.tags.length > 0" class="flex flex-nowrap gap-1 items-center overflow-hidden">
                    <span
                      v-for="tag in getLevelTags(word.tags)"
                      :key="tag"
                      class="px-2 py-1 bg-gray-100 text-gray-900 text-xs rounded-lg font-semibold whitespace-nowrap flex-shrink-0"
                    >
                      {{ formatTag(tag) }}
                    </span>
                    <span
                      v-if="getOtherTags(word.tags).length > 0"
                      class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-semibold cursor-help whitespace-nowrap flex-shrink-0 relative group"
                      :title="getOtherTagsTooltip(word.tags)"
                    >
                      +{{ getOtherTags(word.tags).length }}
                      <span
                        v-if="getOtherTags(word.tags).length > 0"
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none"
                      >
                        {{ getOtherTagsTooltip(word.tags) }}
                        <span class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></span>
                      </span>
                    </span>
                  </div>
                  <span v-else class="text-gray-400 italic">—</span>
                </td>
                <td class="px-2 py-2 text-sm truncate" :title="word.group_name || '—'" style="max-width: 160px;">
                  {{ word.group_name || '—' }}
                </td>
                <td class="px-2 py-2 text-sm whitespace-nowrap">
                  <span v-if="word.usage_example" class="text-gray-600 italic text-sm">
                    {{ word.usage_example.length > 50 ? word.usage_example.substring(0, 50) + '...' : word.usage_example }}
                  </span>
                  <span v-else class="text-gray-400 italic">—</span>
                </td>
                <td class="px-2 py-2 text-sm whitespace-nowrap">
                  <span v-if="word.usage_example_translation" class="text-gray-600 italic text-sm">
                    {{ word.usage_example_translation.length > 50 ? word.usage_example_translation.substring(0, 50) + '...' : word.usage_example_translation }}
                  </span>
                  <span v-else class="text-gray-400 italic">—</span>
                </td>
                <td class="px-2 py-2 text-center text-sm whitespace-nowrap">
                  <span class="px-2 py-1 bg-gray-900 text-white rounded-md text-xs font-semibold">
                    {{ word.uses_count || 0 }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Пустое состояние -->
        <div v-if="words.length === 0" class="p-12 text-center text-gray-500">
          <div class="text-6xl mb-4 opacity-50">📚</div>
          <h4 class="text-gray-900 font-semibold mb-2">Слов не найдено</h4>
          <p class="text-gray-600">Попробуйте изменить параметры поиска</p>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="pagination.total_pages > 1" class="bg-white rounded-xl shadow-lg p-4 mb-4">
        <nav class="flex items-center justify-center gap-1">
          <button
            @click="goToPage(pagination.prev_page)"
            :disabled="!pagination.has_prev"
            class="flex items-center gap-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-600 text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-w-[44px] justify-center"
          >
            ← Предыдущая
          </button>

          <template v-for="page in getPageNumbers()" :key="page">
            <button
              v-if="typeof page === 'number'"
              @click="goToPage(page)"
              :class="[
                'flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold min-w-[44px] transition-all duration-300',
                page === pagination.page
                  ? 'bg-gray-900 text-white border-2 border-gray-900'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500">...</span>
          </template>

          <button
            @click="goToPage(pagination.next_page)"
            :disabled="!pagination.has_next"
            class="flex items-center gap-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-600 text-sm font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-w-[44px] justify-center"
          >
            Следующая →
          </button>
        </nav>
      </div>
    </div>

    <!-- Плавающая панель действий -->
    <div
      v-if="hoveredWord"
      ref="actionPanel"
      class="fixed right-3 bg-white border border-gray-200 rounded-lg shadow-xl p-1.5 flex gap-1.5 z-[1001] transition-opacity duration-150"
      :style="{ top: actionPanelTop + 'px' }"
      @mouseenter="keepPanelVisible = true"
      @mouseleave="handlePanelLeave"
    >
      <button
        @click="handleCopyWord"
        class="p-2 text-gray-600 hover:bg-blue-50 rounded transition-colors"
        title="Копировать"
      >
        📋
      </button>
      <button
        @click="handleEditWord"
        class="p-2 text-gray-600 hover:bg-yellow-50 rounded transition-colors"
        title="Редактировать"
      >
        ✏️
      </button>
      <button
        @click="handleDeleteWord"
        class="p-2 text-gray-600 hover:bg-red-50 rounded transition-colors"
        title="Удалить"
      >
        🗑️
      </button>
      <button
        @click="handleGenerateExamples"
        class="p-2 text-gray-600 hover:bg-green-50 rounded transition-colors"
        title="+5 примеров"
      >
        +5
      </button>
    </div>

    <!-- Popover для слова -->
    <div
      v-if="tooltipWord"
      ref="tooltip"
      class="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50"
      :style="{ ...tooltipStyle, maxWidth: '621px', fontSize: '17px', lineHeight: '1.6' }"
      @click.stop
    >
      <div class="space-y-2" v-html="tooltipContent"></div>
    </div>

    <!-- Модалка редактирования -->
    <div
      v-if="showEditModal"
      ref="editModalRef"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showEditModal = false"
      @keydown.meta.enter.prevent="saveEditWord"
      @keydown.ctrl.enter.prevent="saveEditWord"
      @keydown.escape="showEditModal = false"
      tabindex="-1"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Редактировать слово</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Слово/фраза:</label>
            <input
              v-model="editWordData.text"
              type="text"
              @keydown.meta.enter.prevent="saveEditWord"
              @keydown.ctrl.enter.prevent="saveEditWord"
              class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Перевод:</label>
            <input
              v-model="editWordData.main_translation"
              type="text"
              @keydown.meta.enter.prevent="saveEditWord"
              @keydown.ctrl.enter.prevent="saveEditWord"
              class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Группа:</label>
            <select
              v-model="editWordData.group_id"
              @keydown.meta.enter.prevent="saveEditWord"
              @keydown.ctrl.enter.prevent="saveEditWord"
              class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-base font-sans transition-all duration-300 bg-white text-gray-900 focus:outline-none focus:border-gray-600 focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]"
            >
              <option :value="null">Без группы</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button
            @click="saveEditWord"
            class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)]"
          >
            Сохранить
          </button>
          <button
            @click="showEditModal = false"
            class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
          >
            Отмена
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-3 text-center">⌘ + Enter для сохранения</p>
      </div>
    </div>

    <!-- Модалка удаления -->
    <div
      v-if="showDeleteModal"
      ref="deleteModalRef"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
      @keydown.meta.enter.prevent="confirmDeleteWord"
      @keydown.ctrl.enter.prevent="confirmDeleteWord"
      @keydown.escape="showDeleteModal = false"
      tabindex="-1"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Удалить слово?</h3>
        <p class="text-gray-700 mb-4">
          Вы уверены, что хотите удалить слово <strong>"{{ deleteWordData.text }}"</strong>?
        </p>
        <div class="flex gap-2">
          <button
            @click="confirmDeleteWord"
            class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(31,31,31,0.25)]"
          >
            Удалить
          </button>
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
          >
            Отмена
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-3 text-center">⌘ + Enter для подтверждения</p>
      </div>
    </div>

    <!-- Модалка примеров -->
    <div
      v-if="showExamplesModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showExamplesModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Примеры для: {{ examplesData.text }}</h3>
        <div v-if="isGeneratingExamples" class="text-center py-8">
          <p class="text-gray-600">Генерация примеров...</p>
        </div>
        <div v-else-if="examplesData.examples.length > 0" class="space-y-3">
          <div
            v-for="(example, index) in examplesData.examples"
            :key="index"
            class="border-l-4 border-blue-500 pl-4 py-2"
          >
            <p class="font-semibold text-gray-800">{{ example.en }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ example.ru }}</p>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>Не удалось получить примеры</p>
        </div>
        <div class="mt-4">
          <button
            @click="showExamplesModal = false"
            class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWords, addWords, deleteWord, bulkDeleteWords, editWord, getWordTooltip, generateExamples, getGroups, initDefaultGroups } from '../api/words.js'

const route = useRoute()
const router = useRouter()

// Состояние
const words = ref([])
const pagination = reactive({
  page: 1,
  per_page: 100,
  total_words: 0,
  total_pages: 1,
  has_prev: false,
  has_next: false,
  start_page: 1,
  end_page: 1,
})
const filters = reactive({
  search: '',
  filter: '',
  sort: 'id',
  dir: 'desc',
})

const searchQuery = ref('')
const filterType = ref('')
const sortField = ref('id')
const sortDir = ref('desc')
const perPage = ref(100)

const addWordsText = ref('')
const isAdding = ref(false)

const groups = ref([])

const selectedWords = ref([])
const selectAll = ref(false)

const hoveredWord = ref(null)
const actionPanel = ref(null)
const actionPanelTop = ref(0)
const keepPanelVisible = ref(false)

const tooltipWord = ref(null)
const tooltip = ref(null)
const tooltipContent = ref('')
const tooltipStyle = reactive({ top: '0px', left: '0px' })

// Загрузка данных
const loadWords = async () => {
  try {
    const params = {
      page: pagination.page,
      per_page: perPage.value,
      search: filters.search || undefined,
      filter: filters.filter || undefined,
      sort: sortField.value,
      dir: sortDir.value,
    }
    
    const response = await getWords(params)
    words.value = response.words || []
    
    if (response.pagination) {
      Object.assign(pagination, response.pagination)
    }
    
    if (response.filters) {
      Object.assign(filters, response.filters)
      searchQuery.value = filters.search || ''
      filterType.value = filters.filter || ''
      sortField.value = filters.sort || 'id'
      sortDir.value = filters.dir || 'desc'
    }
  } catch (error) {
    console.error('Error loading words:', error)
    const errorMessage = error.response?.data?.error || error.response?.data?.detail || error.message || 'Ошибка загрузки слов'
    console.error('Error details:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    })
    alert(`Ошибка загрузки слов: ${errorMessage}`)
  }
}

// Обработчики
const handleAddWords = async () => {
  if (!addWordsText.value.trim()) return
  
  isAdding.value = true
  try {
    await addWords(addWordsText.value.trim())
    addWordsText.value = ''
    await loadWords()
  } catch (error) {
    console.error('Error adding words:', error)
    const errorMessage = error.response?.data?.error || error.message || 'Ошибка добавления слов'
    alert(`Ошибка добавления слов: ${errorMessage}`)
  } finally {
    isAdding.value = false
  }
}

const handleSearch = () => {
  filters.search = searchQuery.value
  filters.filter = filterType.value
  pagination.page = 1
  updateURL()
  loadWords()
}

const formatTag = (tag) => {
  // Сокращаем длинные теги для избежания переноса строки
  if (tag && typeof tag === 'string') {
    if (tag.toLowerCase() === 'adjective') {
      return 'adj'
    }
    return tag
  }
  return tag
}

const getLevelTags = (tags) => {
  // Фильтруем только теги уровня английского (A1, A2, B1, B2, C1, C2)
  if (!tags || !Array.isArray(tags)) return []
  const levelPattern = /^[A-C][1-2]$/i
  return tags.filter(tag => {
    if (typeof tag !== 'string') return false
    return levelPattern.test(tag.trim())
  })
}

const getOtherTags = (tags) => {
  // Получаем все теги кроме уровней
  if (!tags || !Array.isArray(tags)) return []
  const levelPattern = /^[A-C][1-2]$/i
  return tags.filter(tag => {
    if (typeof tag !== 'string') return false
    return !levelPattern.test(tag.trim())
  })
}

const getOtherTagsTooltip = (tags) => {
  // Формируем текст для всплывающей подсказки с остальными тегами
  const otherTags = getOtherTags(tags)
  if (otherTags.length === 0) return ''
  return otherTags.map(tag => formatTag(tag)).join(', ')
}

// Сброс выбора при загрузке новых слов
watch(() => words.value, () => {
  // Сбрасываем selectAll, если текущий выбор не соответствует списку
  if (selectedWords.value.length > 0) {
    const currentIds = words.value.map(w => w.id)
    selectedWords.value = selectedWords.value.filter(id => currentIds.includes(id))
    selectAll.value = selectedWords.value.length === words.value.length && words.value.length > 0
  } else {
    selectAll.value = false
  }
})

const resetSearch = () => {
  searchQuery.value = ''
  filterType.value = ''
  filters.search = ''
  filters.filter = ''
  pagination.page = 1
  updateURL()
  loadWords()
}

const handleSort = (field) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
  filters.sort = sortField.value
  filters.dir = sortDir.value
  pagination.page = 1
  updateURL()
  loadWords()
}

const handlePerPageChange = () => {
  pagination.page = 1
  updateURL()
  loadWords()
}

const goToPage = (page) => {
  if (page && page >= 1 && page <= pagination.total_pages) {
    pagination.page = page
    updateURL()
    loadWords()
  }
}

const getPageNumbers = () => {
  const pages = []
  const start = pagination.start_page
  const end = pagination.end_page
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < pagination.total_pages) {
    if (end < pagination.total_pages - 1) pages.push('...')
    pages.push(pagination.total_pages)
  }
  
  return pages
}

const handleRowHover = (event, word) => {
  hoveredWord.value = word
  keepPanelVisible.value = true
  
  // Позиционирование панели
  const rect = event.currentTarget.getBoundingClientRect()
  actionPanelTop.value = rect.top + (rect.height / 2) - 20
  
  // Ограничение в пределах viewport
  const panelHeight = 50
  const maxTop = window.innerHeight - panelHeight - 10
  actionPanelTop.value = Math.min(actionPanelTop.value, maxTop)
  actionPanelTop.value = Math.max(10, actionPanelTop.value)
}

const handleRowLeave = () => {
  if (!keepPanelVisible.value) {
    hoveredWord.value = null
  }
}

const handlePanelLeave = () => {
  keepPanelVisible.value = false
  setTimeout(() => {
    if (!keepPanelVisible.value) {
      hoveredWord.value = null
    }
  }, 200)
}

const handleCopyWord = async () => {
  if (!hoveredWord.value) return
  try {
    await navigator.clipboard.writeText(hoveredWord.value.text)
    alert('Слово скопировано')
  } catch (error) {
    console.error('Error copying:', error)
  }
}

const editWordData = ref({
  id: null,
  text: '',
  main_translation: '',
  group_id: null,
})
const showEditModal = ref(false)
const editModalRef = ref(null)

const loadGroups = async () => {
  try {
    groups.value = await getGroups()
    // Инициализируем группы по умолчанию, если их нет
    if (groups.value.length === 0) {
      await initDefaultGroups()
      groups.value = await getGroups()
    }
  } catch (error) {
    console.error('Error loading groups:', error)
  }
}

const handleEditWord = async () => {
  if (!hoveredWord.value) return
  editWordData.value = {
    id: hoveredWord.value.id,
    text: hoveredWord.value.text || '',
    main_translation: hoveredWord.value.main_translation || '',
    group_id: hoveredWord.value.group_id || null,
  }
  showEditModal.value = true
  await nextTick()
  // Фокусируем модалку для работы keyboard shortcuts
  if (editModalRef.value) {
    editModalRef.value.focus()
  }
}

const saveEditWord = async () => {
  try {
    await editWord(editWordData.value.id, {
      text: editWordData.value.text,
      main_translation: editWordData.value.main_translation,
      group_id: editWordData.value.group_id,
    })
    showEditModal.value = false
    await loadWords()
    hoveredWord.value = null
  } catch (error) {
    console.error('Error editing word:', error)
    alert('Ошибка редактирования слова')
  }
}

const deleteWordData = ref({ id: null, text: '' })
const showDeleteModal = ref(false)
const deleteModalRef = ref(null)

const handleDeleteWord = async () => {
  if (!hoveredWord.value) return
  deleteWordData.value = {
    id: hoveredWord.value.id,
    text: hoveredWord.value.text,
  }
  showDeleteModal.value = true
  await nextTick()
  // Фокусируем модалку для работы keyboard shortcuts
  if (deleteModalRef.value) {
    deleteModalRef.value.focus()
  }
}

const confirmDeleteWord = async () => {
  try {
    await deleteWord(deleteWordData.value.id)
    showDeleteModal.value = false
    await loadWords()
    hoveredWord.value = null
    // Сбрасываем выбор, если удаленное слово было выбрано
    selectedWords.value = selectedWords.value.filter(id => id !== deleteWordData.value.id)
  } catch (error) {
    console.error('Error deleting word:', error)
    alert('Ошибка удаления слова: ' + (error.response?.data?.error || error.message || 'Неизвестная ошибка'))
  }
}

// Массовое удаление
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedWords.value = words.value.map(w => w.id)
  } else {
    selectedWords.value = []
  }
}

const handleWordSelect = () => {
  selectAll.value = selectedWords.value.length === words.value.length && words.value.length > 0
}

const handleBulkDelete = async () => {
  if (selectedWords.value.length === 0) return
  
  const count = selectedWords.value.length
  if (!confirm(`Вы уверены, что хотите удалить ${count} ${count === 1 ? 'слово' : count < 5 ? 'слова' : 'слов'}?`)) {
    return
  }
  
  try {
    const result = await bulkDeleteWords(selectedWords.value)
    selectedWords.value = []
    selectAll.value = false
    await loadWords()
    alert(`Удалено ${result.deleted_count || count} ${result.deleted_count === 1 ? 'слово' : result.deleted_count < 5 ? 'слова' : 'слов'}`)
  } catch (error) {
    console.error('Error bulk deleting words:', error)
    alert('Ошибка массового удаления: ' + (error.response?.data?.error || error.message || 'Неизвестная ошибка'))
  }
}

const examplesData = ref({ id: null, text: '', examples: [] })
const showExamplesModal = ref(false)
const isGeneratingExamples = ref(false)

const handleGenerateExamples = async () => {
  if (!hoveredWord.value) return
  examplesData.value = {
    id: hoveredWord.value.id,
    text: hoveredWord.value.text,
    examples: [],
  }
  showExamplesModal.value = true
  isGeneratingExamples.value = true
  
  try {
    const response = await generateExamples(hoveredWord.value.id)
    examplesData.value.examples = response.examples || []
    await loadWords()
  } catch (error) {
    console.error('Error generating examples:', error)
    alert('Ошибка генерации примеров')
  } finally {
    isGeneratingExamples.value = false
  }
}

const showWordTooltip = async (event, word) => {
  tooltipWord.value = word
  
  // Базовое содержимое из данных слова с правильными классами
  let html = `<div class="tooltip-word" style="margin-bottom: 8px;"><strong>${escapeHtml(word.text)}</strong></div>`
  
  const mainTr = word.main_translation || ''
  const alts = (word.alt_translations || []).join(', ')
  html += `<div class="tooltip-translations" style="margin-bottom: 8px;">${escapeHtml(mainTr)}${alts ? ' — ' + escapeHtml(alts) : ''}</div>`
  html += `<div class="tooltip-synonyms" style="margin-bottom: 8px;"><em>Synonyms:</em> <span class="text-gray-500">загружаем…</span></div>`
  html += `<div class="tooltip-examples" style="margin-top: 8px;"><ol style="margin:0 0 0 16px; padding:0;"><li class="text-gray-500">загружаем примеры…</li></ol></div>`
  
  tooltipContent.value = html
  
  // Позиционирование
  if (event && event.target) {
    const rect = event.target.getBoundingClientRect()
    tooltipStyle.left = rect.left + 'px'
    tooltipStyle.top = (rect.bottom + 10) + 'px'
  }
  
  // Загрузка дополнительных данных
  try {
    const response = await getWordTooltip(word.id)
    if (response.html) {
      tooltipContent.value = response.html
    }
  } catch (error) {
    console.error('Error loading tooltip:', error)
  }
}

const escapeHtml = (text) => {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const getTranslationsTooltip = (word) => {
  const parts = []
  if (word.main_translation) parts.push(word.main_translation)
  if (word.alt_translations && word.alt_translations.length > 0) {
    parts.push(...word.alt_translations)
  }
  return parts.join(' — ') || '—'
}

const updateURL = () => {
  const params = new URLSearchParams()
  if (pagination.page > 1) params.set('page', pagination.page)
  if (perPage.value !== 100) params.set('per_page', perPage.value)
  if (filters.search) params.set('search', filters.search)
  if (filters.filter) params.set('filter', filters.filter)
  if (sortField.value !== 'id') params.set('sort', sortField.value)
  if (sortDir.value !== 'desc') params.set('dir', sortDir.value)
  
  const query = params.toString()
  router.replace({ query: query ? Object.fromEntries(params) : {} })
}

// Инициализация
onMounted(async () => {
  // Загружаем группы
  await loadGroups()
  
  // Чтение параметров из URL
  const query = route.query
  pagination.page = parseInt(query.page) || 1
  perPage.value = parseInt(query.per_page) || 100
  searchQuery.value = query.search || ''
  filterType.value = query.filter || ''
  sortField.value = query.sort || 'id'
  sortDir.value = query.dir || 'desc'
  
  filters.search = searchQuery.value
  filters.filter = filterType.value
  filters.sort = sortField.value
  filters.dir = sortDir.value
  
  loadWords()
})

// Закрытие popover при клике вне
watch(tooltipWord, (newVal) => {
  if (newVal) {
    const handleClickOutside = (event) => {
      if (tooltip.value && !tooltip.value.contains(event.target)) {
        tooltipWord.value = null
        document.removeEventListener('click', handleClickOutside)
      }
    }
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
  }
})
</script>

<style scoped>
/* Дополнительные стили для точного соответствия оригиналу */
@media (max-width: 1200px) {
  .flex.gap-3 {
    flex-direction: column;
  }
}

/* Стили для popover - соответствие оригиналу */
:deep(.tooltip-word) {
  margin-bottom: 8px;
}

:deep(.tooltip-translations) {
  margin-bottom: 8px;
}

:deep(.tooltip-synonyms) {
  margin-bottom: 8px;
}

:deep(.tooltip-examples) {
  margin-top: 8px;
}
</style>
