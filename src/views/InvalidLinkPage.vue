<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-md text-center">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <svg
            class="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-4">Некорректная ссылка</h1>
        <p class="text-gray-600 mb-8">
          Обратитесь к менеджеру салона
        </p>
        <button
          @click="goHome"
          class="px-6 py-2 bg-[#015340] text-white rounded-lg font-medium hover:bg-[#014030] transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>




