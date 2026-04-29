<template>
  <div class="site-timer s-card">
    <div class="title">
      <span class="iconfont icon-time"></span>
      <span class="title-name">运行时长</span>
    </div>
    <div class="timer-body">
      <div class="timer-item">
        <span class="num">{{ pad(timeData.years) }}</span>
        <span class="label">年</span>
      </div>
      <div class="timer-item">
        <span class="num">{{ pad(timeData.days) }}</span>
        <span class="label">天</span>
      </div>
      <div class="timer-item">
        <span class="num">{{ pad(timeData.hours) }}</span>
        <span class="label">时</span>
      </div>
      <div class="timer-item">
        <span class="num">{{ pad(timeData.minutes) }}</span>
        <span class="label">分</span>
      </div>
      <div class="timer-item">
        <span class="num">{{ pad(timeData.seconds) }}</span>
        <span class="label">秒</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { theme } = useData();

const since = theme.value.since || '2025-07-22';
const startTime = new Date(since + 'T00:00:00').getTime();

const timeData = reactive({
  years: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const pad = (n) => String(n).padStart(2, '0');

const updateTimer = () => {
  const now = Date.now();
  const diff = Math.max(0, now - startTime);

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // 简化计算：每年按 365 天
  timeData.years = Math.floor(totalDays / 365);
  timeData.days = totalDays % 365;
  timeData.hours = totalHours % 24;
  timeData.minutes = totalMinutes % 60;
  timeData.seconds = totalSeconds % 60;
};

let timer = null;
onMounted(() => {
  updateTimer();
  timer = setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.site-timer {
  .timer-body {
    display: flex;
    justify-content: space-between;
    gap: 6px;

    .timer-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 36px;

      .num {
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--main-color);
        font-family: 'Fira Code', monospace;
        line-height: 1.2;
      }

      .label {
        font-size: 0.65rem;
        color: var(--main-font-second-color);
        opacity: 0.7;
        margin-top: 2px;
      }
    }
  }
}
</style>
