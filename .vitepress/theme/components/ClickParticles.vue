<template>
  <!-- 粒子容器，无需渲染可见内容 -->
</template>

<script setup>
const createParticle = (x, y) => {
  if (typeof document === 'undefined') return;

  const particle = document.createElement('span');
  particle.className = 'click-particle';

  // 随机选择形状：爱心 或 星星
  const shapes = ['❤️', '✨', '⭐', '💫'];
  particle.innerText = shapes[Math.floor(Math.random() * shapes.length)];

  // 随机运动参数
  const angle = Math.random() * Math.PI * 2;
  const velocity = 30 + Math.random() * 60;
  const tx = Math.cos(angle) * velocity;
  const ty = Math.sin(angle) * velocity - 50;
  const rotate = Math.random() * 360 - 180;
  const scale = 0.6 + Math.random() * 0.8;

  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.setProperty('--tx', tx + 'px');
  particle.style.setProperty('--ty', ty + 'px');
  particle.style.setProperty('--r', rotate + 'deg');
  particle.style.setProperty('--s', scale);

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 900);
};

const onClick = (e) => {
  // 排除交互元素，避免干扰正常点击
  if (e.target.closest('a, button, input, textarea, .dialog-btn, .icon-close, .s-card')) return;

  const count = 6 + Math.floor(Math.random() * 5); // 6-10 个
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      createParticle(e.clientX, e.clientY);
    }, i * 35);
  }
};

onMounted(() => {
  window.addEventListener('click', onClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', onClick);
});
</script>

<style lang="scss">
.click-particle {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 14px;
  opacity: 0.9;
  animation: particle-fly 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes particle-fly {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(var(--s));
    opacity: 0.9;
  }
  100% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--r)) scale(0);
    opacity: 0;
  }
}
</style>
