<template>
  <canvas ref="canvasRef" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref(null);
let ctx = null;
let animId = null;
let particles = [];
let mouse = { x: -999, y: -999 };

const NUM = 40;

class Dot {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 1.5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;

    // 鼠标吸引
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150 && dist > 0) {
      this.vx += (dx / dist) * 0.02;
      this.vy += (dy / dist) * 0.02;
    }

    // 限制速度
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 2) {
      this.vx = (this.vx / speed) * 2;
      this.vy = (this.vy / speed) * 2;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
  }
}

const init = () => {
  const el = canvasRef.value;
  if (!el) return;
  ctx = el.getContext('2d');
  el.width = window.innerWidth;
  el.height = window.innerHeight;
  particles = Array.from({ length: NUM }, () => new Dot());
  loop();
};

const loop = () => {
  if (!ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // 粒子之间连线
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${0.4 - dist / 200})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // 鼠标和粒子连线
  particles.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(255,255,255,${0.6 - dist / 200})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });

  animId = requestAnimationFrame(loop);
};

const onMove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const onResize = () => {
  const el = canvasRef.value;
  if (!el) return;
  el.width = window.innerWidth;
  el.height = window.innerHeight;
};

onMounted(() => {
  init();
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId);
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('resize', onResize);
});
</script>