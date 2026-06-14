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
    path: '/item/:id',
    name: 'item',
    component: () => import('@/views/pages/Item.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/pages/About.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@/views/pages/Download.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/pages/Dashboard.vue'),
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