---
title: 给你的Curve主题添加一个出生天数的侧边栏
tags: [开发]
categories: [开发教程]
date: 2025-08-04
description: Curve 主题：出生天数侧边栏
---

::: warning
在开始使用实践之前，你需要注意，你可能会遇到**一系列的问题**，请确保你有**独立解决问题**的能力。<br>
如果你想修改主题的某些组件或样式，你还需要掌握 **Vue.js** 的相关知识<br>
:::
## 新建 Birthday.vue 文件
新建在：`.vitepress\theme\components\Aside\Widgets\Birthday.vue`<br>
写入：
```vue
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

```

## 修改 index.vue
修改index.vue使Birthday.vue挂载在侧边<br>
index.vue路径：<br>
`.vitepress\theme\components\Aside\index.vue`

```vue{12}
<template>
  <aside class="main-aside">
    <Hello v-if="theme.aside.hello.enable" class="weidgets" />
    <div class="sticky">
      <Toc v-if="theme.aside.toc.enable && showToc" class="weidgets" />
      <Weather
        v-if="theme.aside.weather.enable && showWeather"
        class="weidgets"
        @fetch-error="onWeatherError"
      />
      <Countdown class="weidgets" />
      <Birthday class="weidgets" />
      <HelloGithubHot
        v-if="theme.aside.HelloGithub.enable && showHot"
        @fetch-error="onHotError"
      />
      <Tags v-if="theme.aside.tags.enable" class="weidgets" />
      <SiteData v-if="theme.aside.siteData.enable" class="weidgets" />
    </div>
  </aside>
</template>
```

```vue{2}
<script setup>
import Birthday from './Widgets/Birthday.vue'
const { theme } = useData(); 
```

## 修改 themeConfig.mjs
`.vitepress\theme\assets\themeConfig.mjs`
```js
birthDate: {
  enable: true,
  name: "Sy Yann", //要显示的名字
  date: "2011-08-15", //出生日期
},
```

## 完成
> 按照步骤做完后，run dev保存应该就可以看见一个出生天数卡片出现在右边了。祝愉快~