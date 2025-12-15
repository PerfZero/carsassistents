<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-white">
    <div class="w-full max-w-md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h1 class="mb-8 font-gt-walsheim font-bold text-[36px] leading-[130%] text-center text-[#204a8a]">АП Сервис</h1>
        
        <input type="hidden" name="dealer_id" :value="dealerId" />
        
        <FormInput
          v-model="formData.lastName"
          label="Фамилия"
          placeholder="Фамилия"
          type="text"
          :touched="touched.lastName"
          :error="errors.lastName"
          error-message="Заполните фамилию"
          @input="handleInput('lastName')"
          @blur="handleBlur('lastName')"
        />

        <FormInput
          v-model="formData.firstName"
          label="Имя"
          placeholder="Имя"
          type="text"
          :touched="touched.firstName"
          :error="errors.firstName"
          error-message="Заполните имя"
          @input="handleInput('firstName')"
          @blur="handleBlur('firstName')"
        />

        <FormInput
          v-model="formData.middleName"
          label="Отчество (если есть)"
          placeholder="Отчество"
          type="text"
        />

        <FormInput
          v-model="formData.phone"
          label="Номер телефона"
          placeholder="+7 (999) 999 99 99"
          type="tel"
          :touched="touched.phone"
          :error="errors.phone"
          error-message="Заполните номер телефона"
          :use-mask="true"
          @input="handleInput('phone')"
          @blur="handleBlur('phone')"
        />

        <div class="flex items-start">
          <label class="relative flex start justify-start cursor-pointer">
            <input
              v-model="formData.agree"
              type="checkbox"
              required
              @change="handleAgreeChange"
              class="sr-only"
            />
            <div
              class="w-5 h-5 shrink-0 rounded border-2 transition-all duration-200 flex items-center justify-center mr-2 mt-1"
              :class="formData.agree ? 'bg-[#204A8A] border-[#204A8A]' : touched.agree && errors.agree ? 'border-red-500 bg-white' : 'border-gray-300 bg-white'"
            >
              <svg
                v-if="formData.agree"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.4107 9.41073C4.73614 9.0853 5.26378 9.0853 5.58922 9.41073L8.92255 12.7441C9.24798 13.0695 9.24798 13.5971 8.92255 13.9226C8.59711 14.248 8.06947 14.248 7.74404 13.9226L4.4107 10.5892C4.08527 10.2638 4.08527 9.73617 4.4107 9.41073Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.5893 6.07742C15.9147 6.40286 15.9147 6.9305 15.5893 7.25593L8.92259 13.9226C8.59715 14.248 8.06951 14.248 7.74408 13.9226C7.41864 13.5972 7.41864 13.0695 7.74408 12.7441L14.4107 6.07742C14.7362 5.75198 15.2638 5.75198 15.5893 6.07742Z"
                  fill="white"
                />
              </svg>
            </div>
            <span class="text-base">
              Я даю свое согласие на обработку и использование персональных данных
            </span>
          </label>
        </div>

        <button
          type="submit"
          class="w-full py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style="background-color: #204A8A;"
        >
          Продолжить
        </button>

        <div class="text-center">
          <button
            type="button"
            @click="openPrivacyModal"
            class="underline text-base text-[#204a8a]"
          >
            Ознакомиться с политикой обработки персональных данных
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import { useSurvey } from '@/composables/useSurvey.js'

const router = useRouter()
const route = useRoute()
const openPrivacyModal = inject('openPrivacyModal', () => {})
const { setFormData } = useSurvey()

const dealerId = computed(() => {
  return route.query.dealer_id || null
})

const formData = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  phone: '',
  agree: false
})

const errors = ref({
  lastName: false,
  firstName: false,
  phone: false,
  agree: false
})

const touched = ref({
  lastName: false,
  firstName: false,
  phone: false,
  agree: false
})

const validateField = (fieldName) => {
  console.log('validateField:', { fieldName, formData: formData.value })
  
  if (fieldName === 'lastName') {
    errors.value.lastName = !formData.value.lastName.trim()
    console.log('validateField lastName:', { error: errors.value.lastName })
  } else if (fieldName === 'firstName') {
    errors.value.firstName = !formData.value.firstName.trim()
    console.log('validateField firstName:', { error: errors.value.firstName })
  } else if (fieldName === 'phone') {
    const phoneDigits = formData.value.phone.replace(/\D/g, '')
    errors.value.phone = !phoneDigits || phoneDigits.length !== 10
    console.log('validateField phone:', { 
      phone: formData.value.phone, 
      phoneDigits, 
      error: errors.value.phone 
    })
  } else if (fieldName === 'agree') {
    errors.value.agree = !formData.value.agree
    console.log('validateField agree:', { error: errors.value.agree })
  }
}

const handleInput = (fieldName) => {
  console.log('handleInput:', { fieldName, value: formData.value[fieldName] })
  touched.value[fieldName] = true
  validateField(fieldName)
}

const handleBlur = (fieldName) => {
  console.log('handleBlur:', { fieldName, value: formData.value[fieldName] })
  touched.value[fieldName] = true
  validateField(fieldName)
}

const handleAgreeChange = () => {
  console.log('handleAgreeChange:', { agree: formData.value.agree })
  touched.value.agree = true
  validateField('agree')
}

const validateForm = () => {
  console.log('validateForm: начало валидации')
  Object.keys(touched.value).forEach(key => {
    touched.value[key] = true
  })
  
  validateField('lastName')
  validateField('firstName')
  validateField('phone')
  validateField('agree')
  
  const isValid = !errors.value.lastName && !errors.value.firstName && !errors.value.phone && !errors.value.agree
  console.log('validateForm: результат', { 
    isValid, 
    errors: errors.value 
  })
  
  return isValid
}

const handleSubmit = () => {
  console.log('handleSubmit: отправка формы', { formData: formData.value })
  if (validateForm()) {
    setFormData({
      lastName: formData.value.lastName,
      firstName: formData.value.firstName,
      middleName: formData.value.middleName || null,
      phone: formData.value.phone,
      dealer_id: dealerId.value
    })
    console.log('handleSubmit: форма валидна, переход на /quiz')
    router.push({
      path: '/quiz',
      query: { dealer_id: dealerId.value }
    })
  } else {
    console.log('handleSubmit: форма невалидна')
  }
}
</script>

