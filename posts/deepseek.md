---
title: 给你的 Curve 主题通过调起 DeepSeek 添加一个侧边栏温柔问候语
tags: [开发]
categories: [开发教程]
date: 2025-10-20
description: Curve 主题：DeepSeek 首页问候组件
---

::: warning
在开始动手之前，请确保你已经成功部署了 **DeepSeek API 代理**（无论是本地还是 Vercel）。  
如果你还没部署，可以先看我写的另一篇：[给你的 Curve 主题添加一个 DeepSeek 代理](#)。<br>
:::

## 🪞效果预览

打开你的首页时，DeepSeek会自动在侧边栏的小组件生成一句带有**温柔气息**的问候语，比如：

> 「你好呀，今天的风也刚好路过我身旁。」

每次刷新、或点击卡片时，都会重新生成一条新的话。  
整个过程是实时流式输出的——你能看见文字一点点浮现。

---

## 🧩 新建 randomquote.vue 文件

路径：  
`.vitepress/theme/components/Aside/Widgets/randomquote.vue`

写入：

```vue
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

const API_URL = import.meta.env?.DEV
  ? 'http://localhost:8787/api/deepseek'
  : '/api/deepseek'

const text = ref('')
const isStreaming = ref(false)
const error = ref('')

onMounted(() => generate())
function handleClick() {
  if (isStreaming.value) return
  generate()
}

async function generate() {
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
    if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`)
    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buf = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
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
        } catch {}
      }
    }
  } catch (e) {
    error.value = e.message
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
  cursor: pointer;
  user-select: none;
}
.random-quote:hover {
  background: var(--main-card-background);
  border-color: var(--main-card-border);
  box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0,0,0,0.08));
}
.rq-left { font-size: 1.1rem; opacity: .85; }
.rq-main { flex: 1 1 auto; min-width: 0; }
.rq-content { margin: 0; color: var(--main-text-1); line-height: 1.6; font-size: .95rem; white-space: pre-line; }
.rq-author { margin-top: .4rem; color: var(--main-text-2); font-size: .85rem; }
</style>
```
>（提示词可以自己修改哦~）
---

## 🧷 修改 App.vue 以加载组件

路径：  
`.vitepress/theme/App.vue`

添加：

```vue{2}
<Message />
<RandomQuote v-if="frontmatter.layout === 'home'" />
</template>
```

再在 `<script setup>` 里引入：

```vue{2}
<script setup>
import RandomQuote from "./components/Aside/Widgets/randomquote.vue";
```

---

## 🌙 小结

现在，启动你的站点：

```bash
pnpm dev
```

每次刷新，就能看到一句从 **DeepSeek** 生成的温柔问候。  
如果你部署在 Vercel，它会自动使用你线上配置的 `/api/deepseek`。  
本地调试时，它会使用 `localhost:8787`。

---

## 🎀 尾声

> 有时候，代码不只是冷冰冰的逻辑。  
> 它也可以是风，也可以是温柔。  
> 希望这段小组件，能让你开心一点呢…………
> 
> Sy Yann