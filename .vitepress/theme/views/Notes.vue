<!-- 随笔 Feed 流 -->
<template>
  <div class="notes-page">
    <Banner v-if="showHeader" :height="store.bannerType" />
    <div class="notes-content">
      <div class="notes-main">
        <div class="notes-header s-card">
          <h1 class="title">随笔</h1>
          <span class="subtitle">随手记录生活的碎片</span>
          <sup v-if="noteData?.length" class="count">{{ noteData.length }}</sup>
        </div>

        <!-- 标签筛选 -->
        <div v-if="noteTags && Object.keys(noteTags).length" class="note-tags s-card">
          <span
            :class="['tag-item', { active: activeTag === tag }]"
            v-for="(info, tag) in noteTags"
            :key="tag"
            @click="activeTag = activeTag === tag ? null : tag"
          >
            <i class="iconfont icon-hashtag" />
            {{ tag }}
            <span class="tag-count">{{ info.count }}</span>
          </span>
        </div>

        <!-- 随笔 Feed -->
        <div v-if="filteredNotes.length" class="notes-feed">
          <div
            v-for="(item, index) in filteredNotes"
            :key="index"
            :class="['note-card', 's-card']"
            :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
          >
            <div class="card-head">
              <div class="card-avatar">
                <img :src="theme.siteMeta.author.cover" :alt="theme.siteMeta.author.name" />
              </div>
              <div class="card-info">
                <span class="card-author">{{ theme.siteMeta.author.name }}</span>
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(item.date) }}</span>
                  <span v-if="item.mood" class="card-mood">{{ item.mood }}</span>
                </div>
              </div>
            </div>
            <div class="card-body markdown-main-style" v-html="item.html" />
            <div v-if="item.tags?.length" class="card-tags">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="card-tag"
                @click="activeTag = activeTag === tag ? null : tag"
              >
                <i class="iconfont icon-hashtag" />
                {{ tag }}
              </span>
            </div>
            <!-- 评论按钮 -->
            <button v-if="theme.comment.enable" :class="['comment-btn', { active: openComments[item.id] }]" @click="openComments[item.id] = !openComments[item.id]">
              <i class="iconfont icon-chat" />
              <span>{{ openComments[item.id] ? '收起评论' : '展开评论' }}</span>
            </button>
            <!-- 展开评论区 -->
            <Transition name="comment-expand">
              <NoteComments v-if="openComments[item.id]" :notePath="`/notes/${item.id}`" />
            </Transition>
          </div>
        </div>

        <div v-else class="empty s-card">
          <i class="iconfont icon-quote" />
          <span>还没有写过随笔</span>
        </div>
      </div>

      <Aside />
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const { theme } = useData();

defineProps({
  showHeader: { type: Boolean, default: false },
});

const noteData = computed(() => theme.value.noteData || []);
const noteTags = computed(() => theme.value.noteTagsData || {});

const activeTag = ref(null);
const openComments = reactive({});

const filteredNotes = computed(() => {
  if (!activeTag.value) return noteData.value;
  return noteData.value.filter((note) => note.tags?.includes(activeTag.value));
});

const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};
</script>

<style lang="scss" scoped>
.notes-page {
  .notes-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    .notes-main {
      width: calc(100% - 300px);
      transition: width 0.3s;
    }
    .main-aside {
      width: 300px;
      padding-left: 1rem;
    }
    @media (max-width: 1200px) {
      .notes-main {
        width: 100%;
      }
      .main-aside {
        display: none;
      }
    }
  }
}

