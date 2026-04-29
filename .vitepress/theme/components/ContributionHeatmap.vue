<template>
  <div v-if="weeks.length" class="contribution-heatmap s-card">
    <div class="heatmap-header">
      <span class="iconfont icon-calendar"></span>
      <span class="title-name">数字花园热力图</span>
    </div>
    <div class="heatmap-body">
      <div class="months-row">
        <span v-for="m in monthLabels" :key="m.label" class="month-label" :style="{ gridColumn: m.col }">{{ m.label }}</span>
      </div>
      <div class="grid">
        <template v-for="(week, wi) in weeks" :key="wi">
          <div
            v-for="(day, di) in week"
            :key="wi + '-' + di"
            class="cell"
            :class="'level-' + day.level"
            :title="day.title"
          />
        </template>
      </div>
      <div class="legend">
        <span class="legend-label">少</span>
        <span class="cell level-0" />
        <span class="cell level-1" />
        <span class="cell level-2" />
        <span class="cell level-3" />
        <span class="cell level-4" />
        <span class="legend-label">多</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { theme } = useData();

const weeks = computed(() => {
  const posts = theme.value.postData;
  if (!posts || !posts.length) return [];

  // 收集每天的文章数
  const dayMap = {};
  posts.forEach((p) => {
    if (!p.date) return;
    const d = new Date(p.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dayMap[key] = (dayMap[key] || 0) + 1;
  });

  // 找到最早和最晚的日期
  const dates = Object.keys(dayMap).sort();
  if (!dates.length) return [];
  const since = theme.value.since || dates[0];
  const start = new Date(since + 'T00:00:00');
  const end = new Date();

  // 对齐到周日（GitHub 风格）
  const startDay = start.getDay();
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - startDay);

  const totalDays = Math.floor((end - gridStart) / (1000 * 60 * 60 * 24)) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  // 最大文章数（用于分级）
  const maxCount = Math.max(1, ...Object.values(dayMap));

  const result = [];
  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart);
      date.setDate(date.getDate() + w * 7 + d);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const count = dayMap[key] || 0;
      const level = count === 0 ? 0 : Math.ceil((count / maxCount) * 4);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      week.push({
        level,
        title: count ? `${dateStr}: ${count} 篇文章` : dateStr,
      });
    }
    result.push(week);
  }
  return result;
});

const monthLabels = computed(() => {
  if (!weeks.value.length) return [];
  const labels = [];
  const gridStart = new Date(weeks.value[0][0]?.title ? new Date().getFullYear() : 0);
  // 遍历周，当月份变化时记录
  let lastMonth = -1;
  weeks.value.forEach((week, wi) => {
    const firstDay = week[0];
    if (!firstDay) return;
    const m = firstDay.title?.match?.(/(\d+)\//);
    if (m && parseInt(m[1]) !== lastMonth) {
      lastMonth = parseInt(m[1]);
      labels.push({ label: `${lastMonth}月`, col: wi + 1 });
    }
  });
  return labels;
});
</script>

<style lang="scss" scoped>
.contribution-heatmap {
  margin-top: 2rem;
  padding: 20px 24px;
  animation: fade-up 0.6s 0.5s backwards;

  .heatmap-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
    font-weight: bold;
    opacity: 0.75;

    .iconfont {
      opacity: 0.6;
    }
    .title-name {
      opacity: 0.8;
      font-size: 0.95rem;
    }
  }

  .heatmap-body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .months-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, 1fr);
    font-size: 0.7rem;
    color: var(--main-font-second-color);
    opacity: 0.7;
    margin-bottom: 2px;
    margin-left: 0;

    .month-label {
      white-space: nowrap;
    }
  }

  .grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 12px);
    gap: 3px;
  }

  .cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    transition: transform 0.15s;

    &:hover {
      transform: scale(1.4);
    }

    &.level-0 { background: var(--main-card-second-background); }
    &.level-1 { background: #9be9a8; }
    &.level-2 { background: #40c463; }
    &.level-3 { background: #30a14e; }
    &.level-4 { background: #216e39; }
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    font-size: 0.7rem;
    color: var(--main-font-second-color);
    opacity: 0.7;
    justify-content: flex-end;

    .cell {
      width: 10px;
      height: 10px;
      cursor: default;
      &:hover { transform: none; }
    }
    .legend-label {
      margin: 0 3px;
    }
  }
}
</style>
