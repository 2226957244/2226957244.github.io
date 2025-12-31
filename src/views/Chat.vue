<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h3>历史聊天</h3>
        <el-button type="primary" size="small" @click="newChat">
          <el-icon><Plus /></el-icon> 新建聊天
        </el-button>
      </div>
      <div class="chat-history">
        <div 
          v-for="chat in chatHistory" 
          :key="chat.id"
          class="history-item"
          :class="{ active: currentChatId === chat.id }"
          @click="switchChat(chat.id)"
        >
          <div class="history-preview">{{ chat.preview }}</div>
          <div class="history-time">{{ formatHistoryTime(chat.timestamp) }}</div>
        </div>
      </div>
    </div>
    
    <div class="chat-main">
      <div class="chat-header">
        <h2>开悟 AI 助手</h2>
        <div class="chat-actions">
          <el-button type="text" @click="clearChat">
            <el-icon><Delete /></el-icon> 清空聊天
          </el-button>
          <el-button type="text" @click="exportChat">
            <el-icon><Download /></el-icon> 导出聊天
          </el-button>
          <el-dropdown trigger="click">
            <el-button type="text">
              <el-icon><Setting /></el-icon> 设置
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item divided>深色模式</el-dropdown-item>
                <el-dropdown-item divided>消息通知</el-dropdown-item>
                <el-dropdown-item divided>清除缓存</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <ChatMessage 
          v-for="message in currentMessages" 
          :key="message.id" 
          :message="message"
          @resend="resendMessage"
        />
        
        <!-- 加载状态 -->
        <div class="loading-state" v-if="loading">
          <div class="loading-content">
            <el-avatar :size="44" :src="aiAvatar" />
            <div class="loading-text">
              <el-skeleton :rows="3" animated style="margin-top: 8px;" />
              <el-skeleton :rows="2" animated style="margin-top: 12px;" />
            </div>
          </div>
        </div>
        
        <!-- 空聊天状态 -->
        <div class="empty-state" v-if="!currentMessages.length && !loading">
          <div class="empty-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="empty-title">开始对话</div>
          <div class="empty-subtitle">你可以向我提问任何问题，我会尽力为你解答</div>
          <div class="empty-suggestions">
            <el-button type="primary" size="small" @click="sendSuggestion('你好，我是开悟AI助手')">你好</el-button>
            <el-button type="primary" size="small" @click="sendSuggestion('什么是人工智能？')">什么是人工智能？</el-button>
            <el-button type="primary" size="small" @click="sendSuggestion('如何学习编程？')">如何学习编程？</el-button>
          </div>
        </div>
      </div>
      
      <ChatInput @send="handleSend" @upload="handleUpload" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { ElMessage, ElConfirm } from 'element-plus';
import { 
  Plus, 
  Delete, 
  Download, 
  Setting, 
  ArrowDown,
  ChatDotRound
} from '@element-plus/icons-vue';
import ChatMessage from '../components/ChatMessage.vue';
import ChatInput from '../components/ChatInput.vue';
import { chat } from '../api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  liked?: boolean;
  bookmarked?: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

interface ChatHistory {
  id: string;
  preview: string;
  timestamp: string;
  messages: Message[];
}

const messages = ref<Message[]>([]);
const chatHistory = ref<ChatHistory[]>([]);
const currentChatId = ref<string>('');
const loading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const aiAvatar = 'https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=44&h=44&fit=crop&crop=faces';

// 当前聊天的消息
const currentMessages = computed(() => {
  if (!currentChatId.value) return [];
  const chat = chatHistory.value.find(c => c.id === currentChatId.value);
  return chat ? chat.messages : [];
});

// 页面加载时，初始化聊天历史
onMounted(() => {
  // 模拟加载聊天历史
  loadChatHistory();
  
  // 如果没有聊天记录，创建一个新的聊天
  if (chatHistory.value.length === 0) {
    newChat();
  } else {
    // 切换到最新的聊天
    switchChat(chatHistory.value[0].id);
  }
});

// 加载聊天历史
const loadChatHistory = () => {
  // 这里可以从localStorage或API加载聊天历史
  // 模拟数据
  const mockHistory: ChatHistory = {
    id: Date.now().toString(),
    preview: '你好！我是开悟AI助手，有什么可以帮助你的吗？',
    timestamp: new Date().toISOString(),
    messages: []
  };
  chatHistory.value.push(mockHistory);
};

