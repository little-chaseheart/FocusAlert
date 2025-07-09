import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Focus from '@/views/Focus.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [{ path: '', name: 'focus', component: () => import('@/views/Focus.vue') }],
    },
  ],
})

export default router
