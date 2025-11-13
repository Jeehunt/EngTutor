<template>
  <div class="min-h-screen bg-gray-100">
    <div class="w-full px-3 py-3">
      <!-- Заголовок -->
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-gray-900">🎮 Практика английского</h1>
      </div>

      <!-- Режимы практики -->
      <div v-if="!currentMode" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Режим 1: Ввод перевода -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="text-6xl mb-4">✍️</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Режим 1: Ввод перевода</h3>
            <p class="text-sm text-gray-600 mb-4">Введите русский перевод английского слова или фразы</p>
            <button
              @click="startMode(1)"
              class="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)]"
            >
              <span class="mr-2">🚀</span>
              Начать
            </button>
          </div>

          <!-- Режим 2: Выбор из вариантов (featured) -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-4 border-green-500 transform scale-105">
            <div class="text-6xl mb-4">🎯</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Режим 2: Выбор из вариантов</h3>
            <p class="text-sm text-gray-600 mb-4">Выберите правильный перевод из четырех предложенных вариантов</p>
            <button
              @click="startMode(2)"
              class="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)]"
            >
              <span class="mr-2">⭐</span>
              Начать
            </button>
          </div>

          <!-- Режим 3: Ввод слова -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="text-6xl mb-4">🔤</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Режим 3: Ввод слова</h3>
            <p class="text-sm text-gray-600 mb-4">Введите английское слово по русскому переводу</p>
            <button
              @click="startMode(3)"
              class="w-full px-4 py-2.5 bg-yellow-500 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-yellow-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)]"
            >
              <span class="mr-2">💪</span>
              Начать
            </button>
          </div>

          <!-- Режим 4: Пропущенное слово -->
          <div class="bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="text-6xl mb-4">🧩</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Режим 4: Пропущенное слово</h3>
            <p class="text-sm text-gray-600 mb-4">Вставьте пропущенное слово в предложении (5 предложений)</p>
            <button
              @click="startMode(4)"
              class="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(26,26,26,0.2)]"
            >
              <span class="mr-2">🧠</span>
              Начать
            </button>
          </div>
        </div>
      </div>

      <!-- Формы режимов практики -->
      <div v-if="currentMode">
        <!-- Режим 1: Ввод перевода -->
        <div v-if="currentMode === 1" class="bg-white rounded-xl shadow-lg mb-4">
          <div class="px-6 py-4 border-b-2 border-gray-100">
            <h3 class="text-xl font-bold text-gray-900">Режим 1: Ввод перевода</h3>
          </div>
          <div class="p-6">
            <form v-if="mode1Items.length > 0" @submit.prevent="submitMode1" class="space-y-4 mb-4">
              <div v-for="(item, index) in mode1Items" :key="item.id" 
                :class="[
                  'p-4 rounded-lg border-2 transition-all duration-300',
                  mode1ItemStatus[item.id] === 'correct' 
                    ? 'bg-green-50 border-green-500' 
                    : mode1ItemStatus[item.id] === 'incorrect' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-gray-50 border-gray-200'
                ]">
                <div class="mb-2 font-semibold text-gray-900">{{ item.text }}</div>
                <div class="flex items-center gap-3">
                  <input
                    v-model="mode1Answers[index]"
                    type="text"
                    :readonly="mode1ItemStatus[item.id] !== undefined"
                    :class="[
                      'w-full px-3 py-2.5 border-2 rounded-lg text-base font-sans transition-all duration-300 focus:outline-none focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]',
                      mode1ItemStatus[item.id] === 'correct' 
                        ? 'border-green-500 bg-green-100 text-green-900' 
                        : mode1ItemStatus[item.id] === 'incorrect' 
                        ? 'border-red-500 bg-red-100 text-red-900' 
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-gray-600'
                    ]"
                    placeholder="Введите перевод на русский"
                    autocomplete="off"
                  />
                  <div v-if="mode1ItemStatus[item.id]" class="text-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-semibold',
                        mode1ItemStatus[item.id] === 'correct' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ mode1ItemStatus[item.id] === 'correct' ? '✓ Верно' : '✗ Неверно' }}
                    </span>
                  </div>
                </div>
                <div v-if="mode1ItemStatus[item.id] === 'incorrect' && mode1ItemCorrectAnswers[item.id]" 
                     class="mt-2 text-sm text-red-700 font-medium">
                  Правильный ответ: <span class="font-bold">{{ mode1ItemCorrectAnswers[item.id] }}</span>
                </div>
              </div>
              <div v-if="!mode1Result" class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5"
                >
                  Проверить
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100"
                >
                  Назад
                </button>
              </div>
            </form>
            <div v-if="mode1Result" class="mt-4">
              <div :class="[
                'mb-4 p-4 rounded-lg border-2',
                mode1Result.total > 0 && (mode1Result.correct / mode1Result.total) >= 0.8 
                  ? 'bg-green-50 border-green-500' 
                  : mode1Result.total > 0 && (mode1Result.correct / mode1Result.total) >= 0.5 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-red-50 border-red-500'
              ]">
                <p :class="[
                  'text-xl font-bold',
                  mode1Result.total > 0 && (mode1Result.correct / mode1Result.total) >= 0.8 
                    ? 'text-green-900' 
                    : mode1Result.total > 0 && (mode1Result.correct / mode1Result.total) >= 0.5 
                    ? 'text-yellow-900' 
                    : 'text-red-900'
                ]">
                  Результат: {{ mode1Result.correct }} из {{ mode1Result.total }} верных 
                  <span v-if="mode1Result.total > 0">({{ calculatePercentage(mode1Result.correct, mode1Result.total) }}%)</span>
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="startMode(1)"
                  class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600"
                >
                  Повторить
                </button>
                <button
                  @click="goBack"
                  class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
                >
                  К режимам
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Режим 2: Выбор из вариантов -->
        <div v-if="currentMode === 2" class="bg-white rounded-xl shadow-lg mb-4">
          <div class="px-6 py-4 border-b-2 border-gray-100">
            <h3 class="text-xl font-bold text-gray-900">Режим 2: Выбор из вариантов</h3>
          </div>
          <div class="p-6">
            <form v-if="mode2Items.length > 0" @submit.prevent="submitMode2" class="space-y-4 mb-4">
              <div v-for="(item, index) in mode2Items" :key="item.word?.id || index" 
                :class="[
                  'p-4 rounded-lg border-2 transition-all duration-300',
                  mode2ItemStatus[item.word?.id] === 'correct' 
                    ? 'bg-green-50 border-green-500' 
                    : mode2ItemStatus[item.word?.id] === 'incorrect' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-gray-50 border-gray-200'
                ]">
                <div class="mb-2 font-semibold text-gray-900">{{ item.word?.text || item.text }}</div>
                <div class="flex items-center gap-3">
                  <select
                    v-model="mode2Answers[index]"
                    :disabled="mode2ItemStatus[item.word?.id] !== undefined"
                    :class="[
                      'w-full px-3 py-2.5 border-2 rounded-lg text-base font-sans transition-all duration-300 focus:outline-none focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]',
                      mode2ItemStatus[item.word?.id] === 'correct' 
                        ? 'border-green-500 bg-green-100 text-green-900' 
                        : mode2ItemStatus[item.word?.id] === 'incorrect' 
                        ? 'border-red-500 bg-red-100 text-red-900' 
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-gray-600'
                    ]"
                  >
                    <option value="" disabled selected>Выберите перевод</option>
                    <option v-for="opt in item.options" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <div v-if="mode2ItemStatus[item.word?.id]" class="text-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-semibold',
                        mode2ItemStatus[item.word?.id] === 'correct' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ mode2ItemStatus[item.word?.id] === 'correct' ? '✓ Верно' : '✗ Неверно' }}
                    </span>
                  </div>
                </div>
                <div v-if="mode2ItemStatus[item.word?.id] === 'incorrect' && mode2ItemCorrectAnswers[item.word?.id]" 
                     class="mt-2 text-sm text-red-700 font-medium">
                  Правильный ответ: <span class="font-bold">{{ mode2ItemCorrectAnswers[item.word?.id] }}</span>
                </div>
              </div>
              <div v-if="!mode2Result" class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5"
                >
                  Проверить
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100"
                >
                  Назад
                </button>
              </div>
            </form>
            <div v-if="mode2Result" class="mt-4">
              <div :class="[
                'mb-4 p-4 rounded-lg border-2',
                mode2Result.total > 0 && (mode2Result.correct / mode2Result.total) >= 0.8 
                  ? 'bg-green-50 border-green-500' 
                  : mode2Result.total > 0 && (mode2Result.correct / mode2Result.total) >= 0.5 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-red-50 border-red-500'
              ]">
                <p :class="[
                  'text-xl font-bold',
                  mode2Result.total > 0 && (mode2Result.correct / mode2Result.total) >= 0.8 
                    ? 'text-green-900' 
                    : mode2Result.total > 0 && (mode2Result.correct / mode2Result.total) >= 0.5 
                    ? 'text-yellow-900' 
                    : 'text-red-900'
                ]">
                  Результат: {{ mode2Result.correct }} из {{ mode2Result.total }} верных 
                  <span v-if="mode2Result.total > 0">({{ calculatePercentage(mode2Result.correct, mode2Result.total) }}%)</span>
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="startMode(2)"
                  class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600"
                >
                  Повторить
                </button>
                <button
                  @click="goBack"
                  class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
                >
                  К режимам
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Режим 3: Ввод слова -->
        <div v-if="currentMode === 3" class="bg-white rounded-xl shadow-lg mb-4">
          <div class="px-6 py-4 border-b-2 border-gray-100">
            <h3 class="text-xl font-bold text-gray-900">Режим 3: Ввод слова</h3>
          </div>
          <div class="p-6">
            <form v-if="mode3Items.length > 0" @submit.prevent="submitMode3" id="mode3-form" class="space-y-4 mb-4">
              <div v-for="(item, index) in mode3Items" :key="item.id" :data-item-id="item.id" 
                :class="[
                  'p-4 rounded-lg border-2 transition-all duration-300',
                  mode3ItemStatus[item.id] === 'correct' 
                    ? 'bg-green-50 border-green-500' 
                    : mode3ItemStatus[item.id] === 'incorrect' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-gray-50 border-gray-200'
                ]">
                <div class="mb-2 font-semibold text-gray-900">
                  {{ item.main_translation || (item.alt_translations && item.alt_translations[0]) || "Перевод отсутствует" }}
                </div>
                <div class="flex items-center gap-3">
                  <input
                    v-model="mode3Answers[index]"
                    :readonly="mode3ItemStatus[item.id] !== undefined"
                    :class="[
                      'w-full px-3 py-2.5 border-2 rounded-lg text-base font-sans transition-all duration-300 focus:outline-none focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]',
                      mode3ItemStatus[item.id] === 'correct' 
                        ? 'border-green-500 bg-green-100 text-green-900' 
                        : mode3ItemStatus[item.id] === 'incorrect' 
                        ? 'border-red-500 bg-red-100 text-red-900' 
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-gray-600'
                    ]"
                    type="text"
                    placeholder="Введите слово на английском"
                    autocomplete="off"
                  />
                  <div v-if="mode3ItemStatus[item.id]" class="text-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-semibold',
                        mode3ItemStatus[item.id] === 'correct' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ mode3ItemStatus[item.id] === 'correct' ? '✓ Верно' : '✗ Неверно' }}
                    </span>
                  </div>
                </div>
                <div v-if="mode3ItemStatus[item.id] === 'incorrect' && mode3ItemCorrectAnswers[item.id]" 
                     class="mt-2 text-sm text-red-700 font-medium">
                  Правильный ответ: <span class="font-bold text-base">{{ mode3ItemCorrectAnswers[item.id] }}</span>
                </div>
              </div>
              <div v-if="!mode3Result" class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5"
                >
                  Проверить
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100"
                >
                  Назад
                </button>
              </div>
            </form>
            <div v-if="mode3Result" class="mt-4">
              <div :class="[
                'mb-4 p-4 rounded-lg border-2',
                mode3Result.total > 0 && (mode3Result.correct / mode3Result.total) >= 0.8 
                  ? 'bg-green-50 border-green-500' 
                  : mode3Result.total > 0 && (mode3Result.correct / mode3Result.total) >= 0.5 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-red-50 border-red-500'
              ]">
                <p :class="[
                  'text-xl font-bold',
                  mode3Result.total > 0 && (mode3Result.correct / mode3Result.total) >= 0.8 
                    ? 'text-green-900' 
                    : mode3Result.total > 0 && (mode3Result.correct / mode3Result.total) >= 0.5 
                    ? 'text-yellow-900' 
                    : 'text-red-900'
                ]">
                  Результат: {{ mode3Result.correct }} из {{ mode3Result.total }} верных 
                  <span v-if="mode3Result.total > 0">({{ calculatePercentage(mode3Result.correct, mode3Result.total) }}%)</span>
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="startMode(3)"
                  class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600"
                >
                  Повторить
                </button>
                <button
                  @click="goBack"
                  class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
                >
                  К режимам
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Режим 4: Пропущенное слово -->
        <div v-if="currentMode === 4" class="bg-white rounded-xl shadow-lg mb-4">
          <div class="px-6 py-4 border-b-2 border-gray-100">
            <h3 class="text-xl font-bold text-gray-900">Режим 4: Пропущенное слово</h3>
          </div>
          <div class="p-6">
            <form v-if="mode4Items.length > 0" @submit.prevent="submitMode4" id="mode4-form" class="space-y-4 mb-4">
              <div v-if="!mode4Result" class="flex justify-end mb-2">
                <button
                  type="button"
                  @click="toggleMode4Choices"
                  :disabled="mode4ChoicesShown"
                  class="px-3 py-1.5 text-sm bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ mode4ChoicesShown ? 'Варианты показаны' : 'Показать варианты' }}
                </button>
              </div>
              <div id="mode4-list" class="space-y-4">
                <div v-for="(item, index) in mode4Items" :key="item.id" :data-item-id="item.id" :data-answer="item.answer" 
                  :class="[
                    'p-4 rounded-lg border-2 transition-all duration-300',
                    mode4ItemStatus[item.id] === 'correct' 
                      ? 'bg-green-50 border-green-500' 
                      : mode4ItemStatus[item.id] === 'incorrect' 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-gray-50 border-gray-200'
                  ]">
                  <div class="mb-2 font-semibold text-gray-900">{{ item.cloze }}</div>
                  <div class="flex items-center gap-3">
                    <input
                      v-if="!mode4ChoicesShown"
                      v-model="mode4Answers[index]"
                      :readonly="mode4ItemStatus[item.id] !== undefined"
                      :class="[
                        'w-full px-3 py-2.5 border-2 rounded-lg text-base font-sans transition-all duration-300 focus:outline-none focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]',
                        mode4ItemStatus[item.id] === 'correct' 
                          ? 'border-green-500 bg-green-100 text-green-900' 
                          : mode4ItemStatus[item.id] === 'incorrect' 
                          ? 'border-red-500 bg-red-100 text-red-900' 
                          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-gray-600'
                      ]"
                      type="text"
                      placeholder="Введите пропущенное слово"
                      autocomplete="off"
                    />
                    <select
                      v-else
                      v-model="mode4Answers[index]"
                      :disabled="mode4ItemStatus[item.id] !== undefined"
                      :class="[
                        'w-full px-3 py-2.5 border-2 rounded-lg text-base font-sans transition-all duration-300 focus:outline-none focus:shadow-[0_0_0_4px_rgba(73,80,87,0.1)]',
                        mode4ItemStatus[item.id] === 'correct' 
                          ? 'border-green-500 bg-green-100 text-green-900' 
                          : mode4ItemStatus[item.id] === 'incorrect' 
                          ? 'border-red-500 bg-red-100 text-red-900' 
                          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-gray-600'
                      ]"
                    >
                      <option value="" disabled selected>Выберите слово</option>
                      <option v-for="opt in (mode4SelectOptions[index] || [])" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                    <div v-if="mode4ItemStatus[item.id]" class="text-nowrap">
                      <span
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-semibold',
                          mode4ItemStatus[item.id] === 'correct' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        ]"
                      >
                        {{ mode4ItemStatus[item.id] === 'correct' ? '✓ Верно' : '✗ Неверно' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="mode4ItemStatus[item.id] === 'incorrect' && mode4ItemCorrectAnswers[item.id]" 
                       class="mt-2 text-sm text-red-700 font-medium">
                    Правильный ответ: <span class="font-bold">{{ mode4ItemCorrectAnswers[item.id] }}</span>
                  </div>
                </div>
              </div>
              <div v-if="!mode4Result" class="flex gap-2">
                <button
                  type="submit"
                  class="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5"
                >
                  Проверить
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100"
                >
                  Назад
                </button>
              </div>
            </form>
            <div v-if="mode4Result" class="mt-4">
              <div :class="[
                'mb-4 p-4 rounded-lg border-2',
                mode4Result.total > 0 && (mode4Result.correct / mode4Result.total) >= 0.8 
                  ? 'bg-green-50 border-green-500' 
                  : mode4Result.total > 0 && (mode4Result.correct / mode4Result.total) >= 0.5 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-red-50 border-red-500'
              ]">
                <p :class="[
                  'text-xl font-bold',
                  mode4Result.total > 0 && (mode4Result.correct / mode4Result.total) >= 0.8 
                    ? 'text-green-900' 
                    : mode4Result.total > 0 && (mode4Result.correct / mode4Result.total) >= 0.5 
                    ? 'text-yellow-900' 
                    : 'text-red-900'
                ]">
                  Результат: {{ mode4Result.correct }} из {{ mode4Result.total }} верных 
                  <span v-if="mode4Result.total > 0">({{ calculatePercentage(mode4Result.correct, mode4Result.total) }}%)</span>
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="startMode(4)"
                  class="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-600"
                >
                  Повторить
                </button>
                <button
                  @click="goBack"
                  class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-300"
                >
                  К режимам
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Статистика практики -->
      <div class="bg-white rounded-xl shadow-lg mb-4">
        <div class="px-6 py-4 border-b-2 border-gray-100">
          <h3 class="text-xl font-bold text-gray-900">📊 Ваш прогресс</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="text-center p-5 bg-gray-50 rounded-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.total_words || 0 }}</div>
              <div class="text-sm text-gray-600 font-medium">Всего слов в словаре</div>
            </div>
            <div class="text-center p-5 bg-gray-50 rounded-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.total_uses || 0 }}</div>
              <div class="text-sm text-gray-600 font-medium">Всего решений упражнений</div>
            </div>
            <div class="text-center p-5 bg-gray-50 rounded-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.practiced_today || 0 }}</div>
              <div class="text-sm text-gray-600 font-medium">Отработано сегодня</div>
            </div>
            <div class="text-center p-5 bg-gray-50 rounded-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.zero_uses || 0 }}</div>
              <div class="text-sm text-gray-600 font-medium">Ещё не практиковались</div>
            </div>
            <div class="text-center p-5 bg-gray-50 rounded-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.missing_translation || 0 }}</div>
              <div class="text-sm text-gray-600 font-medium">Без перевода</div>
            </div>
            <div class="text-center p-5 bg-gray-50 rounded-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.missing_examples || 0 }}</div>
              <div class="text-sm text-gray-600 font-medium">Без примеров</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Быстрые действия -->
      <div class="flex gap-2">
        <router-link
          to="/words"
          class="px-4 py-2.5 bg-transparent text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gray-100"
        >
          <span class="mr-2">📚</span>
          Перейти к словарю
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getPracticeStats,
  getMode1Form,
  submitMode1 as apiSubmitMode1,
  getMode2Form,
  submitMode2 as apiSubmitMode2,
  getMode3Form,
  submitMode3 as apiSubmitMode3,
  getMode4Form,
  submitMode4 as apiSubmitMode4,
} from '../api/practice.js'

