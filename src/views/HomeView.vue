<script setup>
import { ref } from 'vue'
import PopupAssistant from '../components/PopupAssistant.vue'

const isAssistantOpen = ref(true)

const openAssistant = () => {
  isAssistantOpen.value = true
}

const closeAssistant = () => {
  isAssistantOpen.value = false
}
</script>

<template>
  <div class="home-container">
    <!-- 原有的 iframe -->
    <!-- <iframe
      src="https://udify.app/chatbot/IYkwDNgqfhMHogeV"
      style="width: 100%; height: 100%; min-height: 700px"
      frameborder="0"
      allow="microphone">
    </iframe> -->

    <!-- 浮动按钮，用于打开弹窗助手 -->
    <button
      @click="openAssistant"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      title="打开AI助手"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>

    <!-- 弹窗助手组件 -->
    <PopupAssistant :is-open="isAssistantOpen" @close="closeAssistant" />
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.fixed {
  position: fixed;
}

.bottom-6 {
  bottom: 1.5rem;
}

.right-6 {
  right: 1.5rem;
}

.w-14 {
  width: 3.5rem;
}

.h-14 {
  height: 3.5rem;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.text-white {
  color: white;
}

.rounded-full {
  border-radius: 9999px;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.z-50 {
  z-index: 50;
}

button {
  border: none;
  cursor: pointer;
}

button:focus {
  outline: none;
}
</style>
