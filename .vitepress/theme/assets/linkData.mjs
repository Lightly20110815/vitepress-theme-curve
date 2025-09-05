// 链接数据
const linkData = [
  // 推荐数据
  {
    type: "rec",
    typeName: "本站",
    typeDesc: "自己的东西",
    typeList: [
      {
        name: "Sy's Digital Garden",
        avatar: "https://api.ddnsy.fun/clogo.webp",
        desc: "With you, through all.",
        url: "https://ddnsy.fun",
      },
    ],
  },
  // 小伙伴们
  {
    type: "friends",
    typeName: "小伙伴们",
    typeDesc: "我们在一起，共同进步",
    typeList: [
      {
        name: "池鱼小栈",
        avatar: "/images/logo/logo.webp",
        desc: "｜д•´)!!",
        url: "https://chiyu.it",
      },
      {
        name: "Clover Yan",
        avatar: `https://www.khyan.top/assets/avatar_${Math.floor(Math.random() * 4) + 1}.jpg`,
        desc: "生命是灰色的，理论之树常青。",
        url: "https://www.khyan.top/",
      },
       {
        name: "寻亦见北",
        avatar: `https://www.xyjb.org/img/favicon.png`,
        desc: "寻褶·见熵·北纬·柒文",
        url: "https://xyjb.org",
      },
    ],
  },
   // 丢失
 // {
  //  type: "lost",
   // typeName: "走丢了",
   // typeDesc: "因为各种原因失联的站点",
   // typeList: [
   //   {
   //     name: "池鱼小栈",
   //     avatar: "/images/logo/logo.webp",
   //     desc: "｜д•´)!!",
   //     url: "https://chiyu.it",
   //   },
 //   ],
 // },
];

export default linkData;