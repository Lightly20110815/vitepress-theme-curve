// 主题配置
export const themeConfig = {
  // 站点信息
  // 站点信息
  siteMeta: {
    // 站点标题
    title: "Sy's Digital Garden", // <--- 已修改
    // 站点描述
    description: "With you, through all.", // <--- 已修改
    // 站点logo
    logo: "https://api.ddnsy.fun/clogo.webp",
    // 站点地址
    site: "https://ddnsy.fun", // <--- 已修改
    // 语言
    lang: "zh-CN",
    // 作者
    author: {
      name: "Sy", // <--- 已修改
      cover: "/images/avatar/avatar.webp",
      email: "me@404yann.com", // <--- 已修改
      link: "https://ddnsy.fun", // <--- 已修改
    },
  },
  // 备案信息
  icp: "萌ICP备20250733号",
  // 建站日期
  since: "2025-07-22",
  // 每页文章数据
  postSize: 5,
  // inject
  // inject
  inject: {
    // 头部
    // https://vitepress.dev/zh/reference/site-config#head
    header: [
      // favicon
      ["link", { rel: "icon", href: "/favicon.ico" }],
      // RSS
      [
        "link",
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "RSS",
          href: "#",
        },
      ],
      // 预载 CDN
      [
        "link",
        {
          crossorigin: "",
          rel: "preconnect",
          href: "https://s1.hdslb.com",
        },
      ],
      [
        "link",
        {
          crossorigin: "",
          rel: "preconnect",
          href: "https://cdn.jsdmirror.com",
        },
      ],
      // vivo sans
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn.jsdmirror.com/gh/kazukokawagawa/chiyupic@main/fonts/vivosans.css",
        },
      ],
      // HarmonyOS font
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css",
        },
      ],
      // 小赖字体
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn.jsdmirror.com/gh/kazukokawagawa/chiyupic@main/fonts/xiaolai.css",
        },
      ],
      // iconfont (原作者的)
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css",
        },
      ],
      // iconfont (您自己的 C++ 扩展包) <--- 已为您添加
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://at.alicdn.com/t/c/font_4982617_bpbw30gpjso.css",
        },
      ],
      // Embed code
      ["link", { rel: "preconnect", href: "https://use.sevencdn.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
      [
        "link",
        {
          crossorigin: "anonymous",
          href: "https://use.sevencdn.com/css2?family=Fira+Code:wght@300..700&display=swap",
          rel: "stylesheet",
        },
      ],
    ],
  },
  // 导航栏菜单
  nav: [
    {
      text: "文库",
      items: [
        { text: "文章列表", link: "/pages/archives", icon: "article" },
        { text: "全部分类", link: "/pages/categories", icon: "folder" },
        { text: "全部标签", link: "/pages/tags", icon: "hashtag" },
      ],
    },
   // {
     // text: "专栏",
     // items: [
      //  { text: "技术分享", link: "/pages/categories/技术分享", icon: "technical" },
      //  { text: "我的项目", link: "/pages/project", icon: "code" },
      //  { text: "效率工具", link: "/pages/tools", icon: "tools" },
    //  ],
 //   },
    {
      text: "友链",
      items: [
      //  { text: "友链鱼塘", link: "/pages/friends", icon: "fish" },
        { text: "友情链接", link: "/pages/link", icon: "people" },
      ],
    },
    {
      text: "我的",
      items: [
        //{ text: "畅所欲言", link: "/pages/message", icon: "chat" },
        //{ text: "致谢名单", link: "/pages/thanks", icon: "reward" },
        { text: "关于本站", link: "/pages/about", icon: "contacts" },
      ],
    },
  ],
  // 导航栏菜单 - 左侧
  navMore: [
    {
      name: "项目",
      list: [
        {
          icon: "https://api.ddnsy.fun/clogo.webp",
          name: "主站",
          url: "/",
        },
        {
          icon: "https://api.ddnsy.fun/hot.jpg",
          name: "热榜 By 池鱼鱼",
          url: "https://hot.chiyu.it",
        },
        {
          icon: "https://api.ddnsy.fun/nav.jpg",
          name: "Nav By 池鱼鱼",
          url: "https://nav.chiyu.it",
        },
      ],
    },
    // {
    //   name: "服务",
    //   list: [
    //     {
    //       icon: "/images/uptime-favicon.ico",
    //       name: "检测",
    //       url: "https://status.chiyu.it",
    //     },
    //     {
    //       icon: "/images/logo/logo.webp",
    //       name: "镜像站",
    //       url: "https://backup.chiyu.it",
    //     },
    //   ],
    // },
  //  {
   //   name: "项目",
   //   list: [
   //     {
   //       icon: "/images/logo/logo.webp",
   //       name: "占位符",
   //       url: "#",
   //     },
   //   ],
   // },
  ],
  // 封面配置
  cover: {
    // 是否开启双栏布局
    twoColumns: false,
    // 是否开启封面显示
    showCover: {
      // 是否开启封面显示 文章不设置cover封面会显示异常，可以设置下方默认封面
      enable: false,
      // 封面布局方式: left | right | both
      coverLayout: 'both',
      // 默认封面(随机展示)
      defaultCover: [
        'https://example.com/1.avif',
        'https://example.com/2.avif',
        'https://example.com/3.avif'
      ]
    }
  },
  // 页脚信息
  footer: {
    // 社交链接（请确保为偶数个）
    social: [
      {
        icon: "email",
        link: "mailto:me@404yann.com",
      },
      {
        icon: "github",
        link: "https://github.com/Lightly20110815",
      },
      {
        icon: "telegram",
        link: "https://t.me/Sy_Yann",
      },
      {
        icon: "bilibili",
        link: "https://space.bilibili.com/1548870900",
      },
      {
        icon: "qq",
        link: "https://res.abeim.cn/api/qq/?qq=2473665578",
      },
      {
        icon: "twitter-x",
        link: "https://x.com/yxrchina",
      },
    ],
    // sitemap
    sitemap: [
      {
        text: "博客",
        items: [
          { text: "近期文章", link: "/" },
          { text: "全部分类", link: "/pages/categories" },
          { text: "全部标签", link: "/pages/tags" },
          { text: "文章归档", link: "/pages/archives", newTab: true },
        ],
      },
      {
        text: "项目",
        items: [
          { text: "本站源码", link: "https://github.com/Lightly20110815/vitepress-theme-curve", newTab: true },
        ],
      },
      //{
        //text: "专栏",
        //items: [
          //{ text: "技术分享", link: "/pages/categories/技术分享" },
          //{ text: "我的项目", link: "/pages/project" },
         // { text: "效率工具", link: "/pages/tools" },
       // ],
     // },
      {
        text: "页面",
        items: [
          //{ text: "畅所欲言", link: "/pages/message" },
          { text: "关于本站", link: "/pages/about" },
          { text: "隐私政策", link: "/pages/privacy" },
          { text: "版权协议", link: "/pages/cc" },
          { text: "TODO", link: "/pages/todo" },
        ],
      },
      // {
      //   text: "服务",
      //   items: [
      //     { text: "站点状态", link: "https://status.chiyu.it", newTab: true },
      //   ],
      // },
      {
        text: "关于 Sy",
        items: [
          { text: "个人主页", link: "https://hp.ddnsy.store/", newTab: true},
          { text: "关于 Sy", link: "/pages/aboutme"},
        ],
      },
    ],
  },
  // 评论
  comment: {
    enable: true,
    // 评论系统选择
    // artalk / twikoo
    type: "twikoo",
    // artalk
    // https://artalk.js.org/
    artalk: {
      site: "",
      server: "",
    },
    // twikoo
    // https://twikoo.js.org/
    twikoo: {
      // 必填，若不想使用 CDN，可以使用 pnpm add twikoo 安装并引入
      js: "https://cdn.jsdelivr.net/npm/twikoo@1.6.42/dist/twikoo.all.min.js",
      // 环境ID，已为您替换
      envId: "https://twikoo.ddnsy.fun/", // <--- 已修改为您的专属评论服务地址
      // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
      region: "",
      lang: "zh-CN",
    },
  },
  // 侧边栏
  aside: {
    // 站点简介
    hello: {
      enable: true,
      text: "我一直想要一个地方，可以随手记下那些写代码时迸发的灵感，和日常里不愿忘记的瞬间。所以，便有了这座“数字花园”。<br><br>这里大概会有一些关于<strong>前端开发</strong>的技术笔记，也会有我的碎碎念和生活感悟。它就像我的一个小树洞，安放着我的成长和困惑。",
    },
    // 目录
    toc: {
      enable: true,
    },
    randomQuote: {
      enable: true,
      quotes: [
        "数据线缠住我肉身，计算机锁住我灵魂，血肉不再感知痛苦，机械的世界里没有飞升。",
        "你知道吗，一天已不足24小时，所以长剧变成了短剧，大电影变成了小视频，歌曲失去了前奏，就连爱，也简化成了Ai",
        "我要是有钱了，就要换套更大的信息茧房，把预制的菜品塞满冰箱，买得起所有的情绪价值，穿得上大牌的流行衣裳，我躺在床上向外望，圆圆的窗口，圆，月，亮。",
        "我也想写阳光，写沙滩，写下风浪与帆船，可当我碰到键盘，才发现，这绿油油的草地，便是我目之所及最远端。",
        "我在一个预置的位子上，预支着自己的生命，我本以为是我预知了生活，没想到，是生活，预制了我",
        "闹钟杀死了我的梦，地铁吞噬我的路，工位禁锢我的身，最后我躺在床上，用一个点赞，证明我还活着。",
        "我们害怕断网，就像原始人害怕火种熄灭。但他们敬畏的是光明，我们恐惧的，是光明之外的，我们自己。",
        "我不再流血了，因为我用上了深色模式。",
        //"我一直想要一个地方，可以随手记下那些写代码时迸发的灵感，和日常里不愿忘记的瞬间。所以，便有了这座“数字花园”。",
        //"这里大概会有一些关于前端开发的技术笔记，也会有我的碎碎念和生活感悟。它就像我的一个小树洞，安放着我的成长和困惑。",
        //"爱因斯坦说过，想象力比知识更重要，因为知识是有限的，而想象力概括着世界上的一切，推动着进步，并且是知识进化的源泉。",
        "他们发明了越来越多的工具，来节省我们的时间。然后，我们用这些节省下来的时间，去学习，如何使用这些工具。",
        "我们总是渴望与人连接，却又害怕被人打扰。",
        //"我想要的生活，不过是有趣的灵魂和温柔的陪伴。",
        // "你要记住，你永远是你自己，永远不要试图去取悦别人。",
        // "你要记住，你永远是你自己，永远不要试图去取悦别人。",
        "我把故乡的地址，换成了动态的IP。从此，我的乡愁，不再是某片土地，而是那个，恒定满格的信号。",
        "我的健康，以数据的形式，储存在Apple Watch里。我信任它，甚至超过信任我的身体。偶尔我感到疲惫，但只要它说我睡眠充足，我就相信，那只是我的错觉。",
        "起初，我以为是手机偷走了我的生活。后来才发现，是我主动，把生活，寄存到了手机里，却再也，付不起取回的代价。",
        "我在早自习的钟声里醒来，再在晚自习的钟声里睡去。铃声替我决定一生的节奏，却从来没有问过我，喜不喜欢音乐。",
        "为了向机器证明我是人类，我必须辨认出那些，被人类自己，都快要遗忘的山川、河流与桥梁。",
        //"我害怕有一天，我会变成我手机里的App，整天在后台偷偷运行，消耗着别人的流量和电量。",
        "以前，书信很慢，一生只够爱一个人。现在，光纤很快，一声“宝贝”可以，同时发给所有人。",
        "我翻阅着那些数字化的旧照片，它们画质清晰，永不褪色，也失去了，被岁月，抚摸过的温度。",
        "我的世界观，由“为你推荐”构成。我愤怒的，是它推给我的愤怒；我热爱的，是它算出的我的热爱。我无比丰富，且，一无所有。",
        "日子是一张张未压缩的图片，我不停地加载、模糊、再锐化，最后解析度变高了，可我，再也看不懂自己了。",
        "我的床，离卫生间七步，离厨房十二步，离学校，需要换乘两次地铁。但躺在床上，指尖一划，我能瞬间，抵达世界上任何一个，我永远不会去的海港。",
        //"我把自己关在一个透明的盒子里，向外界展示着我的生活，却再也，见不到，真实的自己。",
        "以前，停电了，周围会很安静。现在，断网了，周围，还是那么安静。只是从前的安静里，有邻居的闲谈，现在的安静里，只有，路由器的闪光。",
        "我对着麦克风说“Hey”，唤醒了屋子里所有的智能设备。它们齐声回应，热情又标准。那一刻，这间屋子，比任何时候都更像一个家，也比任何时候，都更空无一人。",
        "碰到任何问题，我的第一反应，不再是思考，而是搜索。我的大脑，成了一个高效的，通往别人答案的，中转站。",
        "我花了很多时间，捏了一个完美的虚拟形象。他比我好看，比我勇敢，比我有趣。他活在一个光鲜的世界里，偶尔，会回头看看，这个，正在为他充电的我。",
      ],
    },
    // 标签
    tags: {
      enable: true,
    },
    // 倒计时
    countDown: {
      enable: true,
      // 倒计时日期
      data: {
        name: "🎉生日",
        date: "2026-08-15",
      },
    },
    // 8/4/25添加的生日组件
    birthDate: {
      enable: true,
      name: "Sy Yann",
      date: "2011-08-15",
    },
    HelloGithub: {
      enable: true,
    },
    // 站点数据
    siteData: {
      enable: true,
    },
    // 天气数据
    weather: {
      enable: true,
    },
  },
  // 友链
  friends: {
    // 友链朋友圈
    circleOfFriends: "",
    // 动态友链
    dynamicLink: {
      server: "",
      app_token: "",
      table_id: "",
    },
  },
  // 音乐播放器
  // https://github.com/imsyy/Meting-API
  music: {
    enable: true,
    // url
    url: "https://meting.20100907.xyz/api",
    //url: "https://meting.ddnsy.fun/api",
    // id
    id: 14022768906,
    // netease / tencent / kugou
    server: "netease",
    // playlist / album / song
    type: "playlist",
  },
  // 搜索
  // https://www.algolia.com/
  search: {
    enable: false,
    appId: "0F1DUC8MAX",
    apiKey: "1f97c9169943484cfb9a05c825851ca4",
  },
  // 天气 Key
