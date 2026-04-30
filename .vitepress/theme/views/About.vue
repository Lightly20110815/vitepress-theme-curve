<template>
  <div class="about">
    <h1 class="title">关于本站</h1>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <div class="about-item hello">
        <span class="text1">你好，很高兴认识你~👋</span>
        <span class="text2 title2">我是 Sy Yann</span>
        <span class="text3">欢迎走近一个名字</span>
      </div>
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
      <div class="about-item child">
        <div
          class="about-item map image"
          style="background-image: url(https://api.ddnsy.fun/Location.png)"
        >
          <span class="position">我现在住在 <strong>中国，安徽省，合肥市</strong></span>
        </div>
      </div>
    </div>
    <div class="about-content" style="display: flex">
      <div class="about-item hello" style="padding: 1.2rem 2rem;">
        <SelfTyping />
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
      <div class="about-item music-card">
        <span class="card-emoji">🎵</span>
        <span class="card-label">喜欢的音乐</span>
        <span class="card-value">VOCALOID</span>
      </div>
      <div class="about-item game-card">
        <span class="card-emoji">🎮</span>
        <span class="card-label">喜欢的游戏</span>
        <span class="card-value">COLORFUL STAGE</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 7fr 3fr">
      <div class="about-item motto-card">
        <span class="tip">座右铭</span>
        <div class="motto-lines">
          <span class="motto-line1">与你进退，</span>
          <span class="motto-line2">也共鸣。</span>
        </div>
      </div>
      <div class="about-item birthday-card">
        <span class="tip">诞生于</span>
        <div class="birthday-big">{{ birthDateStr }}</div>
        <div class="birthday-extra">
          <span class="zodiac">{{ zodiacStr }}</span>
          <span class="age">🌱 {{ ageYears }}岁</span>
        </div>
        <div class="birthday-countdown">
          距下次生日还有 <strong>{{ daysToBirthday }}</strong> 天
        </div>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
      <StatusBadge />
      <ActivityChart />
    </div>
    <div class="about-content" style="display: flex">
      <div class="about-item" style="width: 100%;">
        <span class="tip">特此感谢</span>
        <div class="thanks-list">
          <a href="https://chiyu.it" target="_blank" rel="noopener noreferrer">
            <span class="thanks-avatar">
              <img src="https://chiyu.it/images/logo/logo.webp" alt="池鱼鱼" />
            </span>
            <span class="thanks-name">池鱼鱼</span>
          </a>
          <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">
            <span class="thanks-avatar">
              <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="Gemini" />
            </span>
            <span class="thanks-name">Gemini 2.5 Pro</span>
          </a>
          <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
            <span class="thanks-avatar">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg" alt="ChatGPT" />
            </span>
            <span class="thanks-name">ChatGPT</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStatistics } from "@/api";
import { useData } from "vitepress";
import { onMounted, ref } from "vue";

const { theme } = useData();

