<template>
  <div
    v-if="!hidden"
    class="random-quote s-card"
    @click="handleClick"
  >
    <div class="rq-left" aria-hidden="true">💬</div>
    <div class="rq-main" aria-live="polite">
      <p class="rq-content">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = import.meta.env.DEV
  ? 'http://localhost:8787/api/deepseek'
  : '/api/deepseek'

const text = ref('')
const isStreaming = ref(false)
const hidden = ref(false)

onMounted(() => generate())

async function handleClick() {
  if (isStreaming.value) return
  generate()
}

async function generate() {
  text.value = ''
  hidden.value = false
  isStreaming.value = true

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 1.1,
        stream: true,
        messages: [
          {
            role: 'system',
            content: `
你是一位温柔、可爱、带一点梦幻气息的存在。
你要为访问者写一句轻声的问候，像风轻轻碰到人。
语气要柔和、自然，不要理性分析，不要哲思，不要说大道理。
不要显得正式或礼貌，只要像在和喜欢的人悄悄说话。
每句话都要独立成句，不要连续两句。
可以带一点点可爱、撒娇、或者微妙的依恋感。
用中文输出。

示例风格（仅供参考，不可照抄）：
- 「嘿，你来了呀，我刚好也在想你～」
- 「要不要在这儿坐一会儿，风好温柔呢。」
- 「我小心地踩着光，跑去迎你。」
- 「我在等一个信号，好像是你的心跳。」
            `.trim()
          },
          {
            role: 'user',
            content: '请写一句新的打招呼句子，谢谢你，抱抱qwq~'
          }
        ]
      })
    })

    if (!resp.ok || !resp.body) {
      const errMsg = `DeepSeek API 请求失败：HTTP ${resp.status}`
      console.error(errMsg)
      hidden.value = true
      throw new Error(errMsg)
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const raw of lines) {
        const line = raw.trim()
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (!data) continue
        if (data === '[DONE]') {
          isStreaming.value = false
          return
        }
        try {
          const json = JSON.parse(data)
          const delta = json?.choices?.[0]?.delta?.content ?? ''
          if (delta) text.value += delta
        } catch (e) {
          // 流式解析异常也输出
          console.warn('DeepSeek SSE 解析异常：', e)
        }
      }
    }
  } catch (err) {
    console.error('DeepSeek 加载失败：', err)
    hidden.value = true
    // 主动抛出错误，能在 F12 控制台的红色 error 里看到完整堆栈
    throw err
  } finally {
    isStreaming.value = false
  }
}
</script>

<style scoped>
.random-quote {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--main-card-border);
  border-radius: 12px;
  background: var(--main-card-background);
  box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0,0,0,0.08));
  transition: box-shadow .18s ease;
  cursor: pointer;
  user-select: none;
}
.random-quote:hover {
  background: var(--main-card-background);
  border-color: var(--main-card-border);
}
.rq-left { font-size: 1.1rem; opacity: .85; }
.rq-main { flex: 1 1 auto; min-width: 0; }
.rq-content {
  margin: 0;
  color: var(--main-text-1);
  line-height: 1.6;
  font-size: .95rem;
  white-space: pre-line;
}
</style>
