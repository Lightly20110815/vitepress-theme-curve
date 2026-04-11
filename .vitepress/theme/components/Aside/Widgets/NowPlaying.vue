<template>
  <div
    v-if="theme.aside.nowPlaying?.enable !== false && playerShow"
    class="now-playing s-card"
    :class="{ playing: playState }"
    @click.self="togglePlay"
  >
    <!-- 进度条背景 — 用 scaleX 代替 width，GPU加速 -->
    <div class="progress-bar" :style="{ transform: 'scaleX(' + progress / 100 + ')' }" />

    <div class="np-content" @click.self="togglePlay">
      <!-- 封面图 -->
      <div class="np-cover" :class="{ spinning: playState }" @click="togglePlay">
        <img
          v-if="coverUrl"
          :src="coverUrl"
          alt="cover"
          loading="lazy"
        />
        <div v-else class="np-cover-placeholder">
          <span>🎵</span>
        </div>
        <div class="np-cover-overlay">
          <svg v-if="!playState" class="np-icon-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="np-icon-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </div>
      </div>

      <!-- 歌曲信息区域 -->
      <div class="np-info" @click="togglePlay">
        <div class="np-status">
          <span class="np-status-dot" :class="{ active: playState }" />
          <span class="np-status-text">{{ playState ? '正在播放' : '已暂停' }}</span>
        </div>
        <!-- 歌名：过长时滚动 -->
        <div class="np-name-wrapper" :class="{ 'has-marquee': needsMarquee }" ref="wrapperRef">
          <div
            class="np-name"
            :class="{ marquee: needsMarquee }"
            :title="playerData.name"
          >
            <span ref="nameTextRef" class="np-name-text">{{ playerData.name }}</span>
            <span v-if="needsMarquee" class="np-name-text np-name-dup">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ playerData.name }}</span>
          </div>
        </div>
        <div class="np-artist" :title="playerData.artist">{{ playerData.artist }}</div>
      </div>
    </div>

    <!-- 控制按钮 — 单独一行 -->
    <div class="np-bottom">
      <div class="np-controls">
        <button class="np-btn" @click.stop="prevTrack" title="上一首">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button class="np-btn np-btn-play" @click.stop="togglePlay" :title="playState ? '暂停' : '播放'">
          <svg v-if="!playState" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
        <button class="np-btn" @click.stop="nextTrack" title="下一首">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      <!-- 音乐可视化动画条 -->
      <div v-if="playState" class="np-visualizer">
        <span class="bar" v-for="i in 4" :key="i" :style="{ animationDelay: (i * 0.15) + 's' }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { mainStore } from '@/store'

const store = mainStore()
const { theme } = useData()
const { playState, playerShow, playerData } = storeToRefs(store)

const coverUrl = ref('')
const progress = ref(0)
let animFrameId = null

// 歌名滚动
const wrapperRef = ref(null)
const nameTextRef = ref(null)
const needsMarquee = ref(false)

const checkMarquee = () => {
  nextTick(() => {
    if (!wrapperRef.value || !nameTextRef.value) return
    const wrapperWidth = wrapperRef.value.offsetWidth
    const textWidth = nameTextRef.value.offsetWidth
    needsMarquee.value = textWidth > wrapperWidth - 4
  })
}