// 请前往 高德开放平台注册 Web服务 Key
// 请注意不是 Web端 (JS API)，免费申请，每日上限 5000 次
// 此处提供的服务可能会超量从而无法访问，请自行申请！请自行申请！请自行申请！
// 若此处设为空则调用 教书先生 API https://api.oioweb.cn/doc/weather/GetWeather
  //weatherkey: {
  //"key": "1d65cc630df1f212e1d2e928643e3974",
 // },
  // 打赏
  rewardData: {
    enable: false,
    // 微信二维码
    wechat: "https://raw.chiyu.it/pic/pay/wx.webp",
    // 支付宝二维码
    alipay: "https://raw.chiyu.it/pic/pay/zfb.webp",
  },
  // 图片灯箱
  fancybox: {
    enable: true,
    js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js",
    css: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css",
  },
  // 外链中转
  jumpRedirect: {
    enable: true,
    // 排除类名
    exclude: [
      "cf-friends-link",
      "upyun",
      "icp",
      "author",
      "rss",
      "cc",
      "power",
      "social-link",
      "link-text",
      "travellings",
      "post-link",
      "report",
      "more-link",
      "skills-item",
      "right-menu-link",
      "link-card",
    ],
  },
  // 站点统计
  // 站点统计
  tongji: {
    "51la": "3MtrQOhuvEl8wjgK", // <--- 已修改为您的ID
  },
};