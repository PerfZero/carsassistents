<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4 font-sans" style="font-family: Verdana, sans-serif;">
    <div class="w-full max-w-[640px]">
        <div class="mb-8">
        <div class="flex justify-between items-center gap-2 py-4 max-w-[360px]">
          <template v-for="(question, index) in questionsList" :key="index">
            <div
              v-if="index === currentQuestion"
              class="rounded-full flex items-center justify-center bg-[#204A8A] px-2 py-0.5 w-6 h-6"
            >
              <span class="text-white font-bold text-[11px] leading-[1.5em]">{{ index + 1 }}</span>
            </div>
            <div
              v-else-if="index === questionsList.length - 1"
              class="rounded-full flex items-center justify-center border border-[#204A8A] px-2 py-0.5 w-6 h-6"
            >
              <span class="font-bold text-[11px] text-[#204A8A] leading-[1.5em]">{{ index + 1 }}</span>
            </div>
            <div
              v-else
              class="rounded-full border border-[#204A8A] w-1.5 h-1.5"
              :class="index < currentQuestion ? 'bg-[#204A8A]' : ''"
            ></div>
          </template>
        </div>
      </div>

      <div class="space-y-8">
        <div class="space-y-4">
          <h2 class="text-[24px] font-normal leading-[1.333] text-[#272827]">{{ questionsList[currentQuestion].question }}</h2>
        </div>
        
        <div class="rounded-lg p-6 space-y-4 bg-[#E5F0FF]">
          <label
            v-for="(option, index) in questionsList[currentQuestion].options"
            :key="index"
            class="flex items-center gap-3 cursor-pointer w-[592px] mb-6  w-full" 
          >
            <div class="relative flex items-center justify-center w-5 h-5 shrink-0">
              <input
                :checked="answers[currentQuestion] === index"
                @change="handleAnswerChange(index)"
                type="radio"
                :value="index"
                class="absolute w-5 h-5 opacity-0 cursor-pointer bg-white"
              />
              <div
                class="w-5 h-5 rounded-full flex items-center justify-center transition-all bg-white"
                :class="answers[currentQuestion] === index ? 'border-[5px] border-[#204A8A]' : 'border border-[#474A51]'"
              ></div>
            </div>
            <span class="text-[18px] font-normal text-[#272827] leading-[1.222em] text-balance">{{ option }}</span>
          </label>
        </div>

        <div >
          <button
            v-if="currentQuestion < questionsList.length - 1"
            @click="nextQuestion"
            :disabled="answers[currentQuestion] === null"
            class="rounded-full font-bold text-[13px] leading-[1.692] disabled:cursor-not-allowed transition-opacity px-8 py-2.5 w-[250px] h-[52px]"
            :class="answers[currentQuestion] === null ? 'bg-[#EEEEEC] text-[#B0B3AB]' : 'bg-[#204A8A] text-white cursor-pointer'"
          >
            Следующий вопрос
          </button>
          <button
            v-else
            @click="submitQuiz"
            :disabled="answers[currentQuestion] === null || isLoading"
            class="rounded-full font-bold text-[13px] leading-[1.692] disabled:cursor-not-allowed transition-opacity px-8 py-2.5 w-[250px] h-[52px]"
            :class="answers[currentQuestion] === null || isLoading ? 'bg-[#EEEEEC] text-[#B0B3AB]' : 'bg-[#204A8A] text-white'"
          >
            {{ isLoading ? 'Отправка...' : 'Завершить опрос' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { questions } from '@/config/questions.js'
import { useSurvey } from '@/composables/useSurvey.js'
import { submitSurveyResults } from '@/services/api.js'

const router = useRouter()
const route = useRoute()
const { answers, setAnswer, formatResultsFor1C, formData } = useSurvey()

const dealerId = computed(() => {
  return route.query.dealer_id || formData.value.dealer_id
})

const currentQuestion = ref(0)
const questionsList = ref(questions)
const isLoading = ref(false)

const nextQuestion = () => {
  if (currentQuestion.value < questionsList.value.length - 1) {
    currentQuestion.value++
  }
}

const handleAnswerChange = (answerIndex) => {
  setAnswer(currentQuestion.value, answerIndex)
}

const submitQuiz = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    const data = formatResultsFor1C()
    const result = await submitSurveyResults(data)
    
    if (result.success) {
      router.push({
        path: '/thank-you',
        query: { dealer_id: dealerId.value }
      })
    } else if (result.code === 'SERVER_ERROR' || result.code === 'TIMEOUT') {
      router.push('/unavailable')
    } else {
      router.push('/unavailable')
    }
  } catch (error) {
    console.error('Error submitting quiz:', error)
    router.push('/unavailable')
  } finally {
    isLoading.value = false
  }
}
</script>