const updateCover = () => {
  try {
    const player = window.$player
    if (!player) return
    const audio = player.list?.audios?.[player.list?.index]
    if (audio?.cover) {
      coverUrl.value = audio.cover
    } else {
      const picDom = document.querySelector('.aplayer-pic')
      if (picDom) {
        const bgImage = getComputedStyle(picDom).backgroundImage
        const match = bgImage.match(/url\(["']?(.*?)["']?\)/)
        if (match?.[1]) coverUrl.value = match[1]
      }
    }
  } catch (e) {
    console.warn('获取封面失败：', e)
  }
}

const updateProgress = () => {
  try {
    const player = window.$player
    if (!player?.audio) return
    const current = player.audio.currentTime || 0
    const duration = player.audio.duration || 0
    if (duration > 0) {
      progress.value = Math.round((current / duration) * 1000) / 10 // 保留1位小数即可
    }
  } catch (e) {}
}

// 使用 requestAnimationFrame 驱动进度更新，每秒只更新一次
let lastProgressUpdate = 0
const progressLoop = (timestamp) => {
  if (timestamp - lastProgressUpdate > 1000) { // 每秒更新一次
    updateProgress()
    lastProgressUpdate = timestamp
  }
  animFrameId = requestAnimationFrame(progressLoop)
}

const startProgressLoop = () => {
  stopProgressLoop()
  lastProgressUpdate = 0
  animFrameId = requestAnimationFrame(progressLoop)
}

const stopProgressLoop = () => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
}

const togglePlay = () => {
  try {
    const player = window.$player
    if (player) player.toggle()
  } catch (e) {
    console.warn('切换播放状态失败：', e)
  }
}

const prevTrack = () => {
  try {
    const player = window.$player
    if (player) player.skipBack()
  } catch (e) {
    console.warn('切换上一首失败：', e)
  }
}

const nextTrack = () => {
  try {
    const player = window.$player
    if (player) player.skipForward()
  } catch (e) {
    console.warn('切换下一首失败：', e)
  }
}

watch(playState, (val) => {
  if (val) startProgressLoop()
  else stopProgressLoop()
  nextTick(() => updateCover())
})

watch(playerData, () => {
  needsMarquee.value = false
  nextTick(() => {
    updateCover()
    updateProgress()
    setTimeout(checkMarquee, 100)
  })
}, { deep: true })

onMounted(() => {
  setTimeout(() => {
    updateCover()
    checkMarquee()
    if (playState.value) startProgressLoop()
  }, 2000)
})

onBeforeUnmount(() => {
  stopProgressLoop()
})
</script>

<style lang="scss" scoped>
.now-playing {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: 14px 16px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: var(--main-color);
    box-shadow: 0 4px 16px -4px var(--main-color-bg);
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--main-color);
    opacity: 0.06;
    transform-origin: left center;
    transition: transform 1s linear;
    border-radius: inherit;
    pointer-events: none;
    will-change: transform;
  }

  &.playing .progress-bar {
    opacity: 0.1;
  }
}

.np-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
}

.np-cover {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--main-card-border);
  background: var(--main-card-border);
  transition: border-color 0.3s;
  cursor: pointer;
  position: relative;

  &.spinning {
    animation: rotate 12s linear infinite;
    border-color: var(--main-color);
    will-change: transform;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .np-cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  .np-cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 50%;
  }

  &:hover .np-cover-overlay {
    opacity: 1;
  }

  .np-icon-sm {
    width: 18px;
    height: 18px;
    color: #fff;
  }
}

.np-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.np-status {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.np-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--main-font-second-color);
  transition: background 0.3s;

  &.active {
    background: #1db954;
    box-shadow: 0 0 6px rgba(29, 185, 84, 0.5);
    animation: pulse-dot 2s ease-in-out infinite;
  }
}

.np-status-text {
  font-size: 0.7rem;
  color: var(--main-font-second-color);
  opacity: 0.7;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* 歌名滚动 */
.np-name-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;

  &.has-marquee {
    mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
  }
}

.np-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--main-font-color);
  white-space: nowrap;
  line-height: 1.4;

  &:not(.marquee) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.marquee {
    display: inline-flex;
    animation: marquee-scroll 8s linear infinite;
    width: max-content;
    will-change: transform;
  }
}

.np-name-dup {
  // 用于无缝循环的第二份歌名
}

.np-artist {
  font-size: 0.78rem;
  color: var(--main-font-second-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

/* 底部：控制按钮 + 可视化条 */
.np-bottom {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  z-index: 1;
}

.np-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.np-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--main-font-color);
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
  padding: 0;
  opacity: 0.6;

  &:hover {
    opacity: 1;
    background: var(--main-color-bg);
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    display: block;
  }
}

.np-btn-play {
  width: 32px;
  height: 32px;
  opacity: 0.8;
  background: var(--main-color-bg);

  &:hover {
    opacity: 1;
    background: var(--main-color);
    color: var(--main-card-background);
  }
}

.np-visualizer {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;

  .bar {
    width: 3px;
    border-radius: 1.5px;
    background: var(--main-color);
    opacity: 0.6;
    animation: visualizer-bounce 0.8s ease-in-out infinite alternate;
    will-change: transform;

    &:nth-child(1) { height: 4px; }
    &:nth-child(2) { height: 8px; }
    &:nth-child(3) { height: 6px; }
    &:nth-child(4) { height: 10px; }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

@keyframes visualizer-bounce {
  0% { height: 3px; }
  100% { height: 14px; }
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
