<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden">
    <div ref="confettiContainer" class="fixed inset-0 pointer-events-none z-0"></div>
    <div class="w-full max-w-md text-center relative z-10">
      <div class="mb-6">
        <img src="/thanks.svg" alt="Спасибо" class="mx-auto" />
      </div>
      <h1 class="text-2xl font-light">Благодарим за прохождение опроса!</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'

const confettiContainer = ref(null)

onMounted(() => {
  if (confettiContainer.value) {
    lottie.loadAnimation({
      container: confettiContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/Confetti.json'
    })
  }
})
</script>


