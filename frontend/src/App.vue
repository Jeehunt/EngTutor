<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <header class="bg-white shadow-sm">
      <nav class="w-full px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-1">
            <span class="text-2xl">🎯</span>
            <router-link to="/" class="text-xl font-bold text-gray-800 hover:text-gray-600">
              EngTutor
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/words"
              class="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
              active-class="bg-gray-100 text-gray-900"
            >
              📚 Словарь
            </router-link>
            <router-link
              to="/assistant"
              class="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
              active-class="bg-gray-100 text-gray-900"
            >
              💬 Ассистент
            </router-link>
            <router-link
              to="/practice"
              class="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
              active-class="bg-gray-100 text-gray-900"
            >
              🎮 Практика
            </router-link>
            <router-link
              to="/settings"
              class="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
              active-class="bg-gray-100 text-gray-900"
            >
              ⚙️ Настройки
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="w-full">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Основной компонент приложения
</script>
