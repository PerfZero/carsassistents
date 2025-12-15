import { createRouter, createWebHistory } from 'vue-router'
import FormPage from '../views/FormPage.vue'
import QuizPage from '../views/QuizPage.vue'
import ThankYouPage from '../views/ThankYouPage.vue'
import ServiceUnavailablePage from '../views/ServiceUnavailablePage.vue'
import InvalidLinkPage from '../views/InvalidLinkPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'form',
      component: FormPage
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizPage
    },
    {
      path: '/thank-you',
      name: 'thank-you',
      component: ThankYouPage
    },
    {
      path: '/unavailable',
      name: 'unavailable',
      component: ServiceUnavailablePage
    },
    {
      path: '/invalid-link',
      name: 'invalid-link',
      component: InvalidLinkPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'form' || to.name === 'quiz' || to.name === 'thank-you') {
    const dealerId = to.query.dealer_id
    
    if (!dealerId) {
      if (to.name === 'form') {
        return next({ name: 'invalid-link' })
      }
    }
  }
  
  next()
})

export default router

