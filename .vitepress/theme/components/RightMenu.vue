<template>
  <Teleport to="body">
    <Transition name="fade" mode="out-in">
      <div
        v-if="rightMenuShow"
        class="right-menu"
        @click="rightMenuShow = false"
        @contextmenu.stop="closeRightMenu"
      >
        <div
          :style="{ left: rightMenuX + 'px', top: rightMenuY + 'px' }"
          ref="rightMenuRef"
          class="menu-content s-card hover"
          @contextmenu.stop="closeRightMenu"
        >
          <div class="tools">
            <div class="btn" title="后退" @click="rightMenuFunc('back')">
              <i class="iconfont icon-left"></i>
            </div>
            <div class="btn" title="前进" @click="rightMenuFunc('forward')">
              <i class="iconfont icon-right"></i>
            </div>
            <div class="btn" title="刷新" @click="rightMenuFunc('reload')">
              <i class="iconfont icon-refresh"></i>
            </div>
            <div class="btn" title="返回顶部" @click="smoothScrolling">
              <i class="iconfont icon-arrow-up"></i>
            </div>
          </div>

          <div class="all-menu">
            <div v-if="clickedType === 'normal'" class="btn" @click="router.push(shufflePost(theme.postData))">
              <i class="iconfont icon-shuffle"></i>
              <span class="name">随便逛逛</span>
            </div>
            <div v-if="clickedType === 'normal'" class="btn" @click="router.push('/pages/categories')">
              <i class="iconfont icon-folder"></i>
              <span class="name">全部分类</span>
            </div>
            <div v-if="clickedType === 'normal'" class="btn" @click="router.push('/pages/tags')">
              <i class="iconfont icon-hashtag"></i>
              <span class="name">全部标签</span>
            </div>

            <div v-if="clickedType === 'link'" class="btn" @click="rightMenuFunc('open-link')">
              <i class="iconfont icon-window"></i>
              <span class="name">新标签页打开</span>
            </div>
            <div
              v-if="clickedType === 'link'"
              class="btn"
              @click="copyText(clickedTypeData?.getAttribute('original-href') || clickedTypeData?.href)"
            >
              <i class="iconfont icon-link"></i>
              <span class="name">复制链接地址</span>
            </div>

            <div v-if="clickedType === 'image'" class="btn" @click="copyImage(clickedTypeData?.src)">
              <i class="iconfont icon-image-copy"></i>
              <span class="name">复制此图片</span>
            </div>
            <div v-if="clickedType === 'image'" class="btn" @click="downloadImage(clickedTypeData?.src)">
              <i class="iconfont icon-download"></i>
              <span class="name">下载此图片</span>
            </div>

            <div v-if="clickedType === 'input' && typeof clickedTypeData.value === 'string'" class="btn" @click="rightMenuFunc('input-paste')">
              <i class="iconfont icon-paste"></i>
              <span class="name">粘贴文本</span>
            </div>

            <a
              v-if="(clickedType === 'text' || clickedType === 'input') && isLink(clickedTypeData)"
              :href="`${isLink(clickedTypeData)}`"
              class="btn right-menu-link"
              target="_blank"
            >
              <i class="iconfont icon-link"></i>
              <span class="name">在新标签页打开</span>
            </a>

            <a
              v-if="clickedType === 'text' || clickedType === 'input'"
              :href="`https://www.baidu.com/s?wd=${encodeURIComponent(clickedTypeData)}`"
              class="btn right-menu-link"
              target="_blank"
            >
              <i class="iconfont icon-baidu"></i>
              <span class="name">使用百度搜索</span>
            </a>

            <a
              v-if="clickedType === 'text' || clickedType === 'input'"
              :href="`https://cn.bing.com/search?q=${encodeURIComponent(clickedTypeData)}`"
              class="btn right-menu-link"
              target="_blank"
            >
              <i class="iconfont icon-bing"></i>
              <span class="name">使用必应搜索</span>
            </a>

            <div v-if="clickedType === 'text' || clickedType === 'input'" class="btn" @click="copyText(clickedTypeData)">
              <i class="iconfont icon-copy"></i>
              <span class="name">复制选中文本</span>
            </div>

            <div
              v-if="clickedType === 'text' && !commentCopyShow && theme.comment.type === 'artalk'"
              class="btn"
              @click="commentCopy(clickedTypeData)"
            >
              <i class="iconfont icon-chat"></i>
              <span class="name">评论选中内容</span>
            </div>
          </div>

          <div class="all-menu general">
            <div class="btn" @click="rightMenuFunc('copy-link')">
              <i class="iconfont icon-copy"></i>
              <span class="name">复制本页地址</span>
            </div>
            <div class="btn" @click.stop="store.changeThemeType">
              <i :class="`iconfont icon-${themeType === 'auto' ? 'dark' : themeType === 'dark' ? 'light' : 'auto'}`" />
              <span class="name">
                {{ themeType === "auto" ? "深色模式" : themeType === "dark" ? "浅色模式" : "跟随系统" }}
              </span>
            </div>
          </div>

          <div v-if="playerShow && playerData?.name && playerData.name !== '未知曲目'" class="all-menu general player">
            <div class="data">
              <span class="name">{{ playerData.name }}</span>
              <span class="artist">{{ playerData.artist }}</span>
            </div>
            <div class="volume" @click.stop>
              <i class="iconfont icon-volume-down" @click="playerVolume = Math.max(0, playerVolume - 0.1)" />
              <Slider :value="playerVolume" @update="(val) => (playerVolume = val)" />
              <i class="iconfont icon-volume-up" @click="playerVolume = Math.min(1, playerVolume + 0.1)" />
            </div>
            <div class="control" @click.stop>
              <div class="btn" title="上一曲" @click="playerControl('prev')"><i class="iconfont icon-prev"></i></div>
              <div v-if="playState" class="btn" title="暂停" @click="playerControl('toggle')"><i class="iconfont icon-pause"></i></div>
              <div v-else class="btn" title="播放" @click="playerControl('toggle')"><i class="iconfont icon-play"></i></div>
              <div class="btn" title="下一曲" @click="playerControl('next')"><i class="iconfont icon-next"></i></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Modal
      :show="commentCopyShow"
      title="快速评论"
      titleIcon="chat"
      @mask-click="commentCopyClose"
      @modal-close="commentCopyClose"
    >
      <span class="modal-tip">您无需删除现有的输入框内容，直接在下方评论即可</span>
      <Artalk :fill="commentCopyData" />
    </Modal>
  </Teleport>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter, useData } from "vitepress";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";