// 新建聊天
const newChat = () => {
  // 如果当前聊天有消息，保存到历史记录
  if (currentChatId.value && currentMessages.value.length > 0) {
    saveChatToHistory();
  }
  
  // 创建新的聊天
  const newChat: ChatHistory = {
    id: Date.now().toString(),
    preview: '',
    timestamp: new Date().toISOString(),
    messages: []
  };
  
  // 添加到聊天历史顶部
  chatHistory.value.unshift(newChat);
  
  // 切换到新聊天
  currentChatId.value = newChat.id;
  
  // 添加欢迎消息
  const welcomeMessage: Message = {
    id: Date.now().toString(),
    role: 'assistant',
    content: '你好！我是开悟AI助手，有什么可以帮助你的吗？',
    timestamp: new Date().toISOString()
  };
  newChat.messages.push(welcomeMessage);
  
  scrollToBottom();
};

// 切换聊天
const switchChat = (chatId: string) => {
  // 如果当前聊天有消息，保存到历史记录
  if (currentChatId.value && currentMessages.value.length > 0) {
    saveChatToHistory();
  }
  
  // 切换到指定聊天
  currentChatId.value = chatId;
  scrollToBottom();
};

// 保存聊天到历史记录
const saveChatToHistory = () => {
  if (!currentChatId.value) return;
  
  const chatIndex = chatHistory.value.findIndex(c => c.id === currentChatId.value);
  if (chatIndex === -1) return;
  
  // 更新聊天记录的预览和时间
  const chat = chatHistory.value[chatIndex];
  if (chat.messages.length > 0) {
    chat.preview = chat.messages[chat.messages.length - 1].content;
    chat.timestamp = chat.messages[chat.messages.length - 1].timestamp;
  }
  
  // 将当前聊天移到历史记录顶部
  chatHistory.value.splice(chatIndex, 1);
  chatHistory.value.unshift(chat);
};

// 发送消息
const handleSend = async (content: string) => {
  if (!content.trim()) return;
  
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: content.trim(),
    timestamp: new Date().toISOString(),
    status: 'sending'
  };
  
  // 添加到当前聊天
  if (currentChatId.value) {
    const chat = chatHistory.value.find(c => c.id === currentChatId.value);
    if (chat) {
      chat.messages.push(userMessage);
    }
  }
  
  // 滚动到底部
  await nextTick();
  scrollToBottom();
  
  // 更新用户消息状态为已发送
  userMessage.status = 'sent';
  
  // 发送请求获取AI回复
  try {
    loading.value = true;
    const response = await chat(content.trim());
    
    // 添加AI回复
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString()
    };
    
    // 添加到当前聊天
    if (currentChatId.value) {
      const chat = chatHistory.value.find(c => c.id === currentChatId.value);
      if (chat) {
        chat.messages.push(aiMessage);
      }
    }
    
    // 滚动到底部
    await nextTick();
    scrollToBottom();
  } catch (error: any) {
    // 更新用户消息状态为发送失败
    userMessage.status = 'failed';
    ElMessage.error(error?.message || '获取回复失败，请重试');
    console.error('Chat error:', error);
  } finally {
    loading.value = false;
  }
};

// 重新发送消息
const resendMessage = async (messageId: string) => {
  const message = currentMessages.value.find(m => m.id === messageId);
  if (!message || message.role !== 'user') return;
  
  // 更新消息状态为发送中
  message.status = 'sending';
  
  // 发送请求获取AI回复
  try {
    const response = await chat(message.content);
    
    // 添加AI回复
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString()
    };
    
    // 添加到当前聊天
    if (currentChatId.value) {
      const chat = chatHistory.value.find(c => c.id === currentChatId.value);
      if (chat) {
        // 找到用户消息的索引
        const userMessageIndex = chat.messages.findIndex(m => m.id === messageId);
        // 如果有后续的AI消息，删除它
        if (userMessageIndex < chat.messages.length - 1 && chat.messages[userMessageIndex + 1].role === 'assistant') {
          chat.messages.splice(userMessageIndex + 1, 1);
        }
        // 添加新的AI消息
        chat.messages.push(aiMessage);
      }
    }
    
    // 更新用户消息状态为已发送
    message.status = 'sent';
    
    // 滚动到底部
    await nextTick();
    scrollToBottom();
  } catch (error: any) {
    // 更新用户消息状态为发送失败
    message.status = 'failed';
    ElMessage.error(error?.message || '获取回复失败，请重试');
    console.error('Chat error:', error);
  }
};

// 发送建议问题
const sendSuggestion = (content: string) => {
  handleSend(content);
};

// 处理文件上传
const handleUpload = (files: File[]) => {
  // 这里可以添加文件上传的处理逻辑
  ElMessage.success(`已选择 ${files.length} 个文件`);
  console.log('Uploaded files:', files);
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 清空聊天
const clearChat = () => {
  if (!currentMessages.value.length) return;
  
  ElConfirm('确定要清空当前聊天记录吗？此操作不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (currentChatId.value) {
      const chat = chatHistory.value.find(c => c.id === currentChatId.value);
      if (chat) {
        chat.messages = [];
      }
    }
    ElMessage.success('聊天记录已清空');
  }).catch(() => {
    // 取消清空操作
  });
};

