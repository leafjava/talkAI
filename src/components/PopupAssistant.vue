<template>
  <div v-if="isOpen" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-[#1a1a2e] rounded-lg shadow-2xl w-full h-full flex flex-col border-0">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#34495e]">
        <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400">ai智能助手</h2>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Console Info -->
      <div class="px-4 py-3 border-b border-gray-200 dark:border-[#34495e] bg-gray-50 dark:bg-[#16213e]">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            COPILOTKIT DEV CONSOLE (localhost only)
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">Version: latest (1.3.1)</span>
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
          <button class="px-3 py-1 text-xs bg-gray-200 dark:bg-[#34495e] text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-[#2e3b5e] transition-colors">
            Debug
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-[80%] rounded-lg px-4 py-2',
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-[#2e3b5e] text-gray-900 dark:text-gray-100'
            ]"
          >
            {{ msg.text }}
          </div>
        </div>
        
        <!-- 开场白按钮 -->
        <div v-if="showQuickActions" class="space-y-2">
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="(action, index) in quickActions"
              :key="index"
              @click="handleQuickAction(action)"
              class="px-4 py-2.5 bg-white dark:bg-[#2e3b5e] border border-gray-300 dark:border-[#34495e] rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#34495e] transition-colors text-center"
            >
              {{ action }}
            </button>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading && messages[messages.length - 1]?.sender === 'assistant' && !messages[messages.length - 1]?.text" class="flex justify-start">
          <div class="bg-gray-100 dark:bg-[#2e3b5e] text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="border-t border-gray-200 dark:border-[#34495e] p-4">
        <div class="flex items-center gap-2">
          <input
            v-model="message"
            type="text"
            @keypress.enter="!isLoading && handleSend()"
            placeholder="Type a message..."
            :disabled="isLoading"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-[#34495e] rounded-lg bg-white dark:bg-[#16213e] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            @click="handleSend()"
            :disabled="isLoading || !message.trim()"
            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { sendDifyMessageStream } from '@/utils/dify-api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const message = ref('')
const messages = ref([
  { id: 1, text: '需要什么帮助么?', sender: 'assistant' }
])
const isLoading = ref(false)
const userId = ref(`user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`)
const conversationId = ref('')
const assistantMessageId = ref(null)
const messagesContainer = ref(null)

// 开场白按钮选项
const quickActions = [
  '聊天开场白',
]

// 判断是否显示开场白按钮
const showQuickActions = computed(() => !isLoading.value)

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const handleQuickAction = (actionText) => {
  handleSend(actionText)
}

const handleSend = async (customMessage) => {
  const messageToSend = customMessage || message.value.trim()
  if (!messageToSend || isLoading.value) return
  
  const userMessage = messageToSend
  messages.value.push({ id: Date.now(), text: userMessage, sender: 'user' })
  message.value = ''
  isLoading.value = true
  
  // 创建占位符助手消息用于流式输出
  const newAssistantMessageId = Date.now() + 1
  assistantMessageId.value = newAssistantMessageId
  messages.value.push({ 
    id: newAssistantMessageId, 
    text: '', 
    sender: 'assistant' 
  })
  
  try {
    const result = await sendDifyMessageStream(
      userMessage,
      userId.value,
      (chunk) => {
        // 更新助手消息
        messages.value = messages.value.map(msg => {
          if (msg.id === assistantMessageId.value && msg.sender === 'assistant') {
            return { ...msg, text: msg.text + chunk }
          }
          return msg
        })
      },
      conversationId.value
    )
    
    // 保存会话ID以便后续对话
    if (result.conversationId) {
      conversationId.value = result.conversationId
    }
  } catch (error) {
    console.error('Failed to get response from Dify:', error)
    // 更新错误消息
    messages.value = messages.value.map(msg => 
      msg.id === assistantMessageId.value
        ? { ...msg, text: error instanceof Error ? error.message : '发送消息时发生错误，请稍后重试。' }
        : msg
    )
  } finally {
    isLoading.value = false
    assistantMessageId.value = null
  }
}
</script>

<style scoped>
/* 基础样式 */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-\[1000\] {
  z-index: 1000;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-end {
  justify-content: flex-end;
}

.justify-start {
  justify-content: flex-start;
}

.bg-black\/50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.border-0 {
  border-width: 0;
}

.flex-col {
  flex-direction: column;
}

.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-2\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.border-b {
  border-bottom-width: 1px;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-semibold {
  font-weight: 600;
}

.text-blue-600 {
  color: #2563eb;
}

.text-gray-500 {
  color: #6b7280;
}

.hover\:text-gray-700:hover {
  color: #374151;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.rounded {
  border-radius: 0.25rem;
}

.w-3 {
  width: 0.75rem;
}

.h-3 {
  height: 0.75rem;
}

.text-white {
  color: white;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-medium {
  font-weight: 500;
}

.text-gray-700 {
  color: #374151;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-gray-600 {
  color: #4b5563;
}

.w-2 {
  width: 0.5rem;
}

.h-2 {
  height: 0.5rem;
}

.bg-green-500 {
  background-color: #22c55e;
}

.rounded-full {
  border-radius: 9999px;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.hover\:bg-gray-300:hover {
  background-color: #d1d5db;
}

.flex-1 {
  flex: 1 1 0%;
}

.overflow-y-auto {
  overflow-y: auto;
}

.p-4 {
  padding: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.max-w-\[80\%\] {
  max-width: 80%;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.text-gray-900 {
  color: #111827;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.border-gray-300 {
  border-color: #d1d5db;
}

.text-center {
  text-align: center;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.bg-gray-400 {
  background-color: #9ca3af;
}

.border-t {
  border-top-width: 1px;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px #3b82f6;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.p-2 {
  padding: 0.5rem;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dark\:bg-\[#1a1a2e\] {
    background-color: #1a1a2e;
  }
  
  .dark\:border-\[#34495e\] {
    border-color: #34495e;
  }
  
  .dark\:text-blue-400 {
    color: #60a5fa;
  }
  
  .dark\:hover\:text-gray-300:hover {
    color: #d1d5db;
  }
  
  .dark\:bg-\[#16213e\] {
    background-color: #16213e;
  }
  
  .dark\:text-gray-300 {
    color: #d1d5db;
  }
  
  .dark\:text-gray-400 {
    color: #9ca3af;
  }
  
  .dark\:bg-\[#34495e\] {
    background-color: #34495e;
  }
  
  .dark\:hover\:bg-\[#2e3b5e\]:hover {
    background-color: #2e3b5e;
  }
  
  .dark\:bg-\[#2e3b5e\] {
    background-color: #2e3b5e;
  }
  
  .dark\:text-gray-100 {
    color: #f3f4f6;
  }
  
  .dark\:hover\:bg-\[#34495e\]:hover {
    background-color: #34495e;
  }
  
  .dark\:hover\:bg-blue-900\/20:hover {
    background-color: rgba(30, 58, 138, 0.2);
  }
}
</style>