.notes-header {
  display: flex;
  align-items: baseline;
  padding: 2rem;
  margin-bottom: 1rem;
  .title {
    font-size: 2rem;
    margin: 0;
    border-bottom: none;
  }
  .subtitle {
    margin-left: 1rem;
    opacity: 0.6;
    font-size: 14px;
  }
  .count {
    margin-left: 8px;
    font-size: 18px;
    font-weight: bold;
    opacity: 0.5;
  }
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  gap: 8px;
  .tag-item {
    display: flex;
    align-items: center;
    padding: 4px 12px;
    font-size: 13px;
    border-radius: 20px;
    background-color: var(--main-card-second-background);
    cursor: pointer;
    transition: all 0.3s;
    .iconfont {
      margin-right: 4px;
      font-size: 12px;
      opacity: 0.6;
    }
    .tag-count {
      margin-left: 4px;
      opacity: 0.5;
      font-size: 11px;
    }
    &:hover,
    &.active {
      color: var(--main-card-background);
      background-color: var(--main-color);
      .iconfont,
      .tag-count {
        color: var(--main-card-background);
      }
    }
  }
}

.notes-feed {
  .note-card {
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
    animation: fade-up 0.6s backwards;
    .card-head {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
      .card-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .card-info {
        display: flex;
        flex-direction: column;
        .card-author {
          font-size: 15px;
          font-weight: bold;
          line-height: 1.4;
        }
        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          .card-date {
            font-size: 13px;
            opacity: 0.6;
          }
          .card-mood {
            font-size: 14px;
          }
        }
      }
    }
    .card-body {
      padding-left: 54px;
      line-height: 1.8;
      :deep(p) {
        margin: 0 0 0.8rem 0;
        &:last-child {
          margin-bottom: 0;
        }
      }
      :deep(blockquote) {
        margin: 0.6rem 0;
        padding: 0.4rem 1rem;
        border-left: 3px solid var(--main-color);
        background-color: var(--main-card-second-background);
        border-radius: 0 8px 8px 0;
        opacity: 0.9;
      }
      :deep(h2),
      :deep(h3) {
        font-size: 1.1rem;
        margin: 0.8rem 0 0.4rem;
        border-bottom: none;
        padding-bottom: 0;
      }
      :deep(ul),
      :deep(ol) {
        padding-left: 1.5rem;
        margin: 0.4rem 0;
      }
      :deep(code) {
        background-color: var(--main-card-second-background);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
      }
      :deep(img) {
        max-width: 100%;
        border-radius: 12px;
        margin: 0.5rem 0;
      }
      :deep(a) {
        color: var(--main-color);
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 0.8rem;
      padding-left: 54px;
      .card-tag {
        display: flex;
        align-items: center;
        font-size: 12px;
        opacity: 0.6;
        padding: 2px 8px;
        border-radius: 12px;
        background-color: var(--main-card-second-background);
        cursor: pointer;
        transition: all 0.3s;
        .iconfont {
          font-size: 11px;
          margin-right: 2px;
        }
        &:hover {
          color: var(--main-color);
          background-color: var(--main-color-bg);
        }
      }
    }
    .comment-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px;
      margin-top: 1rem;
      font-size: 15px;
      font-weight: bold;
      border: 2px dashed var(--main-card-border);
      border-radius: 12px;
      background: none;
      cursor: pointer;
      transition: all 0.3s;
      color: var(--main-font-color);
      .iconfont {
        font-size: 18px;
        transition: color 0.3s;
      }
      &:hover {
        border-color: var(--main-color);
        color: var(--main-color);
        background-color: var(--main-color-bg);
        .iconfont {
          color: var(--main-color);
        }
      }
      &.active {
        border-style: solid;
        border-color: var(--main-color);
        color: var(--main-card-background);
        background-color: var(--main-color);
        .iconfont {
          color: var(--main-card-background);
        }
      }
    }
    @media (max-width: 768px) {
      padding: 1.2rem 1.2rem;
      .card-body {
        padding-left: 0;
      }
      .card-tags {
        padding-left: 0;
      }
    }
  }
}

.comment-expand-enter-active,
.comment-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.comment-expand-enter-from,
.comment-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.comment-expand-enter-to,
.comment-expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  opacity: 0.5;
  .iconfont {
    font-size: 48px;
    margin-bottom: 1rem;
  }
}
</style>
