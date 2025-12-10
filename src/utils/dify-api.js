/**
 * Dify API 集成模块
 * 处理与 Dify AI 助手的通信
 */

const DIFY_CONFIG = {
  API_KEY: 'app-W54QeXiNwH5ic4eiCQBPfD7Z',
  BASE_URL: 'https://api.dify.ai/v1'
}

/**
 * 使用流式 API 向 Dify AI 助手发送消息
 * @param {string} userMessage - 用户消息内容
 * @param {string} userId - 用户 ID
 * @param {Function} onChunk - 接收到数据块时的回调函数
 * @param {string} conversationId - 会话 ID（可选）
 * @returns {Promise<{response: string, conversationId: string}>} 完整的助手回复内容和会话ID
 */
export async function sendDifyMessageStream(userMessage, userId, onChunk, conversationId = '') {
  try {
    const response = await fetch(`${DIFY_CONFIG.BASE_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        inputs: {},
        query: userMessage,
        response_mode: 'streaming',
        conversation_id: conversationId || undefined,
        user: userId
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ''
    let newConversationId = conversationId

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue
        
        try {
          const jsonStr = line.replace('data: ', '').trim()
          const data = JSON.parse(jsonStr)

          // 处理不同的事件类型
          if (data.event === 'message' || data.event === 'agent_message') {
            // 获取增量内容
            const content = data.answer || ''
            if (content) {
              result += content
              if (onChunk) {
                onChunk(content)
              }
            }
          } else if (data.event === 'message_end') {
            // 消息结束，获取会话ID
            if (data.conversation_id) {
              newConversationId = data.conversation_id
            }
          }
        } catch (e) {
          // 跳过无效的 JSON
          console.debug('跳过无效数据:', line)
        }
      }
    }

    return {
      response: result,
      conversationId: newConversationId
    }
  } catch (error) {
    console.error('Failed to send message to Dify:', error)
    throw error
  }
}
