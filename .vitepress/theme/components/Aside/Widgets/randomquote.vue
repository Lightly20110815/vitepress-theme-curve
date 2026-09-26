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
        task: 'randomquote',
        stream: true,
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
