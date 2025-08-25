<template>
  <div class="about">
    <h1 class="title">关于本站</h1>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 介绍 -->
      <div class="about-item hello">
        <span class="text1">你好，很高兴认识你👋</span>
        <span class="text2 title2">我是 Sy Yann</span>
        <span class="text3">描述？我也不知道写什么</span>
      </div>
      <!-- 追求 -->
      <!--
      <div class="about-item pursuit">
        <span class="tip">#</span>
        <span class="title2">#</span>
        <span class="title2">#</span>
        <span class="title2">#</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      -->
      <!-- 技能 -->

      <div class="about-item skills">
        <span class="tip">技能</span>
        <span class="title2">我不会的玩意</span>
        <div class="skills-list">
          <a
            v-for="(item, index) in skillsData"
            :key="index"
            :style="{ '--color': item.color }"
            :href="item.link"
            class="skills-item"
            target="_blank"
          >
            <div class="skills-logo">
              <i :class="item.custom ? `myicons myicon-${item.icon}` : `iconfont icon-${item.icon}`"></i>
            </div>
            <span class="skills-name">{{ item.name }}</span>
          </a>
        </div>
      </div>

      <!-- 生涯 -->
       <!--
      <div class="about-item career">
        <span class="tip">生涯</span>
        <span class="title2">
          <i>無限進步</i>
        </span>
        <div class="list">
          <span class="list-item" style="--color: #357ef5">#</span>
          <span class="list-item" style="--color: #eb372a">#</span>
        </div>
        <img
          class="career-img"
          src="https://pic.efefee.cn/uploads/2024/02/22/65d71db18bcf9.png"
          alt="career"
        />
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      -->
      <!-- 性格 -->
       <!--
      <div class="about-item character" style="--color: #4298b4">
        <span class="tip">#</span>
        <span class="title2">#</span>
        <span class="title2" style="color: var(--color)">#</span>
        <span class="more">
          在
          <a href="#" target="_blank">16personalities</a>
          了解更多关于
          <a href="#" target="_blank">
            #
          </a>
        </span>
        <img
          src="#"
          alt="male"
          class="male"
        />
      </div>
    -->
      <!-- 座右铭 -->
      <!--
      <div class="about-item">
        <span class="tip">#</span>
        <span class="title1" style="margin-top: 20px">#，</span>
        <span class="title2">#。</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
      <div
        class="about-item like image"
        style="
          --color: #0c0e20;
          background-image: url(https://picsum.photos/800/400?random=1);
        "
      >
        <div class="image-content">
          <span class="tip">✧</span>
          <span class="title2">✧</span>
          <div class="image-desc">
            <span class="left">✧</span>
          </div>
        </div>
      </div>
      <div
        class="about-item like image"
        style="
          --color: #7b3c25;
          background-image: url(https://picsum.photos/800/400?random=2);
        "
      >
        <div class="image-content">
          <span class="tip">✧</span>
          <span class="title2">✧</span>
          <div class="image-desc">
            <span class="left">✧</span>
          </div>
        </div>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
    -->
      <!-- 数据 -->

      <div
        class="about-item static image"
        style="
          --color: #0f1114;
          background-image: url(https://picsum.photos/800/400?random=3);
        "
      >
        <div class="image-content">
          <span class="tip">数据</span>
          <span class="title2">访问统计</span>
          <div class="static-data">
            <div v-for="(item, key, index) in statisticsData" :key="index" class="static-item">
              <span class="static-name">{{ key }}</span>
              <span class="static-num">{{ item }}</span>
            </div>
          </div>
          <div class="image-desc opacity">
            <span class="left">
              统计信息来自 <a href="https://v6.51.la/" target="_blank">51la</a>
            </span>
          </div>
        </div>
      </div>

      <!-- 信息 -->
      <div class="about-item child">
        <div
          class="about-item map image"
          style="background-image: url(https://api.ddnsy.fun/Location.png)"
        >
          <span class="position">我现在住在 <strong>中国，安徽省，合肥市</strong></span>
        </div>
      </div>
    </div>
    <!-- 心路历程 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">关于这个Digital Garden</span>
        <span class="title2">一座收容内心喧嚣的孤岛</span>
        <p class="text">
          把所有破碎的呓语，说给潮汐和自己听。
        </p>
      </div>
    </div>
    <!-- 座右铭 -->
    <div class="about-content" style="display: flex">
      <div class="about-item" style="width: 100%;">
        <span class="tip">座右铭</span>
        <span class="title1" style="margin-top: 20px">与你进退，</span>
        <span class="title2">也共鸣。</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
        <div class="about-item" style="justify-content: center; align-items: center; text-align: center;">
            <span class="tip">喜欢的音乐风格</span>
            <span class="title2" style="margin-top: 20px; margin-right: 0;">VOCALOID</span>
        </div>
        <div class="about-item" style="justify-content: center; align-items: center; text-align: center;">
            <span class="tip">喜欢的游戏</span>
            <span class="title2" style="margin-top: 20px; margin-right: 0;">COLORFUL STAGE</span>
        </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr 1fr">
        <div class="about-item" style="justify-content: center; align-items: center; text-align: center;">
            <span class="tip">诞</span>
            <span class="title2" style="margin-top: 20px; margin-right: 0;">2011年</span>
        </div>
        <div class="about-item" style="justify-content: center; align-items: center; text-align: center;">
            <span class="tip">生</span>
            <span class="title2" style="margin-top: 20px; margin-right: 0;">8月</span>
        </div>
        <div class="about-item" style="justify-content: center; align-items: center; text-align: center;">
            <span class="tip">于</span>
            <span class="title2" style="margin-top: 20px; margin-right: 0;">15日</span>
        </div>
    </div>

    <!-- 修改后的致谢区块 -->
    <div class="about-content" style="display: flex;">
      <div class="about-item" style="width: 100%;">
        <span class="tip">致谢！</span>
        <p class="text" style="margin-top: 1rem;">
          <a href="https://chiyu.it" target="_blank" rel="noopener noreferrer">
            超厉害的 @池鱼鱼 !
          </a>
        </p>
        <p class="text">
          <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">
            提供灵感的 @Gemini
          </a>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { getStatistics } from "@/api";
import { useData } from "vitepress";
import { onMounted, ref } from "vue";

const { theme } = useData();

// 技能数据
const skillsData = [
  {
    name: "JavaScript",
    color: "#f1e05abd",
    icon: "javascript",
    link: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript",
  },
  {
    name: "HTML5",
    color: "#e34f26",
    icon: "html5",
    link: "https://developer.mozilla.org/zh-CN/docs/Web/HTML",
  },
  {
    name: "Vue",
    color: "#41b883",
    icon: "vue",
    link: "https://cn.vuejs.org/",
  },
  {
    name: "Node.js",
    color: "#026E00",
    icon: "nodejs",
    link: "https://nodejs.org/",
  },
  {
    name: "Python",
    color: "#3776AB",
    icon: "python",
    link: "https://www.python.org/",
  },
  {
    name: "C++",
    color: "#00599C",
    icon: "C++",
    link: "https://isocpp.org/",
    custom: true,
  },
  {
    name: "Docker",
    color: "#2496f2",
    icon: "docker",
    link: "https://www.docker.com/",
  },
  {
    name: "Git",
    color: "#F05032",
    icon: "git",
    link: "https://git-scm.com/",
  },
  {
    name: "ChatGPT",
    color: "#4AA181",
    icon: "chatgpt",
    link: "https://chat.openai.com/",
  },
];

const statisticsData = ref(null);

// 获取站点统计数据
const getStatisticsData = async () => {
  if (theme.value.tongji && theme.value.tongji["51la"]) {
    const result = await getStatistics(theme.value.tongji["51la"]);
    statisticsData.value = result;
  }
};

onMounted(() => {
  getStatisticsData();
});
</script>

<style lang="scss" scoped>
.about {
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
  }
  .about-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    margin-bottom: 20px;
    .about-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 12px;
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      box-shadow: 0 8px 12px -4px var(--main-border-shadow);
      overflow: hidden;
      .tip {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 12px;
      }
      .title1 {
        font-size: 36px;
        font-weight: bold;
        opacity: 0.6;
      }
      .title2 {
        font-size: 36px;
        font-weight: bold;
        margin-right: 4rem;
      }
      .text {
        font-size: 18px;
        margin: 0.6rem 0;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
