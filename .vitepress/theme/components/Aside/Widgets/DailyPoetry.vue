<template>
  <div v-if="theme.aside.dailyPoetry?.enable !== false && loaded" class="daily-poetry s-card">
    <div class="dp-header">
      <span class="dp-icon">📜</span>
      <span class="dp-label">每日诗词</span>
    </div>
    <div class="dp-body">
      <p class="dp-content" :class="{ 'fade-in': showContent }">{{ content }}</p>
      <div class="dp-meta" :class="{ 'fade-in': showContent }">
        <span class="dp-origin">—— {{ origin }}</span>
        <span v-if="author" class="dp-author">{{ author }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { theme } = useData()

const content = ref('')
const origin = ref('')
const author = ref('')
const loaded = ref(false)
const showContent = ref(false)

const fetchPoetry = async () => {
  try {
    showContent.value = false
    const res = await fetch('https://v2.jinrishici.com/one.json', {
      headers: { 'X-User-Token': getToken() }
    })
    const data = await res.json()
    if (data.status === 'success' && data.data) {
      content.value = data.data.content
      origin.value = data.data.origin?.title || '佚名'
      author.value = data.data.origin?.author || ''
      loaded.value = true
      setTimeout(() => {
        showContent.value = true
      }, 50)
    }
  } catch (e) {
    console.warn('获取每日诗词失败：', e)
    content.value = '山有木兮木有枝，心悦君兮君不知。'
    origin.value = '越人歌'
    author.value = '佚名'
    loaded.value = true
    showContent.value = true
  }
}

const getToken = () => {
  if (typeof localStorage === 'undefined') return ''
  let token = localStorage.getItem('jinrishici-token')
  if (!token) {
    token = 'default-' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('jinrishici-token', token)
  }
  return token
}

onMounted(() => {
  fetchPoetry()
})
</script>

<style lang="scss" scoped>
.daily-poetry {
  position: relative;
  overflow: hidden;
  padding: 16px 18px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: var(--main-color);
    box-shadow: 0 4px 16px -4px var(--main-color-bg);
  }
}

.dp-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.dp-icon {
  font-size: 1rem;
}

.dp-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--main-font-second-color);
  opacity: 0.75;
  letter-spacing: 0.5px;
}

.dp-body {
  position: relative;
}

.dp-content {
  font-size: 0.92rem;
  line-height: 1.8;
  color: var(--main-font-color);
  margin: 0;
  font-weight: 500;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.dp-meta {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.dp-origin {
  font-size: 0.76rem;
  color: var(--main-font-second-color);
  opacity: 0.7;
}

.dp-author {
  font-size: 0.72rem;
  color: var(--main-color);
  background: var(--main-color-bg);
  padding: 1px 8px;
  border-radius: 10px;
  font-weight: 500;
}
</style>
