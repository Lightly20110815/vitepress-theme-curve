<template>
  <!-- 无可见 DOM，只负责给 html 打时辰标记 -->
</template>

<script setup>
const periods = [
  { name: 'dawn',    start: 4,  end: 7,  bg: 'linear-gradient(180deg, rgba(130,170,220,0.10) 0%, rgba(200,180,210,0.06) 100%)' },
  { name: 'morning', start: 7,  end: 10, bg: 'linear-gradient(180deg, rgba(250,220,140,0.10) 0%, rgba(220,190,130,0.06) 100%)' },
  { name: 'noon',    start: 10, end: 15, bg: 'linear-gradient(180deg, rgba(255,245,210,0.06) 0%, rgba(255,252,245,0.03) 100%)' },
  { name: 'dusk',    start: 15, end: 19, bg: 'linear-gradient(180deg, rgba(255,170,120,0.12) 0%, rgba(210,140,180,0.08) 100%)' },
  { name: 'night',   start: 19, end: 23, bg: 'linear-gradient(180deg, rgba(50,30,100,0.14) 0%, rgba(30,15,70,0.10) 100%)' },
  { name: 'midnight',start: 23, end: 4,  bg: 'linear-gradient(180deg, rgba(15,10,50,0.16) 0%, rgba(8,5,30,0.12) 100%)' },
];

const cls = (h) => {
  for (const p of periods) {
    if (p.start < p.end) {
      if (h >= p.start && h < p.end) return p;
    } else {
      if (h >= p.start || h < p.end) return p;
    }
  }
  return periods[2]; // fallback noon
};

const update = () => {
  const h = new Date().getHours();
  const period = cls(h);
  const prev = document.documentElement.dataset.atmosphere;
  if (prev === period.name) return;
  document.documentElement.dataset.atmosphere = period.name;
  document.documentElement.style.setProperty('--atmosphere-bg', period.bg);
};

let timer = null;
onMounted(() => {
  update();
  timer = setInterval(update, 60000);
});
onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
