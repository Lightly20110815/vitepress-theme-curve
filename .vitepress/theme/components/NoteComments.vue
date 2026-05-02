<!-- 单条随笔的评论区（按 noteId 隔离） -->
<template>
  <div v-if="theme.comment.enable" class="note-comments">
    <div ref="commentRef" :class="['comment-dom', theme.comment.type]" />
  </div>
</template>

<script setup>
import { jumpRedirect } from "@/utils/commonTools";
import initComments from "@/utils/initComments";

const route = useRoute();
const { theme } = useData();
const commentRef = ref(null);
const instance = ref(null);

const props = defineProps({
  notePath: { type: String, required: true },
});

const initComment = async () => {
  try {
    await nextTick();
    const Comment = await initComments(theme.value);
    const type = theme.value.comment.type;
    if (type === "twikoo") {
      instance.value = Comment.init({
        el: commentRef.value,
        envId: theme.value.comment.twikoo.envId,
        path: props.notePath,
        onCommentLoaded: () => jumpRedirect(null, theme.value, true),
      });
    } else if (type === "artalk") {
      instance.value = Comment.init({
        el: commentRef.value,
        locale: "auto",
        pageKey: props.notePath,
        site: theme.value.comment.artalk.site,
        server: theme.value.comment.artalk.server,
      });
      instance.value?.on("list-loaded", () => jumpRedirect(null, theme.value, true));
      instance.value?.on("comment-updated", () => jumpRedirect(null, theme.value, true));
    }
  } catch (error) {
    console.error("初始化随笔评论出错:", error);
  }
};

watch(() => props.notePath, (val) => {
  nextTick().then(() => {
    if (instance.value?.update) {
      instance.value.update({ pageKey: val });
      instance.value.reload?.();
    }
  });
});

onMounted(() => initComment());
onUnmounted(() => instance.value?.destroy?.());
</script>

<style lang="scss" scoped>
.note-comments {
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--main-card-border);
}
</style>

<style lang="scss">
.note-comments {
  --at-color-font: var(--main-font-color) !important;
  --at-color-deep: var(--main-font-second-color) !important;
  --at-color-grey: var(--main-font-second-color) !important;
  --at-color-meta: var(--main-font-second-color) !important;
  --at-color-border: var(--main-card-border) !important;
  --at-color-main: var(--main-color) !important;
  --at-color-light: var(--main-color) !important;
  --at-color-bg: var(--main-card-background) !important;
  --at-color-bg-grey: var(--main-card-border) !important;
  --at-color-bg-grey-transl: var(--main-card-border) !important;
  --at-color-bg-transl: var(--main-card-second-background) !important;
  --at-color-gradient: linear-gradient(180deg, transparent, var(--main-card-background)) !important;

  .tk-comments, .atk-main-wrap {
    font-size: 14px;
  }
}
</style>
