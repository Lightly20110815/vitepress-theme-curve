<!-- 项目风格信息弹窗 -->
<template>
  <Teleport to="body">
    <Transition name="fade" mode="out-in">
      <div v-if="show" class="sy-warning-dialog">
        <div class="dialog-mask" @click.stop />
        <div class="dialog-box s-card">
          <!-- 标题栏 -->
          <div class="dialog-title">
            <span>{{ config.title }}</span>
            <i class="iconfont icon-close close" @click="show = false" />
          </div>
          <!-- 内容区 -->
          <div class="dialog-body">
            <div class="dialog-icon">
              <!-- Info 图标 -->
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" fill="#0078d7" />
                <text x="24" y="34" text-anchor="middle" fill="#fff" font-size="26" font-family="Segoe UI, Arial, sans-serif" font-weight="600">i</text>
              </svg>
            </div>
            <div class="dialog-text">
              {{ config.message }}
            </div>
          </div>
          <!-- 按钮区 -->
          <div class="dialog-footer">
            <button class="dialog-btn" @click="handleConfirm">确定</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { theme } = useData();

// 从 themeConfig 读取配置
const config = computed(() => {
  return (
    theme.value.syWarning || {
      enable: true,
      title: "Sy Warning",
      message: "Test001",
    }
  );
});

// 弹窗显示状态
const show = ref(config.value.enable ?? true);

// 确定按钮
const handleConfirm = () => {
  show.value = false;
};

// 暴露全局控制函数
onMounted(() => {
  if (typeof window !== "undefined") {
    window.syWarningControl = {
      show: () => {
        show.value = true;
      },
      hide: () => {
        show.value = false;
      },
      toggle: () => {
        show.value = !show.value;
      },
    };
  }
});
</script>

<style lang="scss" scoped>
.sy-warning-dialog {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 2000;

  .dialog-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: var(--main-mask-background);
  }

  .dialog-box {
    position: relative;
    width: 460px;
    max-width: calc(100vw - 40px);
    padding: 0;
    overflow: hidden;
    animation: fade-up 0.4s forwards;

    .dialog-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.125rem;
      padding: 16px 20px;
      background-color: var(--main-card-background);
      border-bottom: 1px solid var(--main-card-border);
      color: var(--main-font-color);
      font-weight: 500;

      .close {
        font-size: 1rem;
        border-radius: 8px;
        padding: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
        color: var(--main-font-second-color);
        &:hover {
          background-color: var(--main-card-border);
        }
      }
    }

    .dialog-body {
      display: flex;
      align-items: flex-start;
      padding: 24px 20px;
      gap: 16px;
      background-color: var(--main-card-background);

      .dialog-icon {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        margin-top: 2px;
      }

      .dialog-text {
        flex: 1;
        font-size: 1rem;
        color: var(--main-font-color);
        line-height: 1.8;
        text-align: left;
        word-break: break-word;
        white-space: pre-line;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      padding: 12px 20px 16px;
      background-color: var(--main-card-background);
      border-top: 1px solid var(--main-card-border);

      .dialog-btn {
        min-width: 80px;
        padding: 8px 20px;
        font-size: 0.95rem;
        font-weight: 500;
        background-color: var(--main-card-second-background);
        border: 1px solid var(--main-card-border);
        border-radius: 8px;
        color: var(--main-font-color);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background-color: var(--main-color);
          border-color: var(--main-color);
          color: #fff;
          transform: scale(1.02);
        }
      }
    }
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
