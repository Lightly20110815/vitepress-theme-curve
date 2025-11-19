<script setup>
import { useData } from "vitepress";

const { theme } = useData();

// 拿到配置的日期字符串
const timingDate = computed(() => theme.value.aside.timing?.date);

// 把日期字符串解析成 Date 实例
const parsedDate = computed(() => {
  const ds = timingDate.value;
  return ds ? new Date(ds) : null;
});

// 判断是否为未来日期
const isFuture = computed(() => {
  const d = parsedDate.value;
  return d ? d.getTime() > Date.now() : false;
});

// 计算天数差：未来则向上取整，过去则向下取整
const dayCount = computed(() => {
  const d = parsedDate.value;
  if (!d) return 0;
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = now - d.getTime();
  return diff >= 0
    ? Math.floor(diff / msPerDay)
    : Math.ceil(-diff / msPerDay);
});
</script>

<template>
  <div v-if="theme.aside.timing?.enable" class="timing-card s-card">
    <!-- 未来倒计时 -->
    <p v-if="isFuture" class="custom-text">
      ⏳ 距离 
          <span class="event-name">
        {{ theme.aside.timing.event }}
    </span> 还有
      <span class="day-number">{{ dayCount }}</span> 天
    </p>
    <!-- 过去累计天数 -->
    <p v-else class="custom-text">
      💌 
      <span class="title-name">
        {{ theme.aside.timing.name }}
    </span> 
          <span class="event-name">
        {{ theme.aside.timing.event }}
    </span>
    已经
      <span class="day-number">{{ dayCount }}</span> 天
    </p>
  </div>
</template>

<style scoped>
/* 只保留组件特定的样式，通用样式由 s-card 处理 */
.timing-card {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-name {
  font-weight: bold;
  font-size: 1rem;
}

.event-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--vp-c-brand);
  margin: 0 0.25rem;
  color: var(--main-color);
}

.custom-text {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.5;
}

.day-number {
  font-size: 1.2em;
  font-weight: 800;
  color: var(--vp-c-brand);
  vertical-align: middle;
  color: var(--main-color);
}
</style>
