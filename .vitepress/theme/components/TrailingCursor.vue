<template>
  <!-- 光标拖尾粒子，无可见 DOM -->
</template>

<script setup>
let lastX = 0, lastY = 0;
let ticking = false;
let particles = 0;
const MAX_PARTICLES = 40;

const hue = () => Math.floor(Math.random() * 60 + 200);

const createDot = (x, y) => {
  if (typeof document === 'undefined') return;
  if (particles > MAX_PARTICLES) return;

  const dot = document.createElement('span');
  dot.className = 'cursor-trail';
  const size = 3 + Math.random() * 4;
  const h = hue();
  dot.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: hsl(${h}, 80%, 65%);
    box-shadow: 0 0 ${size * 2}px hsl(${h}, 80%, 65%);
  `;
  particles++;
  document.body.appendChild(dot);

  setTimeout(() => {
    dot.remove();
    particles--;
  }, 600);
};

const onMove = (e) => {
  lastX = e.clientX;
  lastY = e.clientY;
  if (!ticking) {
    requestAnimationFrame(() => {
      createDot(lastX, lastY);
      ticking = false;
    });
    ticking = true;
  }
};

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove);
});
</script>

<style lang="scss">
.cursor-trail {
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: trail-fade 0.6s ease-out forwards;
}

@keyframes trail-fade {
  0% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
}
</style>
