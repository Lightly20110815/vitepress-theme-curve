<script setup>
import { useData } from "vitepress";
import { computed } from "vue";

const { theme } = useData();

// 计算天数的逻辑
const authorDays = computed(() => {
  const dateStr = theme.value.aside.birthDate?.date;
  if (!dateStr) return 0;
  
  const startDate = new Date(dateStr);
  const today = new Date();
  const timeDiff = today.getTime() - startDate.getTime();
  
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});
</script>

<template>
  <div v-if="theme.aside.birthDate?.enable" class="birthday-card s-card">
    <p class="custom-text">
      🎉{{ theme.aside.birthDate.name }} 已经在这个世界上存在
      <span class="day-number">{{ authorDays }}</span>
      天啦！
      <!-- 可以在这里修改文字, {{ theme.aside.birthDate.name }} 是在ThemeConfig.mjs中配置的名字。在{{ theme.aside.birthDate.name }}前面的就是在名字前面显示的文字 不需要就留空 -->
    </p>
  </div>
</template>
<style scoped>
/* 只保留组件特定的样式，通用样式由 s-card 处理 */
.birthday-card {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-text {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.5;
}

.day-number {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin: 0 0.25rem;
  vertical-align: middle;
}
</style>