<template>
  <div v-if="maxCount > 0" class="activity-chart s-card widgets">
    <div class="title">
      <span class="iconfont icon-chart-bar"></span>
      <span class="title-name">写作节奏</span>
    </div>
    <div class="chart-body">
      <div v-for="(bar, i) in dayData" :key="i" class="bar-col">
        <div class="bar-fill" :style="{ height: bar.pct + '%' }" />
        <span class="bar-label">{{ bar.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { theme } = useData();

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

const dayData = computed(() => {
  const posts = theme.value?.postData;
  if (!posts?.length) return [];

  const dayMap = new Array(7).fill(0);
  posts.forEach((p) => {
    const ts = p.date;
    if (!ts) return;
    // getDay() 返回 0=周日, 1=周一... 我们调整为周一=0
    const d = (new Date(ts).getDay() + 6) % 7;
    dayMap[d]++;
  });

  const max = Math.max(...dayMap, 1);
  return dayMap.map((count, d) => ({
    label: DAY_LABELS[d],
    count,
    pct: Math.round((count / max) * 100),
  }));
});

const maxCount = computed(() => Math.max(...dayData.value.map(b => b.count), 0));
</script>

<style lang="scss" scoped>
.activity-chart {
  padding: 18px;

  .title {
    margin-bottom: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    opacity: 0.75;
    .iconfont {
      opacity: 0.6;
      margin-right: 6px;
    }
    .title-name {
      opacity: 0.8;
      font-size: .95rem;
    }
  }

  .chart-body {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 100px;
    padding-top: 8px;

    .bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;

      .bar-fill {
        width: 100%;
        max-width: 24px;
        min-width: 8px;
        margin-top: auto;
        border-radius: 3px 3px 0 0;
        background: linear-gradient(180deg, var(--main-color), #00d4ff);
        transition: height 0.6s ease;
        min-height: 2px;
      }

      .bar-label {
        font-size: 0.65rem;
        color: var(--main-font-second-color);
        opacity: 0.6;
        margin-top: 4px;
      }
    }
  }
}
</style>
