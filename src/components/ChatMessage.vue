<template>
  <div class="chat-message" :class="message.role">
    <div class="avatar-wrapper">
      <el-avatar :size="44" :src="message.role === 'user' ? userAvatar : aiAvatar" :icon="message.role === 'user' ? User : ChatDotRound">
        {{ message.role === 'user' ? getInitials(userName) : 'AI' }}
      </el-avatar>
      <div class="role-label">{{ message.role === 'user' ? userName : '开悟 AI' }}</div>
    </div>
    
    <div class="message-content-wrapper">
      <div class="message-content" :class="message.role">
        <div class="message-text" v-html="formattedContent"></div>
        <div class="message-footer">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          <div class="message-actions" v-if="message.role === 'assistant'">
            <el-tooltip content="点赞" placement="top">
              <el-icon class="action-icon like-icon" @click="likeMessage">
                <StarFilled v-if="message.liked" />
                <Star v-else />
              </el-icon>
            </el-tooltip>
            <el-tooltip content="收藏" placement="top">
                <el-icon class="action-icon bookmark-icon" @click="bookmarkMessage" :class="{'bookmarked': message.bookmarked}">
                  <CollectionTag />
                </el-icon>
              </el-tooltip>
            <el-tooltip content="复制" placement="top">
              <el-icon class="action-icon copy-icon" @click="copyMessage">
                <CopyDocument />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
      </div>
      
      <!-- 消息状态指示器 -->
      <div class="message-status" v-if="message.role === 'user'">
        <el-icon v-if="message.status === 'sending'" class="loading-icon"><Loading /></el-icon>
        <el-icon v-else-if="message.status === 'failed'" class="failed-icon" @click="resendMessage">
          <WarningFilled />
        </el-icon>
        <el-icon v-else class="success-icon"><CircleCheck /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, ElTooltip, ElIcon } from 'element-plus';
import { 
  User, 
  ChatDotRound, 
  Star, 
  StarFilled, 
  CollectionTag, 
  CopyDocument, 
  Loading, 
  WarningFilled, 
  CircleCheck 
} from '@element-plus/icons-vue';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  liked?: boolean;
  bookmarked?: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

const props = withDefaults(defineProps<{
  message: Message;
}>(), {
  message: () => ({
    id: '',
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
    liked: false,
    bookmarked: false,
    status: 'sent'
  })
});

const emit = defineEmits<{
  (e: 'resend', messageId: string): void;
}>();

// 用户信息
const userName = ref('用户');
const userAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=44&h=44&fit=crop&crop=faces';
const aiAvatar = 'https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=44&h=44&fit=crop&crop=faces';

// 格式化消息内容（简单的HTML处理，可扩展为支持更多格式）
const formattedContent = computed(() => {
  // 简单的换行处理
  return props.message?.content?.replace(/\n/g, '<br>');
});

// 获取用户姓名首字母
const getInitials = (name: string): string => {
  if (!name) return '用';
  return name.charAt(0).toUpperCase();
};

// 格式化时间
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;

  // 超过30天显示具体日期
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

// 点赞消息
const likeMessage = () => {
  // 这里可以添加API调用，实际项目中应该调用后端API更新点赞状态
  const message = { ...props.message };
  message.liked = !message.liked;
  ElMessage.success(message.liked ? '点赞成功' : '取消点赞');
};

// 收藏消息
const bookmarkMessage = () => {
  // 这里可以添加API调用，实际项目中应该调用后端API更新收藏状态
  const message = { ...props.message };
  message.bookmarked = !message.bookmarked;
  ElMessage.success(message.bookmarked ? '收藏成功' : '取消收藏');
};

// 复制消息
const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content);
    ElMessage.success('已复制到剪贴板');
  } catch (err) {
    ElMessage.error('复制失败');
    console.error('复制失败:', err);
  }
};

// 重新发送消息
const resendMessage = () => {
  emit('resend', props.message.id);
};
</script>

<style lang="scss" scoped>
.chat-message {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: flex-start;
  padding: 0 12px;

  &.user {
    flex-direction: row-reverse;

    .avatar-wrapper {
      align-items: flex-end;
    }

    .message-content-wrapper {
      display: flex;
      flex-direction: row-reverse;
      align-items: flex-end;
      gap: 8px;
    }

    .message-content {
      background-color: $primary-color;
      color: $white;
      border-radius: 18px 6px 18px 18px;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);

      .message-footer {
        justify-content: flex-start;

        .message-actions {
          order: -1;
        }
      }

      .message-actions .action-icon {
        color: rgba(255, 255, 255, 0.7);

        &:hover {
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }

  &.assistant {
    flex-direction: row;

    .avatar-wrapper {
      align-items: flex-start;
    }

    .message-content {
      background-color: $background-light;
      color: $text-primary;
      border-radius: 6px 18px 18px 18px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  .avatar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 48px;

    .role-label {
      font-size: 12px;
      color: $text-secondary;
      text-align: center;
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .el-avatar {
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .message-content-wrapper {
    flex: 1;
    max-width: 75%;
  }

  .message-content {
    padding: 14px 18px;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .message-text {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 8px;
      word-wrap: break-word;
      word-break: break-word;

      // 处理代码块样式
      code {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', Consolas, monospace;
        font-size: 14px;
      }

      pre {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 8px 0;

        code {
          background: none;
          padding: 0;
        }
      }
    }

    .message-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      font-size: 12px;

      .message-time {
        color: $user-message-footer;
        opacity: 0.8;
      }

      .message-actions {
        display: flex;
        gap: 16px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    &:hover .message-actions {
      opacity: 1;
    }
  }

  .message-status {
    display: flex;
    align-items: flex-end;
    padding-bottom: 4px;

    .loading-icon {
      color: $primary-color;
      font-size: 14px;
      animation: rotate 1s linear infinite;
    }

    .failed-icon {
      color: $danger-color;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: darken($danger-color, 10%);
      }
    }

    .success-icon {
      color: $success-color;
      font-size: 14px;
    }
  }
}

.action-icon {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: $text-secondary;

  &:hover {
    transform: scale(1.1);
    color: $primary-color;
  }

  &.like-icon {
    &:hover {
      color: $warning-color;
    }
  }

  &.bookmark-icon {
    &:hover {
      color: $primary-color;
    }
    
    &.bookmarked {
      color: $primary-color;
    }
  }

  &.copy-icon {
    &:hover {
      color: $success-color;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-message {
    gap: 12px;
    padding: 0 8px;

    .avatar-wrapper {
      min-width: 40px;

      .el-avatar {
        width: 36px;
        height: 36px;
      }

      .role-label {
        font-size: 11px;
      }
    }

    .message-content-wrapper {
      max-width: 80%;
    }

    .message-content {
      padding: 12px 16px;

      .message-text {
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 480px) {
  .chat-message {
    .message-content-wrapper {
      max-width: 85%;
    }

    .message-content {
      .message-actions {
        opacity: 1;
      }
    }
  }
}
</style>