const router = useRouter()

// Состояние
const stats = reactive({
  total_words: 0,
  total_uses: 0,
  zero_uses: 0,
  missing_translation: 0,
  missing_examples: 0,
  practiced_today: 0,
})

const currentMode = ref(null)

// Режим 1
const mode1Items = ref([])
const mode1Answers = ref([])
const mode1Result = ref(null)
const mode1ItemStatus = ref({})
const mode1ItemCorrectAnswers = ref({})

// Режим 2
const mode2Items = ref([])
const mode2Answers = ref([])
const mode2Result = ref(null)
const mode2ItemStatus = ref({})
const mode2ItemCorrectAnswers = ref({})

// Режим 3
const mode3Items = ref([])
const mode3Answers = ref([])
const mode3Result = ref(null)
const mode3ItemStatus = ref({})
const mode3ItemCorrectAnswers = ref({})

// Режим 4
const mode4Items = ref([])
const mode4Answers = ref([])
const mode4Result = ref(null)
const mode4ItemStatus = ref({})
const mode4ItemCorrectAnswers = ref({})
const mode4ChoicesShown = ref(false)
const mode4Selects = ref([])
const mode4SelectOptions = ref([])

// Загрузка статистики
const loadStats = async () => {
  try {
    const data = await getPracticeStats()
    Object.assign(stats, data)
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Начало режима
const startMode = async (mode) => {
  currentMode.value = mode
  mode1Result.value = null
  mode2Result.value = null
  mode3Result.value = null
  mode4Result.value = null
  mode1ItemStatus.value = {}
  mode1ItemCorrectAnswers.value = {}
  mode2ItemStatus.value = {}
  mode2ItemCorrectAnswers.value = {}
  mode3ItemStatus.value = {}
  mode3ItemCorrectAnswers.value = {}
  mode4ItemStatus.value = {}
  mode4ItemCorrectAnswers.value = {}
  mode4ChoicesShown.value = false
  mode4Selects.value = []
  mode4SelectOptions.value = []

  try {
    if (mode === 1) {
      const data = await getMode1Form()
      mode1Items.value = data.items || []
      mode1Answers.value = new Array(mode1Items.value.length).fill('')
    } else if (mode === 2) {
      const data = await getMode2Form()
      mode2Items.value = data.mcq || []
      mode2Answers.value = new Array(mode2Items.value.length).fill('')
    } else if (mode === 3) {
      const data = await getMode3Form()
      mode3Items.value = data.items || []
      mode3Answers.value = new Array(mode3Items.value.length).fill('')
    } else if (mode === 4) {
      const data = await getMode4Form()
      mode4Items.value = data.cloze || []
      mode4Answers.value = new Array(mode4Items.value.length).fill('')
    }
    await loadStats()
  } catch (error) {
    console.error('Error loading mode:', error)
    alert('Ошибка загрузки упражнения')
  }
}

// Отправка режима 1
const submitMode1 = async () => {
  try {
    const ids = mode1Items.value.map(item => item.id)
    const result = await apiSubmitMode1(mode1Answers.value, ids)
    mode1Result.value = result.result || result
    
    // Обновляем статусы элементов
    mode1ItemStatus.value = {}
    mode1ItemCorrectAnswers.value = {}
    const items = result.items || []
    items.forEach(item => {
      if (item.is_correct) {
        mode1ItemStatus.value[item.id] = 'correct'
      } else {
        mode1ItemStatus.value[item.id] = 'incorrect'
        mode1ItemCorrectAnswers.value[item.id] = item.correct_answer
      }
    })
    
    await loadStats()
  } catch (error) {
    console.error('Error submitting mode1:', error)
    alert('Ошибка отправки ответов')
  }
}

// Отправка режима 2
const submitMode2 = async () => {
  try {
    const ids = mode2Items.value.map(item => item.word?.id)
    const result = await apiSubmitMode2(mode2Answers.value, ids)
    mode2Result.value = result.result || result
    
    // Обновляем статусы элементов
    mode2ItemStatus.value = {}
    mode2ItemCorrectAnswers.value = {}
    const items = result.items || []
    items.forEach(item => {
      const wordId = item.id
      if (item.is_correct) {
        mode2ItemStatus.value[wordId] = 'correct'
      } else {
        mode2ItemStatus.value[wordId] = 'incorrect'
        mode2ItemCorrectAnswers.value[wordId] = item.correct_answer
      }
    })
    
    await loadStats()
  } catch (error) {
    console.error('Error submitting mode2:', error)
    alert('Ошибка отправки ответов')
  }
}

// Отправка режима 3
const submitMode3 = async () => {
  try {
    const ids = mode3Items.value.map(item => item.id)
    const result = await apiSubmitMode3(mode3Answers.value, ids)
    mode3Result.value = { correct: result.correct, total: result.total }
    
    // Обновляем статусы элементов
    mode3ItemStatus.value = {}
    mode3ItemCorrectAnswers.value = {}
    const items = result.items || []
    items.forEach(item => {
      if (item.is_correct) {
        mode3ItemStatus.value[item.id] = 'correct'
      } else {
        mode3ItemStatus.value[item.id] = 'incorrect'
        mode3ItemCorrectAnswers.value[item.id] = item.correct_answer
      }
    })
    await loadStats()
  } catch (error) {
    console.error('Error submitting mode3:', error)
    alert('Ошибка отправки ответов')
  }
}

// Отправка режима 4
const submitMode4 = async () => {
  try {
    const ids = mode4Items.value.map(item => item.id)
    const result = await apiSubmitMode4(mode4Answers.value, ids)
    mode4Result.value = result.result || result
    
    // Обновляем статусы элементов
    mode4ItemStatus.value = {}
    mode4ItemCorrectAnswers.value = {}
    const items = result.items || []
    items.forEach(item => {
      if (item.is_correct) {
        mode4ItemStatus.value[item.id] = 'correct'
      } else {
        mode4ItemStatus.value[item.id] = 'incorrect'
        mode4ItemCorrectAnswers.value[item.id] = item.correct_answer
      }
    })
    
    await loadStats()
  } catch (error) {
    console.error('Error submitting mode4:', error)
    alert('Ошибка отправки ответов')
  }
}

// Переключение вариантов в режиме 4
const toggleMode4Choices = () => {
  if (mode4ChoicesShown.value) return
  
  mode4ChoicesShown.value = true
  
  // Получаем все правильные ответы
  const allAnswers = mode4Items.value.map(item => (item.answer || '').trim()).filter(Boolean)
  
  // Получаем уже введенные пользователем значения
  const entered = new Set(
    mode4Answers.value
      .map(a => (a || '').trim().toLowerCase())
      .filter(Boolean)
  )
  
  // Список вариантов = все ответы минус уже введенные
  const remaining = allAnswers.filter(a => !entered.has(a.toLowerCase()))
  
  // Создаем селекты для каждого элемента
  mode4Selects.value = new Array(mode4Items.value.length).fill(true)
  mode4SelectOptions.value = new Array(mode4Items.value.length).fill(null).map(() => [...remaining])
  
  // Если пользователь уже ввел значение, устанавливаем его в селекте
  mode4Answers.value.forEach((answer, index) => {
    if (answer && remaining.some(v => v.toLowerCase() === answer.toLowerCase())) {
      // Значение уже есть в вариантах, оставляем как есть
    }
  })
}

// Возврат к режимам
const goBack = () => {
  currentMode.value = null
  mode1Items.value = []
  mode1Answers.value = []
  mode1Result.value = null
  mode1ItemStatus.value = {}
  mode1ItemCorrectAnswers.value = {}
  mode2Items.value = []
  mode2Answers.value = []
  mode2Result.value = null
  mode2ItemStatus.value = {}
  mode2ItemCorrectAnswers.value = {}
  mode3Items.value = []
  mode3Answers.value = []
  mode3Result.value = null
  mode3ItemStatus.value = {}
  mode3ItemCorrectAnswers.value = {}
  mode4Items.value = []
  mode4Answers.value = []
  mode4Result.value = null
  mode4ItemStatus.value = {}
  mode4ItemCorrectAnswers.value = {}
  mode4ChoicesShown.value = false
  mode4Selects.value = []
  mode4SelectOptions.value = []
}

// Helper функция для расчета процента
const calculatePercentage = (correct, total) => {
  if (!total || total === 0) return 0
  return Math.round((correct / total) * 100)
}

// Инициализация
onMounted(async () => {
  await loadStats()
})
</script>

<style scoped>
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
