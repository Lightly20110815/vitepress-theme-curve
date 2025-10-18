---
title: 给你的 Curve 主题添加一个 DeepSeek 代理
tags: [开发]
categories: [部署]
date: 2025-10-19
description: 用两种方式部署 DeepSeek API 代理：Vercel Edge 函数与本地/服务器 Node 代理（支持 SSE 流式）
---

::: warning
本文默认你已经有一把可用的 **DeepSeek API Key**。请妥善保管，不要提交到代码仓库。  
如需生成/撤销 API Key，请前往 DeepSeek 控制台。
:::

## 🧭 你会得到什么？
- 一个**兼容 OpenAI 格式**的 **/api/deepseek** 代理端点
- 支持 **SSE 流式**与**非流式**两种模式（`stream: true/false`）
- CORS 友好，前端可直接 `fetch` 调用
- **Vercel** / **VPS**

---

## ☁️ 方案一：部署到运行在 Vercel 上的 Curve（Edge Runtime）

### 1. 新建 API 路由文件
在项目根目录创建 `api/deepseek.ts`：

```ts
// api/deepseek.ts
export const config = { runtime: 'edge' }

function withCors(init: ResponseInit = {}) {
  return {
    ...init,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      ...(init.headers || {}),
    },
  }
}
const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), withCors({
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }))

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, withCors({ status: 204 }))
  if (req.method === 'GET') return json({ ok: true, hint: 'POST /api/deepseek with JSON body. Supports stream true/false.' })
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405)

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return json({ error: 'Missing DEEPSEEK_API_KEY' }, 500)

  let body: any
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON body' }, 400) }

  const { model='deepseek-chat', messages, stream=true, temperature, top_p, frequency_penalty, presence_penalty, max_tokens } = body ?? {}
  if (!Array.isArray(messages)) return json({ error: '`messages` must be an array' }, 400)

  const payload: Record<string, any> = { model, messages, stream }
  if (temperature !== undefined) payload.temperature = temperature
  if (top_p !== undefined) payload.top_p = top_p
  if (frequency_penalty !== undefined) payload.frequency_penalty = frequency_penalty
  if (presence_penalty !== undefined) payload.presence_penalty = presence_penalty
  if (max_tokens !== undefined) payload.max_tokens = max_tokens

  const upstream = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  })

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '')
    return new Response(text || 'Upstream error', withCors({
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'text/plain; charset=utf-8' },
    }))
  }

  if (stream) {
    return new Response(upstream.body, withCors({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    }))
  } else {
    const text = await upstream.text()
    return new Response(text, withCors({
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }))
  }
}
```

### 2. 配置环境变量
Vercel 控制台 → 项目 → **Settings → Environment Variables**：

- **Name**：`DEEPSEEK_API_KEY`  
- **Value**：你的 `sk-...`  

保存后重新部署. 

### 3. 验证
```bash
# 非流式
curl https://YOUR-APP.vercel.app/api/deepseek   -H "Content-Type: application/json"   -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"stream":false}'

# 流式（SSE）
curl https://YOUR-APP.vercel.app/api/deepseek   -H "Content-Type: application/json"   -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"stream":true}'
# 看到 data: ... 直到 data: [DONE] 即成功
```
---

## 🖥 方案二：VPS / 本地 Node（Express）

### 1. 安装依赖
```bash
pnpm add express
```

### 2. 新建 `server.mjs`
```js
import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json())

// CORS（本地/同域都友好，按需收敛）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// 健康检查
app.get('/', (req, res) => res.type('text/plain').send('OK: POST /api/deepseek (stream supported)'))

// 代理
app.post('/api/deepseek', async (req, res) => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' })

    const { model='deepseek-chat', messages, stream=true, temperature, top_p, frequency_penalty, presence_penalty, max_tokens } = req.body ?? {}
    if (!Array.isArray(messages)) return res.status(400).json({ error: '`messages` must be an array' })

    const payload = { model, messages, stream }
    if (temperature !== undefined) payload.temperature = temperature
    if (top_p !== undefined) payload.top_p = top_p
    if (frequency_penalty !== undefined) payload.frequency_penalty = frequency_penalty
    if (presence_penalty !== undefined) payload.presence_penalty = presence_penalty
    if (max_tokens !== undefined) payload.max_tokens = max_tokens

    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
    })

    if (!r.ok || !r.body) {
      const t = await r.text().catch(() => '')
      return res.status(r.status).send(t || 'Upstream error')
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('Connection', 'keep-alive')

      const reader = r.body.getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        res.write(value)
      }
      res.end()
    } else {
      const text = await r.text()
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(200).send(text)
    }
  } catch (e) {
    res.status(500).send(String(e))
  }
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => console.log('Local proxy on http://localhost:' + PORT))
```

### 3. 环境变量
在同级新建 `.env`：
```
DEEPSEEK_API_KEY=sk-你的新key
PORT=8787
```

### 4. 启动
```bash
node server.mjs
# 或 pm2 守护：pm2 start server.mjs --name deepseek-proxy
```

### 5. 验证
```bash
# 非流式
curl http://localhost:8787/api/deepseek   -H "Content-Type: application/json"   -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"stream":false}'

# 流式（SSE）
curl http://localhost:8787/api/deepseek   -H "Content-Type: application/json"   -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"stream":true}'
```
---
可能有些地方写的不完整或有点小问题，我写这个的时候快困死了。