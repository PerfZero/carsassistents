import { ref } from 'vue'
import { questions } from '@/config/questions.js'

const PRODUCTS = ['Автодруг', 'Независимая Гарантия', 'ПитСтоп', 'CAR GARANT']
const MAX_SCORE = 9

const formData = ref({
  surname: '',
  name: '',
  patronymic: null,
  phone: '',
  dealer_id: null
})

const answers = ref(Array(questions.length).fill(null))

export function useSurvey() {
  const setFormData = (data) => {
    formData.value = {
      surname: data.lastName || '',
      name: data.firstName || '',
      patronymic: data.middleName || null,
      phone: data.phone || '',
      dealer_id: data.dealer_id || null
    }
  }

  const setAnswer = (questionIndex, answerIndex) => {
    answers.value[questionIndex] = answerIndex
  }

  const calculateProductScores = () => {
    const scores = {
      'Автодруг': 0,
      'Независимая Гарантия': 0,
      'ПитСтоп': 0,
      'CAR GARANT': 0
    }

    answers.value.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== null && questions[questionIndex]) {
        const question = questions[questionIndex]
        PRODUCTS.forEach(product => {
          if (question.scores[product] && question.scores[product][answerIndex] !== undefined) {
            scores[product] += question.scores[product][answerIndex]
          }
        })
      }
    })

    return scores
  }

  const calculatePriorities = (scores) => {
    const productsWithScores = PRODUCTS.map(productName => ({
      productName,
      score: scores[productName]
    }))

    productsWithScores.sort((a, b) => b.score - a.score)

    return productsWithScores.map((item, index) => ({
      ...item,
      priority: index + 1
    }))
  }

  const calculatePercentages = (productsWithScores) => {
    return productsWithScores.map(item => ({
      ...item,
      scorePercent: Math.round((item.score / MAX_SCORE) * 100)
    }))
  }

  const formatResultsFor1C = () => {
    const scores = calculateProductScores()
    const productsWithPriorities = calculatePriorities(scores)
    const results = calculatePercentages(productsWithPriorities)

    const patronymic = formData.value.patronymic && formData.value.patronymic.trim() 
      ? formData.value.patronymic.trim() 
      : null

    return {
      surveyDate: new Date().toISOString(),
      dealer_id: parseInt(formData.value.dealer_id) || 0,
      client: {
        surname: formData.value.surname,
        name: formData.value.name,
        patronymic: patronymic,
        phone: formData.value.phone
      },
      results: results.map(item => ({
        priority: item.priority,
        productName: item.productName,
        scorePercent: item.scorePercent
      }))
    }
  }

  const reset = () => {
    formData.value = {
      surname: '',
      name: '',
      patronymic: null,
      phone: '',
      dealer_id: null
    }
    answers.value = Array(questions.length).fill(null)
  }

  return {
    formData,
    answers,
    setFormData,
    setAnswer,
    calculateProductScores,
    formatResultsFor1C,
    reset
  }
}

