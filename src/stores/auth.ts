import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 恢复初始状态
  const user = ref<any>(null)
  try {
    const raw = localStorage.getItem('user')
    if (raw) user.value = JSON.parse(raw)
  } catch (e) {
    // 如果解析失败，清除存储
    localStorage.removeItem('user')
    user.value = null
  }

  const token = ref<string | null>(localStorage.getItem('token'))

  function setUser(u: any) {
    user.value = u
    try {
      localStorage.setItem('user', JSON.stringify(u))
    } catch (e) {
      console.warn('setUser: failed to persist user', e)
    }
  }
  function setToken(t: string | null) {
    token.value = t
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { user, token, setUser, setToken, logout }
})

