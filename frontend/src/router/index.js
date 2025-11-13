import { createRouter, createWebHistory } from 'vue-router'
import Words from '../views/Words.vue'
import Practice from '../views/Practice.vue'
import Assistant from '../views/Assistant.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/words',
  },
  {
    path: '/words',
    name: 'Words',
    component: Words,
  },
  {
    path: '/practice',
    name: 'Practice',
    component: Practice,
  },
  {
    path: '/assistant',
    name: 'Assistant',
    component: Assistant,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

