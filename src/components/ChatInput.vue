<template>
  <div class="chat-input-container">
    <div class="input-wrapper">
      <!-- 工具栏 -->
      <div class="input-toolbar">
        <el-tooltip content="上传文件" placement="top">
          <el-icon class="toolbar-icon" @click="handleUpload">
            <UploadFilled />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="图片" placement="top">
          <el-icon class="toolbar-icon" @click="handleImage">
            <Picture />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="链接" placement="top">
          <el-icon class="toolbar-icon" @click="handleLink">
            <Link />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="代码块" placement="top">
          <el-icon class="toolbar-icon" @click="handleCode">
            <DocumentChecked />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="表格" placement="top">
          <el-icon class="toolbar-icon" @click="handleTable">
            <Grid />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="语音输入" placement="top">
          <el-icon class="toolbar-icon voice-icon" :class="{ active: isRecording }" @click="toggleVoice">
            <Microphone />
          </el-icon>
        </el-tooltip>
      </div>
      
      <!-- 输入区域 -->
      <el-input
        v-model="inputMessage"
        type="textarea"
        placeholder="请输入您的问题...\n\n支持 Ctrl+Enter 发送消息"
        :rows="1"
        resize="none"
        @input="handleInput"
        @keyup.enter="handleEnter"
        @keydown.enter.prevent="handleEnterKey"
        ref="inputRef"
      />
      
      <!-- 输入操作栏 -->
      <div class="input-actions">
        <div class="input-info">
          <span class="word-count">{{ inputMessage.length }} / 2000</span>
        </div>
        <div class="action-buttons">
          <el-button type="default" size="small" @click="clearInput">清空</el-button>
          <el-button type="primary" size="small" @click="sendMessage" :disabled="!inputMessage.trim() || sending">
            <el-icon v-if="sending"><Loading /></el-icon>
            发送
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 上传文件对话框 -->
    <el-dialog title="上传文件" :visible.sync="uploadVisible" width="500px">
      <el-upload
        drag
        action="#"
        :multiple="true"
        :limit="5"
        :on-change="handleFileChange"
        :auto-upload="false"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            支持上传 {{ allowedFileTypes.join(', ') }} 等文件，单个文件不超过 {{ maxFileSize / 1024 / 1024 }}MB，最多上传 5 个文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload">确认上传</el-button>
      </template>
    </el-dialog>
    
    <!-- 语音输入提示 -->
    <div class="voice-recording" v-if="isRecording">
      <div class="recording-icon">
        <el-icon class="microphone-icon"><Microphone /></el-icon>
        <div class="recording-animation"></div>
      </div>
      <div class="recording-text">
        <div>正在录音...</div>
        <div class="recording-hint">点击麦克风图标结束录音</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { ElMessage, ElInput, UploadFile } from 'element-plus';
import { 
  UploadFilled, 
  Picture, 
  Link, 
  DocumentChecked, 
  Grid, 
  Microphone, 
  Loading,
  Delete
} from '@element-plus/icons-vue';

const emit = defineEmits<{
  (e: 'send', content: string): void;
  (e: 'upload', files: File[]): void;
}>();

const inputMessage = ref('');
const inputRef = ref<InstanceType<typeof ElInput> | null>(null);
const sending = ref(false);
const uploadVisible = ref(false);
const isRecording = ref(false);
const selectedFiles = ref<File[]>([]);

// 输入配置
const MAX_INPUT_LENGTH = 2000;
const maxFileSize = 10 * 1024 * 1024; // 10MB
const allowedFileTypes = ['图片', '文档', '音频', '视频', '压缩包'];

// 处理输入变化，自动调整高度
const handleInput = () => {
  if (inputMessage.value.length > MAX_INPUT_LENGTH) {
    inputMessage.value = inputMessage.value.slice(0, MAX_INPUT_LENGTH);
    ElMessage.warning(`输入内容不能超过 ${MAX_INPUT_LENGTH} 个字符`);
  }
  
  // 自动调整输入框高度
  nextTick(() => {
    if (inputRef.value) {
      const textarea = inputRef.value.$el.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
      }
    }
  });
};

// 处理 Enter 键
const handleEnter = (e: KeyboardEvent) => {
  if (e.ctrlKey && !e.shiftKey) {
    sendMessage();
  }
};

// 处理 Enter 键按下事件（阻止默认行为）
const handleEnterKey = (e: KeyboardEvent) => {
  if (!e.ctrlKey) {
    // 允许 Shift+Enter 换行
    return;
  }
};

// 发送消息
const sendMessage = () => {
  const content = inputMessage.value.trim();
  if (!content) return;
  
  try {
    sending.value = true;
    emit('send', content);
    inputMessage.value = '';
    
    // 重置输入框高度
    nextTick(() => {
      if (inputRef.value) {
        const textarea = inputRef.value.$el.querySelector('textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = 'auto';
        }
      }
    });
  } finally {
    sending.value = false;
  }
};

// 清空输入
const clearInput = () => {
  inputMessage.value = '';
  
  // 重置输入框高度
  nextTick(() => {
    if (inputRef.value) {
      const textarea = inputRef.value.$el.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  });
};

// 处理上传
const handleUpload = () => {
  uploadVisible.value = true;
};

// 处理文件变化
const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    // 检查文件大小
    if (uploadFile.raw.size > maxFileSize) {
      ElMessage.error(`文件 ${uploadFile.name} 超过 ${maxFileSize / 1024 / 1024}MB 限制`);
      return;
    }
    
    selectedFiles.value.push(uploadFile.raw);
  }
};