import { smoothScrolling, shufflePost, copyText, copyImage, downloadImage } from "@/utils/helper";

const router = useRouter();
const { theme } = useData();
const store = mainStore();
const { themeType, playerShow, playerVolume, playState, playerData } = storeToRefs(store);

const rightMenuShow = ref(false);
const rightMenuX = ref(0);
const rightMenuY = ref(0);
const rightMenuRef = ref(null);
const clickedType = ref("normal");
const clickedTypeData = ref(null);

const commentCopyShow = ref(false);
const commentCopyData = ref(null);

const openRightMenu = (e) => {
  if (e.ctrlKey) return true;
  if (window.innerWidth < 768) return true;
  e.preventDefault();
  rightMenuShow.value = false;
  checkClickType(e?.target);
  nextTick(() => {
    rightMenuShow.value = true;
    nextTick(() => calculateMenuPosition(e));
  });
};

const calculateMenuPosition = (e) => {
  const menuWidth = rightMenuRef.value?.offsetWidth || 200;
  const menuHeight = rightMenuRef.value?.offsetHeight || 300;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  let x = e.clientX, y = e.clientY, margin = 20;
  if (x + menuWidth > screenWidth - margin) x = screenWidth - menuWidth - margin;
  if (y + menuHeight > screenHeight - margin) y = screenHeight - menuHeight - margin;
  rightMenuX.value = Math.max(x, margin);
  rightMenuY.value = Math.max(y, margin);
};

const closeRightMenu = (e) => {
  e?.preventDefault();
  rightMenuShow.value = false;
};

const checkClickType = (target) => {
  if (!target?.tagName) return;
  clickedTypeData.value = window.getSelection().toString().length > 0 ? window.getSelection().toString() : target;
  switch (target.tagName) {
    case "A": clickedType.value = "link"; break;
    case "IMG": clickedType.value = "image"; break;
    case "INPUT":
    case "TEXTAREA": clickedType.value = "input"; break;
    default:
      clickedType.value = window.getSelection().toString().length > 0 ? "text" : "normal";
  }
};

const rightMenuFunc = async (type) => {
  switch (type) {
    case "back": window.history.back(); break;
    case "forward": window.history.forward(); break;
    case "reload": window.location.reload(); break;
    case "open-link": window.open(clickedTypeData.value?.href); break;
    case "copy-link":
      const pageLink = theme.value?.siteMeta?.site + router.route.path;
      if (pageLink) copyText(pageLink);
      break;
    case "input-paste":
      const text = await navigator.clipboard.readText();
      if (typeof clickedTypeData.value?.value === "string") {
        const el = clickedTypeData.value;
        const { selectionStart, selectionEnd, value } = el;
        el.value = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
      }
      break;
  }
};

const playerControl = (type) => {
  if (typeof $player !== "object") return;
  switch (type) {
    case "toggle": $player.toggle(); break;
    case "next": $player.skipForward(); $player.play(); break;
    case "prev": $player.skipBack(); $player.play(); break;
  }
};

const isLink = (data) => {
  if (!data) return false;
  const url = /^(https?:\/\/)/i.test(data) ? data : `http://${data}`;
  try { new URL(url); return url; } catch { return false; }
};

const commentCopy = (data) => {
  if (!data) return;
  let commentData = "> " + data.trim().replace(/\s+/g, " ");
  if (commentData.length >= 200) commentData = commentData.substring(0, 200) + "...";
  commentCopyData.value = commentData;
  commentCopyShow.value = true;
};

const commentCopyClose = () => {
  commentCopyShow.value = false;
  if (typeof $comment !== "undefined") $comment.reload();
};

defineExpose({ openRightMenu });
</script>

<style lang="scss" scoped>
.right-menu {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 9999;
  .menu-content {
    position: absolute;
    width: 180px;
    background-color: var(--main-card-background);
    .tools {
      display: flex; justify-content: space-between;
      padding-bottom: 12px; border-bottom: 1px solid var(--main-card-border);
      .btn { width: 34px; height: 34px; }
    }
    .all-menu {
      margin-top: 12px;
      .btn {
        display: flex; align-items: center; justify-content: flex-start;
        padding: 8px; border-radius: 8px;
        margin-bottom: 6px; transition: 0.3s;
        .iconfont { font-size: 20px; margin-right: 8px; }
        &:hover { color: var(--main-card-background); background: var(--main-color); }
      }
      &.general { border-top: 1px solid var(--main-card-border); padding-top: 12px; }
    }
  }
}
.modal-tip {
  display: block; margin-top: -4px; margin-bottom: 1rem;
  font-size: 15px; color: var(--main-font-second-color);
  padding: 8px 0 8px 12px;
  border-left: 4px solid var(--main-card-border);
  background-color: var(--main-card-second-background);
}
</style>
