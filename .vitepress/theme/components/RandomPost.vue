<template>
  <div class="random-post s-card widgets" @click="goRandom">
    <div class="random-inner">
      <span class="iconfont icon-shuffle"></span>
      <span>时光信箱 · 随机穿越</span>
    </div>
  </div>
</template>

<script setup>
import { shufflePost } from '@/utils/helper.mjs';
import { mainStore } from '@/store';

const { theme } = useData();
const store = mainStore();

const goRandom = () => {
  const posts = theme.value.postData;
  if (!posts || posts.length === 0) return;
  const path = shufflePost(posts);
  if (path) {
    // 手动储存当前位置，让下次回来时能恢复
    if (typeof window !== 'undefined') {
      store.lastScrollY = window.scrollY;
    }
    window.open(path, '_self');
  }
};
</script>

<style lang="scss" scoped>
.random-post {
  padding: 18px;
  margin-bottom: 1rem;
  cursor: pointer;
  user-select: none;
  animation: fade-up 0.6s 0.45s backwards;

  .random-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--main-font-color);
    opacity: 0.8;
    transition: opacity 0.3s, transform 0.3s;

    .iconfont {
      font-size: 1.2rem;
      color: var(--main-color);
    }
  }

  &:hover .random-inner {
    opacity: 1;
    transform: scale(1.03);
  }
}
</style>