// 确认上传
const confirmUpload = () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning('请选择文件');
    return;
  }
  
  emit('upload', selectedFiles.value);
  selectedFiles.value = [];
  uploadVisible.value = false;
  ElMessage.success('文件上传成功');
};

// 处理图片
const handleImage = () => {
  ElMessage.info('图片功能开发中');
};

// 处理链接
const handleLink = () => {
  ElMessage.info('链接功能开发中');
};

// 处理代码块
const handleCode = () => {
  const codeTemplate = '```\n\n```';
  inputMessage.value += codeTemplate;
  handleInput();
  
  // 将光标定位到代码块中间
  nextTick(() => {
    if (inputRef.value) {
      const textarea = inputRef.value.$el.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        const position = inputMessage.value.lastIndexOf(codeTemplate) + 4;
        textarea.focus();
        textarea.setSelectionRange(position, position);
      }
    }
  });
};

// 处理表格
const handleTable = () => {
  ElMessage.info('表格功能开发中');
};

// 切换语音输入
const toggleVoice = () => {
  isRecording.value = !isRecording.value;
  
  if (isRecording.value) {
    ElMessage.success('开始录音');
    // 这里可以添加实际的语音识别逻辑
  } else {
    ElMessage.success('录音结束');
    // 这里可以添加处理语音识别结果的逻辑
    simulateVoiceRecognition();
  }
};

// 模拟语音识别
const simulateVoiceRecognition = () => {
  // 模拟语音识别结果
  const voiceResult = '你好，我是开悟AI助手，有什么可以帮助您的吗？';
  inputMessage.value += voiceResult;
  handleInput();
  ElMessage.success('语音识别完成');
};
</script>

<style lang="scss" scoped>
.chat-input-container {
  position: relative;
  background-color: $background-light;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  .input-wrapper {
    background-color: $white;
    border-radius: 16px;
    border: 2px solid $border-light;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
    }
  }

  .input-toolbar {
    display: flex;
    gap: 12px;
    padding: 8px 12px 4px;
    border-bottom: 1px solid $border-light;

    .toolbar-icon {
      font-size: 20px;
      color: $text-secondary;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        color: $primary-color;
        background-color: $primary-light;
      }

      &.voice-icon {
        &.active {
          color: $danger-color;
          background-color: rgba(255, 77, 79, 0.1);
        }
      }
    }
  }

  .el-input {
    padding: 0 12px;

    &__inner {
      font-size: 15px;
      border: none;
      border-radius: 0;
      min-height: 44px;
      max-height: 180px;
      line-height: 1.5;
      resize: none;
      padding: 8px 0;
      overflow-y: auto;

      &:focus {
        box-shadow: none;
      }
    }

    textarea {
      font-size: 15px;
      resize: none;
      overflow-y: auto;
      line-height: 1.5;
      min-height: 44px;
      max-height: 180px;
      padding: 8px 0;
    }
  }

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px 8px;
    border-top: 1px solid $border-light;

    .input-info {
      .word-count {
        font-size: 13px;
        color: $text-secondary;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      .el-button {
        font-size: 14px;
        padding: 6px 16px;
        border-radius: 20px;
        min-width: 80px;
      }

      .el-button--default {
        &:hover {
          background-color: $border-light;
        }
      }

      .el-button--primary {
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);

        &:hover {
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
    }
  }

  // 语音录音提示
  .voice-recording {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100%;
    margin-bottom: 16px;
    background-color: rgba(0, 0, 0, 0.8);
    color: $white;
    padding: 16px 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 100;

    .recording-icon {
      position: relative;
      width: 48px;
      height: 48px;

      .microphone-icon {
        font-size: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: $danger-color;
        z-index: 2;
      }

      .recording-animation {
        width: 100%;
        height: 100%;
        border: 2px solid $danger-color;
        border-radius: 50%;
        animation: pulse 1.5s infinite ease-out;
      }
    }

    .recording-text {
      display: flex;
      flex-direction: column;
      gap: 4px;

      > div:first-child {
        font-size: 16px;
        font-weight: 500;
      }

      .recording-hint {
        font-size: 13px;
        opacity: 0.8;
      }
    }
  }
}

// 录音动画
@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chat-input-container {
    padding: 12px;

    .input-toolbar {
      gap: 8px;

      .toolbar-icon {
        font-size: 18px;
        padding: 4px;
      }
    }

    .el-input {
      padding: 0 10px;

      &__inner {
        font-size: 14px;
        min-height: 40px;
        max-height: 150px;
      }

      textarea {
        font-size: 14px;
        min-height: 40px;
        max-height: 150px;
      }
    }

    .input-actions {
      padding: 4px 10px 6px;

      .action-buttons {
        gap: 8px;

        .el-button {
          font-size: 13px;
          padding: 5px 12px;
          min-width: 70px;
        }
      }
    }

    .voice-recording {
      flex-direction: column;
      padding: 12px 16px;
      text-align: center;

      .recording-icon {
        width: 40px;
        height: 40px;

        .microphone-icon {
          font-size: 20px;
        }
      }

      .recording-text {
        > div:first-child {
          font-size: 14px;
        }

        .recording-hint {
          font-size: 12px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .chat-input-container {
    padding: 8px;

    .input-toolbar {
      overflow-x: auto;
      padding: 8px 8px 4px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .el-input {
      padding: 0 8px;
    }

    .input-actions {
      padding: 4px 8px 6px;

      .input-info {
        display: none;
      }

      .action-buttons {
        justify-content: flex-end;
        width: 100%;
      }
    }
  }
}
</style>
