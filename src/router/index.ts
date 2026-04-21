import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/index.vue'
import Test from '@/views/Demo/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/demo',
      name: 'test',
      component: Test
    },
    {
      path: '/loan',
      name: 'loan',
      component: () => import('@/views/Loan/index.vue')
    },
  ]
})

export default router
