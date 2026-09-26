// api/deepseek.ts
export const config = { runtime: "edge" };

const ALLOWED_ORIGINS = [
  "https://ddnsy.fun",
  "https://www.ddnsy.fun",
];

const UPSTREAM_MODEL = "deepseek-chat";
const UPSTREAM_API_URL = "https://api.deepseek.com/chat/completions";

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
    return true;
  }
  return false;
}

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("Origin") || req.headers.get("origin") || "";
  return isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
}

function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}, origin = ALLOWED_ORIGINS[0]) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      ...headers,
    },
  });
}

interface TaskResolution {
  messages: Array<{ role: "system" | "user"; content: string }>;
  temperature: number;
  max_tokens: number;
  cacheControl?: string;
}

function resolveTask(
  task: string,
  params: Record<string, unknown>,
): { error?: string; status?: number; resolution?: TaskResolution } {
  switch (task) {
    case "self-typing": {
      return {
        resolution: {
          messages: [
            {
              role: "system",
              content:
                "你是一个个人博客的自我介绍生成器。请为博主 Sy Yann（2011年出生，喜欢 VOCALOID、前端开发、pjsk）生成5-7句简短有趣的自我介绍，每句以换行分隔。风格要：自嘲中带点认真、中二与真实混合、每句不超过20字。直接输出内容，不要编号、不要任何前缀。",
            },
            {
              role: "user",
              content: "请生成自我介绍。",
            },
          ],
          temperature: 0.9,
          max_tokens: 200,
          cacheControl: "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      };
    }

    case "randomquote": {
      return {
        resolution: {
          messages: [
            {
              role: "system",
              content: [
                "你是一位温柔、可爱、带一点梦幻气息的存在。",
                "你要为访问者写一句轻声的问候，像风轻轻碰到人。",
                "语气要柔和、自然，不要理性分析，不要哲思，不要说大道理。",
                "不要显得正式或礼貌，只要像在和喜欢的人悄悄说话。",
                "每句话都要独立成句，不要连续两句。",
                "可以带一点点可爱、撒娇、或者微妙的依恋感。",
                "用中文输出。",
              ].join("\n"),
            },
            {
              role: "user",
              content: "请写一句新的打招呼句子，谢谢你，抱抱qwq~",
            },
          ],
          temperature: 1.1,
          max_tokens: 100,
          cacheControl: "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      };
    }

    case "summary": {
      const content = typeof params.content === "string" ? params.content.trim() : "";
      if (!content) {
        return { error: "content is required for summary", status: 400 };
      }
      if (content.length > 8000) {
        return { error: "content exceeds limit (max 8000 chars)", status: 400 };
      }

      return {
        resolution: {
          messages: [
            {
              role: "system",
              content:
                "你是一个文章摘要助手。请用简洁、流畅的中文对用户提供的文章内容生成一段摘要，不超过150字。直接输出摘要内容，不要添加任何前缀、标题或格式标记。",
            },
            {
              role: "user",
              content: `请为以下文章生成摘要：\n\n${content}`,
            },
          ],
          temperature: 0.5,
          max_tokens: 300,
          cacheControl: "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      };
    }

    default:
      return { error: `Unsupported task: ${task}`, status: 400 };
  }
}

export default async function handler(req: Request) {
  const allowOrigin = getCorsOrigin(req);

  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  }

  // 2) Reject POST from unauthorized origins
  if (req.method === "POST") {
    const origin = req.headers.get("Origin") || req.headers.get("origin") || "";
    if (!isOriginAllowed(origin)) {
      return jsonResponse({ error: "Forbidden: invalid origin" }, 403, {}, allowOrigin);
    }
  }

  let task = "";
  let params: Record<string, unknown> = {};
  let stream = false;

  if (req.method === "GET") {
    const url = new URL(req.url);
    task = url.searchParams.get("task") || "";
    params = Object.fromEntries(url.searchParams.entries());
    stream = false;
  } else if (req.method === "POST") {
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, {}, allowOrigin);
    }

    task = typeof body.task === "string" ? body.task.trim() : "";
    stream = body.stream === true;
    params = body;
  } else {
    return jsonResponse({ error: "Method Not Allowed" }, 405, {}, allowOrigin);
  }

  if (!task) {
    return jsonResponse({ error: "Missing required parameter: task" }, 400, {}, allowOrigin);
  }

  const { error, status = 400, resolution } = resolveTask(task, params);
  if (error || !resolution) {
    return jsonResponse({ error }, status, {}, allowOrigin);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "Missing DEEPSEEK_API_KEY" }, 500, {}, allowOrigin);
  }

  const upstreamPayload = {
    model: UPSTREAM_MODEL,
    messages: resolution.messages,
    stream,
    temperature: resolution.temperature,
    max_tokens: Math.min(resolution.max_tokens, 600),
  };

  const upstream = await fetch(UPSTREAM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(upstreamPayload),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return new Response(text || "Upstream error", {
      status: upstream.status,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Content-Type": upstream.headers.get("content-type") || "text/plain; charset=utf-8",
      },
    });
  }

  const responseHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": allowOrigin,
  };

  if (req.method === "GET" && resolution.cacheControl) {
    responseHeaders["Cache-Control"] = resolution.cacheControl;
  }

  if (stream) {
    responseHeaders["Content-Type"] = "text/event-stream; charset=utf-8";
    responseHeaders["Cache-Control"] = "no-cache, no-transform";
    responseHeaders["Connection"] = "keep-alive";

    return new Response(upstream.body, {
      status: 200,
      headers: responseHeaders,
    });
  }

  const text = await upstream.text();
  responseHeaders["Content-Type"] = "application/json; charset=utf-8";

  return new Response(text, {
    status: 200,
    headers: responseHeaders,
  });
}
