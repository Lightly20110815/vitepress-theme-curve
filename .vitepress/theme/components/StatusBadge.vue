<template>
  <div class="status-badge s-card widgets">
    <div class="title">
      <span class="iconfont icon-time"></span>
      <span class="title-name">此刻状态</span>
    </div>
    <div class="status-body">
      <span class="status-emoji">{{ status.emoji }}</span>
      <span class="status-text">{{ status.text }}</span>
    </div>
  </div>
</template>

<script setup>
const getStatus = () => {
  const h = new Date().getHours();
  const d = new Date().getDay();
  if (h < 2) return { emoji: '🌙', text: '大概在熬夜……也可能在看手机' };
  if (h < 7) return { emoji: '💤', text: '应该在睡觉，别吵' };
  if (h < 9) return { emoji: '☕', text: '刚醒，还在回神' };
  if (h < 12) return { emoji: '📚', text: d > 0 && d < 6 ? '应该在听课（希望吧）' : '摸鱼中，勿念' };
  if (h < 14) return { emoji: '🍚', text: '午饭时间！好吃的' };
  if (h < 17) return { emoji: '💻', text: '可能在写代码，可能在看视频' };
  if (h < 19) return { emoji: '🌆', text: '傍晚了，准备放松' };
  if (h < 22) return { emoji: '🎮', text: '大概在打 pjsk，也可能在看番' };
  return { emoji: '🌙', text: '夜深了，又开始胡思乱想' };
};

const status = ref(getStatus());

let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    status.value = getStatus();
  }, 60000);
});
onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.status-badge {
  padding: 18px;
  display: flex;
  flex-direction: column;
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
  .status-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    .status-emoji {
      font-size: 2.5rem;
      animation: status-bounce 2s ease-in-out infinite;
    }
    .status-text {
      font-size: 0.95rem;
      color: var(--main-font-color);
      opacity: 0.8;
      line-height: 1.5;
    }
  }
}
@keyframes status-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
