<!-- AI 摘要（真实 AI 生成 + 本地回退） -->
<template>
  <div v-if="frontmatter.articleGPT && show" class="article-gpt s-card">
    <div class="title">
      <span class="name" @click="router.go('#')">
        <i class="iconfont icon-robot"></i>
        文章摘要
        <i class="iconfont icon-up"></i>
      </span>
      <span :class="['logo', { loading }]" @click="handleLogoClick">
        {{ isRealAI ? "DeepSeek" : "FakeGPT" }}
      </span>
    </div>
    <div class="content s-card">
      <span class="text">{{ abstractData === "" ? "加载中..." : abstractData }}</span>
      <span v-if="loading" class="point">|</span>
    </div>
    <div class="meta">
      <span class="tip">{{
        isRealAI
          ? "此内容由 AI 大模型生成，请仔细甄别"
          : "此内容根据文章生成，并经过人工审核，仅用于文章内容的解释与总结"
      }}</span>
      <span v-if="isRealAI && !loading && abstractData" class="action" @click="regenerate">
        <i class="iconfont icon-refresh"></i>
        重新生成
      </span>
    </div>
  </div>
</template>

<script setup>
const { frontmatter } = useData();
const router = useRouter();

// 摘要数据
const loading = ref(true);
const waitTimeOut = ref(null);
const abstractData = ref("");
const show = ref(true);
const showIndex = ref(0);
const showType = ref(false);
const abortController = ref(null);

// 摘要缓存（按页面路径缓存）
const summaryCache = new Map();

// 判断是否为真实 AI 模式
const isRealAI = computed(() => {
  return frontmatter.value.articleGPT === true;
});

// 获取文章正文内容
const getArticleContent = () => {
  const el = document.getElementById("page-content");
  if (!el) return "";
  // 提取纯文本，去除多余空白
  let text = el.innerText || el.textContent || "";
  // 限制长度，避免 token 过多
  if (text.length > 3000) {
    text = text.substring(0, 3000) + "...";
  }
  return text.trim();
};

// 真实 AI 摘要 - 流式调用 DeepSeek
const fetchAISummary = async () => {
  const pageKey = window.location.pathname;

  // 检查缓存
  if (summaryCache.has(pageKey)) {
    abstractData.value = summaryCache.get(pageKey);
    loading.value = false;
    return;
  }

  const content = getArticleContent();
  if (!content) {
    show.value = false;
    loading.value = false;
    return;
  }

  // 取消之前的请求
  if (abortController.value) {
    abortController.value.abort();
  }
  abortController.value = new AbortController();

  loading.value = true;
  abstractData.value = "";

  try {
    const response = await fetch("/api/deepseek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: abortController.value.signal,
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        temperature: 0.5,
        max_tokens: 300,
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
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    // 解析 SSE 流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // 保留最后一行（可能不完整）
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            abstractData.value += delta;
          }
        } catch {
          // 忽略解析错误
        }
      }
    }

    // 缓存结果
    if (abstractData.value) {
      summaryCache.set(pageKey, abstractData.value);
    }
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("AI 摘要生成失败：", error);
    show.value = false;
  } finally {
    loading.value = false;
  }
};

// 重新生成（清除缓存后重新请求）
const regenerate = () => {
  const pageKey = window.location.pathname;
  summaryCache.delete(pageKey);
  fetchAISummary();
};

// ===== 假 AI 模式的逻辑（保留兼容） =====

// 打字机输出
const typeWriter = (text = null) => {
  try {
    const data = text || frontmatter.value.articleGPT;
    if (!data || typeof data !== "string") return false;
    if (showIndex.value < data.length) {
      abstractData.value += data.charAt(showIndex.value++);
      const delay = Math.random() * (150 - 30) + 30;
      setTimeout(() => {
        typeWriter(text);
      }, delay);
    } else {
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
    show.value = false;
    console.error("摘要生成失败：", error);
  }
};

// 假 AI 初始化
const initFakeAbstract = () => {
  waitTimeOut.value = setTimeout(
    () => {
      typeWriter();
    },
    Math.random() * (3800 - 2500) + 2500,
  );
};

// 假 AI logo 点击 - 显示介绍
const showOther = () => {
  if (loading.value) return false;
  const text =
    "我是池鱼开发的摘要生成助理 FakeGPT，如你所见，这是一个假的 GPT，所有文本皆源于本地书写的内容。我在这里只负责显示，并仿照 GPT 的形式输出。";
  showIndex.value = 0;
  loading.value = true;
  abstractData.value = "";
  if (!showType.value) {
    showType.value = true;
    typeWriter(text);
  } else {
    typeWriter();
    showType.value = false;
  }
};

// Logo 点击统一处理
const handleLogoClick = () => {
  if (isRealAI.value) {
    // 真实 AI 模式：不做特殊操作（或可以加入其他交互）
    if (!loading.value) regenerate();
  } else {
    showOther();
  }
};

// 初始化
onMounted(() => {
  if (!frontmatter.value.articleGPT) return;

  if (isRealAI.value) {
    // 真实 AI 模式：等待 DOM 渲染完成后获取文章内容
    nextTick(() => {
      setTimeout(() => {
        fetchAISummary();
      }, 500);
    });
  } else {
    // 假 AI 模式：使用 frontmatter 中的文本
    initFakeAbstract();
  }
});

onBeforeUnmount(() => {
  clearTimeout(waitTimeOut.value);
  if (abortController.value) {
    abortController.value.abort();
  }
});
</script>

<style lang="scss" scoped>
.article-gpt {
  margin-top: 1.2rem;
  background-color: var(--main-card-second-background);
  user-select: none;
  cursor: auto;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    padding: 0 8px;
    .name {
      display: flex;
      align-items: center;
      color: var(--main-color);
      font-weight: bold;
      cursor: pointer;
      .icon-robot {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: normal;
        width: 26px;
        height: 26px;
        color: var(--main-card-background);
        background-color: var(--main-color);
        border-radius: 50%;
        margin-right: 8px;
      }
      .icon-up {
        font-weight: normal;
        font-size: 12px;
        margin-left: 6px;
        opacity: 0.6;
        color: var(--main-color);
        transform: rotate(90deg);
      }
    }
    .logo {
      padding: 4px 10px;
      font-size: 12px;
      color: var(--main-card-background);
      background-color: var(--main-color);
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      &.loading {
        animation: loading 1s infinite;
        cursor: not-allowed;
      }
    }
  }
  .content {
    cursor: auto;
    .point {
      color: var(--main-color);
      font-weight: bold;
      margin-left: 4px;
      animation: loading 0.8s infinite;
    }
  }
  .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding: 0 8px;
    font-size: 12px;
    .tip {
      opacity: 0.6;
    }
    .action {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin-left: 12px;
      opacity: 0.6;
      cursor: pointer;
      transition: opacity 0.3s, color 0.3s;
      .iconfont {
        font-size: 12px;
        margin-right: 4px;
      }
      &:hover {
        opacity: 1;
        color: var(--main-color);
      }
    }
    .report {
      white-space: nowrap;
      margin-left: 12px;
      opacity: 0.8;
    }
  }
}
</style>
