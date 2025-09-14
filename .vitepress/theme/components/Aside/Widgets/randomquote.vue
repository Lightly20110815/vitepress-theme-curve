<template>
  <div
    v-if="card"
    class="random-quote s-card"
    @click="toggle"
  >
    <div class="rq-left" aria-hidden="true">💬</div>

    <div class="rq-main" v-if="!isHello">
      <p class="rq-content">{{ card.content }}</p>
      <p v-if="card.author" class="rq-author">— {{ card.author }}</p>
    </div>

    <div v-else class="rq-hello">
      <div class="rq-hello-title">愛して</div>
      <div class="rq-extra">愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して愛して……</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { themeConfig } from '../../../assets/themeConfig.mjs'

const isHello = ref(false)
const toggle = () => { isHello.value = !isHello.value }

const raw = computed(() => themeConfig?.aside?.randomQuote ?? null)

const card = computed(() => {
  const cfg = raw.value
  if (!cfg || !cfg.enable || !Array.isArray(cfg.quotes) || cfg.quotes.length === 0) return null
  const pick = cfg.quotes[Math.floor(Math.random() * cfg.quotes.length)]
  if (typeof pick === 'string') return { content: pick, author: '' }
  const content = pick.content ?? pick.text ?? ''
  const author = pick.author ?? pick.from ?? ''
  if (!content) return null
  return { content, author }
})
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
  /* 保持阴影风格一致，避免 hover 时消失 */
  box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
  transition: box-shadow .18s ease;

  /* 彻底禁止文字选中 & 点击高亮 */
  user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

/* 阻断任何来源的黄色选中态 */
.random-quote, .random-quote * { user-select: none !important; }
.random-quote ::selection { background: transparent !important; color: inherit !important; }
.random-quote ::-moz-selection { background: transparent !important; color: inherit !important; }

/* 覆盖主题 .s-card:hover 的黄底/描边，保持与常态一致且保留阴影 */
.random-quote:hover {
  background: var(--main-card-background) !important;
  border-color: var(--main-card-border) !important;
  box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08)) !important;
}

/* 基础文字样式 */
.rq-left { font-size: 1.1rem; line-height: 1; opacity: .85; }
.rq-main { flex: 1 1 auto; min-width: 0; }
.rq-content { margin: 0; color: var(--main-text-1, var(--vp-c-text-1)); line-height: 1.6; font-size: .95rem; word-break: break-word; }
.rq-author { margin: .4rem 0 0; color: var(--main-text-2, var(--vp-c-text-2)); font-size: .85rem; }

/* Hello 状态：整块红色 */
.rq-hello { flex: 1 1 auto; display: flex; flex-direction: column; gap: .5rem; color: #ef4444; }
.rq-hello-title { font-weight: 700; font-size: 1.1rem; }
.rq-extra { font-weight: 500; font-size: .95rem; }
</style>
