<template>
  <el-header class="topnav">
    <div class="container topnav-content">
      <div class="logo" @click="goHome">
        <el-icon><ChatDotRound /></el-icon>
        <span>开悟 AI 助手</span>
      </div>
      
      <!-- 桌面导航 -->
      <nav class="desktop-nav">
        <el-menu mode="horizontal" :default-active="activeNav" @select="handleNavSelect" background-color="transparent" text-color="$text-primary" active-text-color="$primary-color" border-bottom="false">
          <el-menu-item index="home">首页</el-menu-item>
          <el-menu-item index="chat">聊天</el-menu-item>
        </el-menu>
      </nav>
      
      <!-- 操作按钮 -->
      <div class="actions">
        <!-- 登录前 -->
        <template v-if="!auth.user">
          <el-button type="text" @click="goChat">体验</el-button>
          <el-button type="primary" @click="openLogin">登录</el-button>
        </template>
        <!-- 登录后 -->
        <template v-else>
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar size="small" :src="userAvatar">
                {{ auth.user.name?.charAt(0) || '用' }}
              </el-avatar>
              <span class="username">{{ auth.user.name || '用户' }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item divided>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
    
    <!-- 登录对话框 -->
    <el-dialog title="用户登录" :visible.sync="loginVisible" width="400px" :close-on-click-modal="false">
      <el-form :model="form" :rules="loginRules" ref="loginFormRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.remember" size="small">记住我</el-checkbox>
          <el-link type="primary" :underline="false" style="float: right; font-size: 12px">
            忘记密码？
          </el-link>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="loginVisible = false">取消</el-button>
        <el-button type="primary" :loading="loginLoading" @click="onLogin">登录</el-button>
      </template>
    </el-dialog>
  </el-header>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ChatDotRound, ArrowDown, User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loginVisible = ref(false)
const loginLoading = ref(false)
const loginFormRef = ref<FormInstance | null>(null)
const userAvatar = ref('')

const form = reactive({
  username: '',
  password: '',
  remember: false
})

// 登录表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' }
  ]
}

// 激活的导航项
const activeNav = computed(() => {
  return route.name === 'Home' ? 'home' : 'chat'
})

const goHome = () => router.push({ name: 'Home' })
const goChat = () => router.push({ name: 'Chat' })
const openLogin = () => (loginVisible.value = true)

// 导航选择
const handleNavSelect = (key: string) => {
  if (key === 'home') {
    goHome()
  } else if (key === 'chat') {
    goChat()
  }
}

// 登录
const onLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true
    
    // 调用登录API
    const res = await login(form.username, form.password)
    
    // 保存用户信息和token
    auth.setUser(res.user)
    auth.setToken(res.token)
    
    loginVisible.value = false
    ElMessage.success('登录成功')
    
    // 刷新页面或跳转到合适的页面
    router.push({ name: 'Chat' })
    
  } catch (err: any) {
    if (err.name !== 'ElFormValidationError') {
      ElMessage.error(err?.message || '登录失败，请重试')
    }
  } finally {
    loginLoading.value = false
  }
}

// 退出登录
const onLogout = () => {
  auth.logout()
  ElMessage.success('已退出登录')
  router.push({ name: 'Home' })
}

// 页面加载时检查用户信息
onMounted(() => {
  // 可以在这里加载用户头像等信息
})
</script>

<style lang="scss" scoped>
.topnav {
  background-color: $header-bg;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  line-height: 64px;

  .topnav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 600;
    color: $primary-color;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: darken($primary-color, 10%);
    }

    .el-icon {
      font-size: 24px;
    }
  }

  .desktop-nav {
    flex: 1;
    max-width: 600px;
    margin: 0 20px;

    .el-menu {
      border-bottom: none;
      background: transparent;
      height: 64px;
      line-height: 64px;

      .el-menu-item {
        padding: 0 20px;
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        color: $text-regular;
        transition: all 0.3s ease;

        &:hover {
          color: $primary-color;
        }

        &.is-active {
          color: $primary-color;
          font-weight: 500;
          border-bottom: 2px solid $primary-color;
        }
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: $border-light;
    }

    .username {
      font-size: 14px;
      color: $text-primary;
    }

    .arrow-icon {
      font-size: 12px;
      transition: transform 0.3s ease;
    }

    .el-dropdown-selfdefine:focus .arrow-icon {
      transform: rotate(180deg);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .topnav {
    .logo {
      font-size: 18px;
      gap: 6px;

      .el-icon {
        font-size: 20px;
      }
    }

    .desktop-nav {
      display: none;
    }

    .actions {
      .el-button {
        font-size: 13px;
        padding: 6px 12px;
      }

      .user-info {
        .username {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .topnav {
    height: 56px;
    line-height: 56px;

    .logo {
      font-size: 16px;
    }

    .actions {
      gap: 8px;

      .el-button {
        font-size: 12px;
        padding: 4px 8px;
      }
    }
  }
}
</style>
