import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/pages/Explore.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/pages/About.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router