const skillsData = [
  { name: "JavaScript", color: "#f1e05abd", icon: "javascript", link: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript" },
  { name: "HTML5", color: "#e34f26", icon: "html5", link: "https://developer.mozilla.org/zh-CN/docs/Web/HTML" },
  { name: "Vue", color: "#41b883", icon: "vue", link: "https://cn.vuejs.org/" },
  { name: "Node.js", color: "#026E00", icon: "nodejs", link: "https://nodejs.org/" },
  { name: "Python", color: "#3776AB", icon: "python", link: "https://www.python.org/" },
  { name: "C++", color: "#00599C", icon: "a-C", custom: true, link: "https://isocpp.org/" },
  { name: "Docker", color: "#2496f2", icon: "docker", link: "https://www.docker.com/" },
  { name: "Git", color: "#F05032", icon: "git", link: "https://git-scm.com/" },
  { name: "ChatGPT", color: "#4AA181", icon: "chatgpt", link: "https://chat.openai.com/" },
];

const statisticsData = ref(null);

// 生日数据
const birthDateStr = '2011年8月15日';
const birthDate = new Date(2011, 7, 15);

const zodiacSign = (month, day) => {
  const signs = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手'];
  const days = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
  return signs[day <= days[month - 1] ? month - 1 : month % 12];
};

const zodiacStr = computed(() => {
  const m = birthDate.getMonth() + 1;
  const d = birthDate.getDate();
  return `${zodiacSign(m, d)}座`;
});

const ageYears = computed(() => {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;
  return age;
});

const daysToBirthday = computed(() => {
  const now = new Date();
  const next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < now) next.setFullYear(next.getFullYear() + 1);
  return Math.ceil((next - now) / (1000 * 60 * 60 * 24));
});

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
  .thanks-list {
    display: flex;
    gap: 20px;
    margin-top: 12px;
    flex-wrap: wrap;
    a {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--main-font-color);
      transition: opacity 0.3s;
      &:hover {
        opacity: 0.7;
      }
      .thanks-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .thanks-name {
        font-size: 0.95rem;
      }
    }
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
      &.child {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        gap: 20px;
        .about-item {
          height: 100%;
        }
      }
      &.hello {
        justify-content: center;
        padding: 2rem;
        color: #fff;
        background-image: linear-gradient(120deg, #5b27ff 0%, #00d4ff 100%);
        background-size: 200% 200%;
        animation: gradientFlow 6s ease infinite;
        .title2 {
          line-height: 2;
        }
      }
      &.music-card, &.game-card {
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 6px;
        padding: 1.5rem;
        color: #fff;
        .card-emoji {
          font-size: 2.5rem;
          margin-bottom: 4px;
        }
        .card-label {
          font-size: 13px;
          opacity: 0.7;
        }
        .card-value {
          font-size: 1.5rem;
          font-weight: bold;
        }
      }
      &.music-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.game-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.motto-card {
        justify-content: center;
        .motto-lines {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          .motto-line1 {
            font-size: 36px;
            font-weight: bold;
            opacity: 0.5;
            line-height: 1.2;
          }
          .motto-line2 {
            font-size: 48px;
            font-weight: bold;
            background: linear-gradient(45deg, #fa7671 30%, #f45f7f 70%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2;
          }
        }
      }
      &.birthday-card {
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 4px;
        .birthday-big {
          font-size: 2rem;
          font-weight: bold;
          line-height: 1.3;
        }
        .birthday-extra {
          display: flex;
          gap: 12px;
          font-size: 13px;
          opacity: 0.7;
          .zodiac {
            color: var(--main-color);
          }
        }
        .birthday-countdown {
          margin-top: 8px;
          font-size: 12px;
          opacity: 0.6;
          strong {
            color: var(--main-color);
          }
        }
      }
      &.pursuit {
        .title2 {
          line-height: 1.2;
          &:last-child {
            display: inline-block;
            background-size: 100% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-repeat: no-repeat;
            background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
          }
        }
      }
      &.skills {
        .skills-list {
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .skills-item {
            display: flex;
            align-items: center;
            margin-right: 10px;
            margin-top: 10px;
            padding: 8px 12px 8px 8px;
            border-radius: 40px;
            background-color: var(--main-site-background);
            border: 1px solid var(--main-card-border);
            box-shadow: 0 8px 12px -4px var(--main-border-shadow);
            transition: background-color 0.3s;
            cursor: pointer;
            .skills-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              margin-right: 8px;
              border-radius: 50%;
              background-color: var(--color);
              .iconfont, .myicons {
                color: #fff;
              }
            }
            .skills-name {
              font-weight: bold;
              transition: color 0.3s;
            }
            &:hover {
              background-color: var(--main-card-background);
            }
          }
        }
      }
      &.image {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        .image-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
          color: #fff;
          .image-desc {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            &.opacity {
              font-size: 14px;
              color: #eee;
              opacity: 0.8;
              a {
                color: #eee;
                &:hover {
                  color: var(--main-color);
                }
              }
            }
          }
        }
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          box-shadow: inset 0 -70px 204px 10px var(--color);
          z-index: 0;
        }
      }
      &.static {
        .static-data {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr 1fr;
          margin: 20px 0;
          .static-item {
            display: flex;
            flex-direction: column;
            .static-name {
              font-size: 15px;
              opacity: 0.8;
            }
            .static-num {
              font-size: 34px;
              font-weight: bold;
            }
          }
        }
      }
      &.map {
        min-height: 170px;
        background-size: 100%;
        transition: background 1.5s ease-in-out;
        cursor: pointer;
        @media (max-width: 768px) {
          background-size: cover;
          pointer-events: none;
        }
        .position {
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          padding: 20px 30px;
          color: #fff;
          background-color: #636352;
          font-size: 20px;
          transition: bottom 1s;
        }
        &:hover {
          background-size: 120%;
          background-position-x: 0;
          background-position-y: 36%;
          .position {
            bottom: -80px;
          }
        }
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
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
