<template>
  <div class="self-typing" @click="nextPhrase">
    <span class="tip">关于我？</span>
    <span class="typed-line">
      {{ displayText }}<i class="cursor" :class="{ typing: isTyping }">|</i>
    </span>
  </div>
</template>

<script setup>
const PHRASE_CACHE_KEY = 'self-typing-phrases';
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存

// 本地回退词库
const fallbackPhrases = [
  "写了也没人看的",
  "一个在代码和音乐之间反复横跳的人",
  "VOCALOID × 前端开发 = 我",
  "写博客是为了让未来的自己嘲笑现在的自己",
  "正在努力成为一个不无聊的大人",
  "这个网站的bug比我的优点还多",
  "你好，我是这个花园的园丁兼唯一的杂草",
];

const displayText = ref('');
const isTyping = ref(false);
const isAI = ref(false);
let timer = null;
let abortController = null;

// 加载缓存
const loadCache = () => {
  try {
    const cached = localStorage.getItem(PHRASE_CACHE_KEY);
    if (!cached) return null;
    const { phrases, time } = JSON.parse(cached);
    if (Date.now() - time < CACHE_DURATION) return phrases;
  } catch {}
  return null;
};

// 保存缓存
const saveCache = (phrases) => {
  try {
    localStorage.setItem(PHRASE_CACHE_KEY, JSON.stringify({ phrases, time: Date.now() }));
  } catch {}
};

// SSE 流式获取 AI 自我介绍
const fetchAIPhrases = async () => {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const response = await fetch('/api/deepseek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        stream: true,
        temperature: 0.9,
        max_tokens: 200,
        messages: [{
          role: 'system',
          content: '你是一个个人博客的自我介绍生成器。请为博主 Sy Yann（2011年出生，喜欢 VOCALOID、前端开发、pjsk）生成5-7句简短有趣的自我介绍，每句以换行分隔。风格要：自嘲中带点认真、中二与真实混合、每句不超过20字。直接输出内容，不要编号、不要任何前缀。',
        }],
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let raw = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) raw += delta;
        } catch {}
      }
    }

    // 按行分割，过滤空行
    const phrases = raw.split('\n').map(s => s.trim()).filter(Boolean);
    if (phrases.length >= 3) {
      saveCache(phrases);
      return phrases;
    }
    return null;
  } catch (err) {
    if (err.name !== 'AbortError') console.error('DeepSeek 自我介绍获取失败:', err);
    return null;
  }
};

// 打字机效果
const typePhrase = (text) => {
  if (timer) clearInterval(timer);
  isTyping.value = true;
  displayText.value = '';
  let i = 0;
  timer = setInterval(() => {
    if (i < text.length) {
      displayText.value += text[i];
      i++;
    } else {
      clearInterval(timer);
      timer = null;
      isTyping.value = false;
    }
  }, 50);
};

// 词组和当前索引
let phrases = [...fallbackPhrases];
let phraseIdx = 0;

const nextPhrase = () => {
  phraseIdx = (phraseIdx + 1) % phrases.length;
  typePhrase(phrases[phraseIdx]);
};

onMounted(async () => {
  // 先尝试加载缓存
  const cached = loadCache();
  if (cached) {
    phrases = cached;
    isAI.value = true;
    phraseIdx = Math.floor(Math.random() * phrases.length);
    setTimeout(() => typePhrase(phrases[phraseIdx]), 400);
    return;
  }

  // 立即用本地词库开始打字，随机选一句
  phraseIdx = Math.floor(Math.random() * phrases.length);
  setTimeout(() => typePhrase(phrases[phraseIdx]), 400);

  // 后台请求 AI
  const aiPhrases = await fetchAIPhrases();
  if (aiPhrases && aiPhrases.length >= 3) {
    // 替换词库但不打断当前打字，下次点击即可用 AI 词库
    phrases = aiPhrases;
    phraseIdx = 0;
    isAI.value = true;
  }
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
  if (abortController) abortController.abort();
});
</script>

<style lang="scss" scoped>
.self-typing {
  cursor: pointer;
  user-select: none;
  position: relative;

  .tip {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 12px;
    display: block;
  }

  .typed-line {
    font-size: 36px;
    font-weight: bold;
    margin-right: 4rem;
    line-height: 1.4;

    .cursor {
      font-style: normal;
      font-weight: 300;
      margin-left: 2px;
      animation: blink 1s step-end infinite;
      &.typing {
        animation: blink 0.5s step-end infinite;
      }
    }
  }

  .ai-badge {
    display: inline-block;
    margin-top: 8px;
    padding: 3px 10px;
    font-size: 11px;
    color: var(--main-card-background);
    background: var(--main-color);
    border-radius: 25px;
    font-weight: bold;
    opacity: 0.8;
  }
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
