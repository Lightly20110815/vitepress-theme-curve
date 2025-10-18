// api/deepseek.ts
export const config = { runtime: 'edge' }

// 小工具：返回 JSON 响应并带 CORS
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export default async function handler(req: Request) {
  // 1) 处理 CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405)
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return json({ error: 'Missing DEEPSEEK_API_KEY' }, 500)
  }

  // 2) 解析请求体
  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const {
    model = 'deepseek-chat',
    messages = [],
    stream = true,
    temperature,
    top_p,
    frequency_penalty,
    presence_penalty,
    max_tokens,
    // 如需更多字段可继续透传
  } = body ?? {}

  // 3) 组装上游 payload（只放常用字段，其他可按需追加）
  const upstreamPayload: Record<string, any> = { model, messages, stream }
  if (temperature !== undefined) upstreamPayload.temperature = temperature
  if (top_p !== undefined) upstreamPayload.top_p = top_p
  if (frequency_penalty !== undefined) upstreamPayload.frequency_penalty = frequency_penalty
  if (presence_penalty !== undefined) upstreamPayload.presence_penalty = presence_penalty
  if (max_tokens !== undefined) upstreamPayload.max_tokens = max_tokens

  // 4) 调用 DeepSeek
  const upstream = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(upstreamPayload),
  })

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '')
    return new Response(text || 'Upstream error', {
      status: upstream.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': upstream.headers.get('content-type') || 'text/plain; charset=utf-8',
      },
    })
  }

  // 5) 根据 stream 返回
  if (stream) {
    // 直接透传 SSE
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } else {
    const text = await upstream.text()
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
