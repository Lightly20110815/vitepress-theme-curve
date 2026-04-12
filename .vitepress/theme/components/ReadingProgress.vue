<!-- 阅读进度条 -->
<template>
  <Teleport to="body">
    <div class="reading-progress" :class="{ visible: show, dark: isDark }">
      <div class="progress-bar" :style="{ width: percentage + '%' }" />
    </div>
  </Teleport>
</template>

<script setup>
import { mainStore } from "@/store";
import { storeToRefs } from "pinia";
import { useData } from "vitepress";

const store = mainStore();
const { scrollData } = storeToRefs(store);
const { isDark } = useData();

const show = ref(false);
const percentage = ref(0);

// 路由切换时重置进度条，防止闪烁
const route = useRoute();
watch(
  () => route.path,
  () => {
    show.value = false;
    percentage.value = 0;
  }
);

// 根据 store 中的滚动数据计算进度
watch(
  () => scrollData.value,
  (val) => {
    show.value = val.height > 100;
    percentage.value = Math.min(val.percentage, 100);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.reading-progress {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;

  &.visible {
    opacity: 1;
  }

  .progress-bar {
    height: 100%;
    border-radius: 0 2px 2px 0;
    background: linear-gradient(90deg, #5bcefa, #f5a9b8, #ffffff, #f5a9b8, #5bcefa);
    background-size: 200% 100%;
    animation: gradientShift 6s ease infinite;
    transition: width 0.15s linear;
    box-shadow: 0 0 8px rgba(91, 169, 250, 0.4);
  }

  // 深色模式 - 通过 JS 绑定 dark class，完全 scoped 安全
  &.dark .progress-bar {
    background: linear-gradient(90deg, #55d6ff, #ff7eb3, #f0e6ff, #ff7eb3, #55d6ff);
    background-size: 200% 100%;
    box-shadow: 0 0 12px rgba(85, 214, 255, 0.6), 0 0 4px rgba(255, 126, 179, 0.4);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: 768px) {
  .reading-progress {
    top: 60px;
    height: 2px;
  }
}
</style>
