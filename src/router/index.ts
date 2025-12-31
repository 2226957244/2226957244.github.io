import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Chat from '@/pages/Chat.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/chat', name: 'Chat', component: Chat }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

