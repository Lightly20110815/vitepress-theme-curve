<!-- 侧边栏 - 天气数据 -->
<template>
  <div class="weather-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">天气数据</span>
    </div>

    <div class="all-data">
      <!-- 城市 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-home"></i> 城市</span>
        <span class="num">{{ weatherData?.city || '--' }}</span>
      </div>
      <!-- 温度 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-fire"></i> 温度</span>
        <span class="num">
          {{ weatherData?.temperature != null ? weatherData.temperature + '℃' : '--' }}
        </span>
      </div>
      <!-- 湿度 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-visibility"></i> 湿度</span>
        <span class="num">
          {{ weatherData?.humidity != null ? weatherData.humidity + '%' : '--' }}
        </span>
      </div>
      <!-- 风向 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-arrow-right"></i> 风向</span>
        <span class="num">{{ weatherData?.winddirection || '--' }}</span>
      </div>
      <!-- 风力 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-refresh"></i> 风力</span>
        <span class="num">{{ weatherData?.windpower || '--' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAdcode, getWeather } from '@/api'

// 声明会在请求出错时抛出的事件
const emit = defineEmits(['fetch-error'])

const weatherData = ref(null)
const loading     = ref(true)
const error       = ref(false)

// 移动端检测：若是移动端，则不请求，直接不渲染
const isMobile = /Mobi|Android|iPhone|iPad|Pad|iPod/i.test(navigator.userAgent)

onMounted(async () => {
  if (isMobile) {
    loading.value = false
    return
  }
  try {
    const { adcode }        = await getAdcode(import.meta.env.VITE_WEATHER_KEY)
    const { lives }         = await getWeather(import.meta.env.VITE_WEATHER_KEY, adcode)
    weatherData.value       = lives[0]
  } catch (e) {
    console.error('获取天气失败：', e)
    error.value = true
    // 向父组件抛出“fetch-error”事件
    emit('fetch-error', e)
  } finally {
    loading.value = false
  }
})
</script>


<style lang="scss" scoped>
.weather-data {
  .all-data {
    display: flex;
    flex-direction: column;
    margin-top: 12px;

    .data-item {
      width: 100%;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;

      .name {
        font-weight: 500;
        display: flex;
        align-items: center;
        i {
          margin-right: 4px;
        }
      }

      .num {
        font-size: 1.1em;
      }
    }
  }
}
</style>