// 导出聊天
const exportChat = () => {
  if (!currentMessages.value.length) {
    ElMessage.warning('当前聊天记录为空，无法导出');
    return;
  }
  
  const chatContent = currentMessages.value.map(msg => {
    const role = msg.role === 'user' ? '用户' : '开悟 AI';
    return `${role}: ${msg.content}\n时间: ${new Date(msg.timestamp).toLocaleString()}\n`;
  }).join('\n');
  
  const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `开悟AI聊天_${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('聊天记录已导出');
};

// 格式化历史记录时间
const formatHistoryTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) { // 1分钟内
    return '刚刚';
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  }
};
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background-color: $white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-sidebar {
  width: 280px;
  background-color: $background-light;
  border-right: 1px solid $border-light;
  display: flex;
  flex-direction: column;
  
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid $border-light;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
    }
  }
  
  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    
    .history-item {
      padding: 12px 16px;
      margin-bottom: 4px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: transparent;
      border: 2px solid transparent;
      
      &:hover {
        background-color: $border-light;
      }
      
      &.active {
        background-color: $primary-light;
        border-color: $primary-color;
        color: $primary-color;
      }
      
      .history-preview {
        font-size: 14px;
        color: $text-primary;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .history-time {
        font-size: 12px;
        color: $text-secondary;
      }
      
      &.active {
        .history-preview {
          color: $primary-color;
          font-weight: 500;
        }
        
        .history-time {
          color: $primary-color;
        }
      }
    }
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: $white;
    border-bottom: 1px solid $border-light;
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: $text-primary;
    }
    
    .chat-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      
      .el-button {
        color: $text-regular;
        
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background-color: $background-light;
    
    // 自定义滚动条
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background-color: $border-light;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: $primary-light;
      border-radius: 4px;
      
      &:hover {
        background-color: $primary-color;
      }
    }
  }
}

.loading-state {
  padding: 16px;
  background-color: $white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  margin-left: 64px;
}

.loading-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  
  .loading-text {
    flex: 1;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
  
  .empty-icon {
    font-size: 64px;
    color: $primary-light;
    margin-bottom: 16px;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }
  
  .empty-subtitle {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 32px;
  }
  
  .empty-suggestions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    
    .el-button {
      border-radius: 20px;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
    height: calc(100vh - 64px); // 减去顶部导航栏高度
    box-shadow: none;
  }
  
  .chat-sidebar {
    width: 100%;
    height: 120px;
    border-right: none;
    border-bottom: 1px solid $border-light;
    
    .chat-history {
      display: flex;
      overflow-x: auto;
      padding: 8px;
      
      .history-item {
        min-width: 200px;
        margin-right: 8px;
        margin-bottom: 0;
      }
    }
  }
  
  .chat-main {
    flex: 1;
    
    .chat-header {
      padding: 12px 16px;
      
      h2 {
        font-size: 18px;
      }
      
      .chat-actions {
        gap: 8px;
        
        .el-button {
          font-size: 13px;
          padding: 6px 12px;
        }
      }
    }
    
    .chat-messages {
      padding: 16px;
    }
  }
  
  .loading-state {
    margin-left: 52px;
  }
  
  .empty-suggestions {
    flex-direction: column;
    gap: 8px;
    
    .el-button {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .chat-sidebar {
    height: 100px;
    
    .sidebar-header {
      padding: 12px;
      
      h3 {
        font-size: 15px;
      }
      
      .el-button {
        font-size: 12px;
        padding: 5px 10px;
      }
    }
    
    .chat-history {
      padding: 6px;
      
      .history-item {
        min-width: 180px;
        padding: 10px 12px;
        
        .history-preview {
          font-size: 13px;
        }
      }
    }
  }
  
  .chat-main {
    .chat-header {
      padding: 10px 12px;
      
      h2 {
        font-size: 16px;
      }
      
      .chat-actions {
        gap: 6px;
        
        .el-button {
          font-size: 12px;
          padding: 4px 8px;
        }
      }
    }
    
    .chat-messages {
      padding: 12px;
    }
  }
  
  .loading-state {
    margin-left: 52px;
  }
  
  .empty-state {
    padding: 20px;
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    
    .empty-title {
      font-size: 18px;
    }
    
    .empty-subtitle {
      font-size: 13px;
      margin-bottom: 24px;
    }
  }
}
</style>