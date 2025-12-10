# PopupAssistant 组件使用说明

## 概述

PopupAssistant 是一个 Vue 3 组件，用于在 foxTalkAI 项目中集成 Dify AI 助手。该组件从 paymindGit 项目的 popup-assistant.tsx (React) 转换而来，并将 Coze API 替换为 Dify API。

## 文件结构

```
foxTalkAI/
├── src/
│   ├── components/
│   │   └── PopupAssistant.vue          # 弹窗助手组件
│   ├── utils/
│   │   └── dify-api.js                 # Dify API 调用模块
│   └── views/
│       └── HomeView.vue                # 示例：在首页中使用组件
```

## 主要功能

1. **流式对话**: 支持 Dify API 的流式响应，实时显示 AI 回复
2. **会话管理**: 自动管理会话 ID，保持对话上下文
3. **快速操作**: 提供预设的快速操作按钮
4. **响应式设计**: 支持深色模式和浅色模式
5. **用户友好**: 加载动画、自动滚动等交互优化

## API 配置

API Key 已配置在 `src/utils/dify-api.js` 文件中：

```javascript
const DIFY_CONFIG = {
  API_KEY: 'IYkwDNgqfhMHogeV',
  BASE_URL: 'https://api.dify.ai/v1'
}
```

## 使用方法

### 1. 基本使用

在任何 Vue 组件中导入并使用：

```vue
<script setup>
import { ref } from 'vue'
import PopupAssistant from '@/components/PopupAssistant.vue'

const isAssistantOpen = ref(false)

const openAssistant = () => {
  isAssistantOpen.value = true
}

const closeAssistant = () => {
  isAssistantOpen.value = false
}
</script>

<template>
  <div>
    <button @click="openAssistant">打开助手</button>
    <PopupAssistant :is-open="isAssistantOpen" @close="closeAssistant" />
  </div>
</template>
```

### 2. 浮动按钮示例

参考 `src/views/HomeView.vue` 中的实现，添加一个浮动按钮：

```vue
<button
  @click="openAssistant"
  class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
>
  <!-- 图标 -->
</button>
```

## 组件 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| isOpen | Boolean | false | 控制弹窗的显示/隐藏 |

## 组件 Events

| 事件 | 参数 | 说明 |
|------|------|------|
| close | - | 当用户点击关闭按钮时触发 |

## 自定义快速操作

在 `PopupAssistant.vue` 中修改 `quickActions` 数组：

```javascript
const quickActions = [
  '你都支持哪些区块链网络的代币兑换？',
  '帮我把 0.5 ETH 换成 USDC',
  '主要功能',
  'X402 Smart Bundler 还能提供哪些服务？'
]
```

## 技术细节

### Dify API 集成

- 使用 Dify 的 `/v1/chat-messages` 端点
- 支持流式响应 (`response_mode: 'streaming'`)
- 自动管理会话 ID 以保持对话上下文
- 处理 SSE (Server-Sent Events) 格式的响应

### 与原 Coze API 的主要区别

| 特性 | Coze API | Dify API |
|------|----------|----------|
| 端点 | `/v3/chat` | `/v1/chat-messages` |
| 认证 | Bearer Token | Bearer Token |
| 会话管理 | 需要先创建会话 | 自动管理 |
| 流式格式 | SSE with event types | SSE with data events |
| 响应字段 | `content` | `answer` |

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 注意事项

1. 确保 Dify API Key 有效且有足够的配额
2. 组件使用纯 CSS 实现，不依赖 Tailwind CSS
3. 支持深色模式（基于系统偏好）
4. 会话 ID 在组件生命周期内保持，刷新页面会创建新会话

## 故障排除

### API 请求失败

- 检查 API Key 是否正确
- 检查网络连接
- 查看浏览器控制台的错误信息

### 样式显示异常

- 确保 `src/assets/main.css` 已在 `main.js` 中导入
- 检查浏览器是否支持所需的 CSS 特性

### 流式响应不工作

- 确认 Dify API 支持流式响应
- 检查浏览器是否支持 Fetch API 和 ReadableStream
