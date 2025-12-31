<template>
  <div class="chat container">
    <div class="chat-window" ref="scrollEl">
      <ChatMessage v-for="(m, idx) in messages" :key="idx" :message="m" />
      <div v-if="loading" class="loading-message">
        <el-skeleton :rows="1" animated />
        <el-skeleton :rows="2" animated />
      </div>
    </div>
    <ChatInput :loading="loading" @send="onSend" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'
import { chatReply } from '@/api'

type Msg = { role: string; text: string; time?: string }

const messages = ref<Msg[]>([
  { role: 'assistant', text: '你好！我是 AI 助手，有什么可以帮你？', time: new Date().toISOString() }
])
const loading = ref(false)
const scrollEl = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  const el = scrollEl.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

const onSend = async (text: string) => {
  // 添加用户消息
  const now = new Date().toISOString()
  messages.value.push({ role: 'user', text, time: now })
  loading.value = true
  await scrollToBottom()
  
  try {
    // 调用AI回复
    const reply = await chatReply(text)
    messages.value.push({ role: 'assistant', text: reply, time: new Date().toISOString() })
    await scrollToBottom()
  } catch (err: any) {
    ElMessage.error(err?.message || '请求失败')
  } finally {
    loading.value = false
  }
}

// 页面加载时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-container {
  padding: $spacing-sm;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm;
  background-color: $bg-color;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-sm;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: $border-light;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 3px;
    
    &:hover {
      background: $text-secondary;
    }
  }
}

.loading-message {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background-color: $card-bg;
  border-radius: $border-radius-md;
  max-width: 70%;
}
</style>
