<template>
  <!-- 移动端不渲染 -->
  <div v-if="!isMobile" class="site-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">HelloGithub 热榜</span>
    </div>

    <!-- 列表容器：动态计算高度，始终只露出前 5 条 -->
    <div class="all-data" ref="listContainer" :style="{ maxHeight: containerHeight + 'px' }">
      <div class="data-item" v-for="(item, index) in list" :key="item.id">
        <span class="name">{{ index + 1 }}.</span>
        <span class="num">
          <a :href="item.url" target="_blank" rel="noopener">
            {{ item.title }}
          </a>
        </span>
      </div>
    </div>

    <!-- 最后更新时间 -->
    <div v-if="formattedUpdateTime" class="update-time">最后更新：{{ formattedUpdateTime }}</div>
  </div>
</template>

<script setup>
// 数据与状态
// —— 新增：定义 emit ——
const emit = defineEmits(["fetch-error"]);

const list = ref([]);
const rawUpdateTime = ref("");
const isMobile = ref(false);
const containerHeight = ref(0);
const listContainer = ref(null);
// 从环境变量读取 API 地址
const API_URL = import.meta.env.VITE_HELLOGITHUB_API_URL;

// 将 ISO 时间解析成 'YYYY-MM-DD HH:mm:ss'
const formattedUpdateTime = computed(() => {
  if (!rawUpdateTime.value) return "";
  const d = new Date(rawUpdateTime.value);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    ` ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
});

// 简单 UA 判断移动端
function detectMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    list.value = data.data || [];
    rawUpdateTime.value = data.updateTime || "";
    await nextTick();
    calcHeight();
  } catch (e) {
    console.error("HelloGithub 热榜加载失败", e);
    // —— 关键：向父组件抛出错误 ——
    emit("fetch-error", e);
  }
}

// 计算前 5 条总高度（包含 margin）
function calcHeight() {
  const container = listContainer.value;
  if (!container) return;
  const items = Array.from(container.querySelectorAll(".data-item")).slice(0, 5);
  const total = items.reduce((sum, el) => {
    const style = getComputedStyle(el);
    const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    return sum + el.getBoundingClientRect().height + margin;
  }, 0);
  containerHeight.value = total;
}

onMounted(() => {
  isMobile.value = detectMobile();
  if (isMobile.value || !API_URL) return;
  fetchData();
  window.addEventListener("resize", calcHeight);
});
</script>

<style lang="scss" scoped>
.site-data {
  margin-bottom: 1rem;
  .iconfont {
    opacity: 0.6;
    margin-right: 6px;
  }
  .title-name {
    opacity: 0.8;
  }
  .title {
    padding: 0.3rem 0.5rem;
    margin-bottom: 5px;
    font-weight: bold;
    display: flex;
    align-items: center;
    opacity: 0.75;
  }
  .all-data {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    .data-item {
      display: flex;
      align-items: flex-start;
      padding: 0.2rem 0.1rem;
      line-height: 1.4rem;
      font-size: 14px;

      .name {
        flex-shrink: 0;
        width: 1.2rem;
        text-align: center;
        opacity: 0.8;
        font-weight: bold;
      }
      .num {
        flex: 1;
        margin-left: 0.3rem;
        a {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          white-space: normal;
          opacity: 0.8;
          text-decoration: none;
        }
      }

      &:last-child {
        padding-bottom: 0;
      }
    }
  }

  /* 更新时间样式 */
  .update-time {
    margin: 0.2rem 0.5rem;
    font-size: 12px;
    color: #888;
    text-align: right;
  }
}
</style>
