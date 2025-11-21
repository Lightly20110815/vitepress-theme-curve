<template>
  <aside class="main-aside">
    <Hello v-if="theme.aside.hello.enable" class="weidgets" />
    <div class="sticky">
      <Toc v-if="theme.aside.toc.enable && showToc" class="weidgets" />
<<<<<<< HEAD
      <Weather
        v-if="theme.aside.weather.enable && showWeather"
        class="weidgets"
        @fetch-error="onWeatherError"
      />
      <Countdown class="weidgets" />
      
      <Birthday class="weidgets" /> <!-- 新增生日组件 这里需要class才可以与上下隔开 不然会粘在一起-->

      <!-- 修改：添加时间判断逻辑 -->
      <!-- <RandomQuote
        v-if="theme.aside.randomQuote.enable && isNightTime"
        class="weidgets"
      /> -->
      <RandomQuote v-if="theme.aside.randomQuote.enable" class="weidgets" />

      <HelloGithubHot
        v-if="theme.aside.HelloGithub.enable && showHot"
        @fetch-error="onHotError"
      />
=======
  <Weather
    v-if="theme.aside.weather.enable && showWeather"
    class="weidgets"
    @fetch-error="onWeatherError"
  />
      <Countdown v-if="theme.aside.countDown.enable" class="weidgets" />
      <Timing v-if="theme.aside.timing.enable" class="weidgets" />
      <!-- HelloGithub 热榜 -->
    <HelloGithubHot
      v-if="theme.aside.HelloGithub.enable && showHot"
      @fetch-error="onHotError"
    />
>>>>>>> upstream/master
      <Tags v-if="theme.aside.tags.enable" class="weidgets" />
      <SiteData v-if="theme.aside.siteData.enable" class="weidgets" />
    </div>
  </aside>
</template>

<script setup>
import Birthday from './Widgets/Birthday.vue' // 生日组件
import RandomQuote from './Widgets/randomquote.vue' // 随机一言组件
// import Hello from './Widgets/Hello.vue' // 打招呼组件
// import Toc from './Widgets/Toc.vue' // 目录组件
// import Weather from './Widgets/Weather.vue' // 天气组件
// import Countdown from './Widgets/Countdown.vue' // 倒计时组件
// import HelloGithubHot from './Widgets/HelloGithubHot.vue' // HelloGithub 热榜组件
// import Tags from './Widgets/Tags.vue' // 标签组件
// import SiteData from './Widgets/SiteData.vue' // 站点数据组件
const { theme } = useData(); 
const props = defineProps({
  // 显示目录
  showToc: {
    type: Boolean,
    default: false,
  },
});

// 已有：天气组件的显示开关
const showWeather = ref(true)
<<<<<<< HEAD
const showHot = ref(true)

// 判断当前时间是否在 23:00 到 4:00
const isNightTime = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 23 || hour < 4;
});

=======
// 新增：热榜组件的显示开关
const showHot = ref(true)
>>>>>>> upstream/master
// 一旦收到子组件的 fetch-error 事件，就把 showWeather 置为 false
function onWeatherError(err) {
  console.error('天气组件获取失败：', err)
  showWeather.value = false
}
<<<<<<< HEAD
=======

>>>>>>> upstream/master
function onHotError(err) {
  console.error('HelloGithub 热榜获取失败：', err)
  showHot.value = false
}
</script>

<style lang="scss" scoped>
.main-aside {
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  animation: fade-up 0.6s 0.3s backwards;
  .weidgets {
    padding: 18px;
    margin-bottom: 1rem;
    :deep(.title) {
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
      }
    }
  }
  .sticky {
    position: sticky;
    top: calc(60px + 1rem);
    .weidgets {
      animation: fade-up 0.6s 0.4s backwards;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>