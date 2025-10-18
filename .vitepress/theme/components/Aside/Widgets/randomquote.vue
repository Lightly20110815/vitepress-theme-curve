<template>
  <div class="random-quote s-card" @click="handleClick">
    <div class="rq-left" aria-hidden="true">💬</div>
    <div class="rq-main" aria-live="polite">
      <p class="rq-content">{{ text }}</p>
      <p v-if="error" class="rq-author">失败：{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 本地开发走本地代理；部署到 Vercel 后走同域 /api/deepseek
const API_URL = import.meta.env?.DEV
  ? 'http://localhost:8787/api/deepseek'
  : '/api/deepseek'

const text = ref('')
const isStreaming = ref(false)
const error = ref('')

// 首次挂载自动生成
onMounted(() => {
  generate()
})

// 生成过程中点击无效；生成完成后点击可重新生成
function handleClick () {
  if (isStreaming.value) return
  generate()
}

async function generate () {
  if (isStreaming.value) return
  text.value = ''
  error.value = ''
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
      throw new Error(`HTTP ${resp.status}`)
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buf = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buf += decoder.decode(value, { stream: true })
      // SSE 按行解析
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''

      for (const raw of lines) {
        const line = raw.trim()
        if (!line || !line.startsWith('data:')) continue

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
        } catch {
          // 忽略无法解析的片段（可能是 keepalive 等）
        }
      }
    }
  } catch (e) {
    error.value = e?.message ?? String(e)
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
  box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
  transition: box-shadow .18s ease;
  user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}
.random-quote, .random-quote * { user-select: none !important; }
.random-quote ::selection { background: transparent !important; color: inherit !重要; }
.random-quote ::-moz-selection { background: transparent !important; color: inherit !important; }
.random-quote:hover {
  background: var(--main-card-background) !important;
  border-color: var(--main-card-border) !important;
  box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08)) !important;
}
.rq-left { font-size: 1.1rem; line-height: 1; opacity: .85; }
.rq-main { flex: 1 1 auto; min-width: 0; }
.rq-content {
  margin: 0;
  color: var(--main-text-1, var(--vp-c-text-1));
  line-height: 1.6;
  font-size: .95rem;
  word-break: break-word;
  white-space: pre-line; /* 处理换行 */
}
.rq-author {
  margin: .4rem 0 0;
  color: var(--main-text-2, var(--vp-c-text-2));
  font-size: .85rem;
}
</style>
