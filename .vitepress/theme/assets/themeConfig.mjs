// =======================================
// 🌿 主题总配置（暴露给主题的全部开关/文案/资源）
// - 修改此文件即可全站生效
// - 保持结构清晰：站点信息 → 注入资源 → 导航 → 封面 → 页脚 → 评论 → 侧栏 → 友链 → 音乐 → 搜索 → 打赏 → 图片灯箱 → 外链中转 → 统计
// =======================================
export const themeConfig = {
  // ------------------------------------------------
  // 🏷️ 基本站点信息（SEO / i18n / 署名）
  // - title/description 影响搜索引擎摘要与社交卡片
  // - lang 决定文档语言标记 <html lang="...">
  // ------------------------------------------------
  siteMeta: {
    title: "Sy's Digital Garden",              // 站点标题（用于 <title> 与部分主题展示）
    description: "With you, through all.",      // 站点描述（用于 SEO/OG 摘要）
    logo: "https://api.ddnsy.fun/clogo.webp",   // 顶部 Logo，建议使用 webp/svg 减少体积
    site: "https://ddnsy.fun",                  // 站点基地址（部分组件用于跳转/生成绝对链接）
    lang: "zh-CN",
    author: {
      name: "Sy",                               // 作者名（用于文章/页脚展示）
      cover: "/images/avatar/avatar.webp",      // 作者头像（相对路径走静态资源）
      email: "me@404yann.com",                  // 联系邮箱（用于页脚社交）
      link: "https://ddnsy.fun",                // 个人主页链接
    },
  },

  // 🔖 备案/起始信息（中国大陆站点常用）
  icp: "萌ICP备20250733号",                     // 若不需展示，可置空
  since: "2025-07-22",                          // 建站起始日期（用于版权展示，如 2025–Now）
  postSize: 5,                                  // 列表页每页文章数（分页大小）

  // ------------------------------------------------
  // 🧩 页面 <head> 注入（字体/图标/CSS/预连接等）
  // - 使用 CDN 需注意：可用性/可替换镜像/跨域 headers
  // - preconnect 有助于减少 TLS 建连开销（性能优化）
  // ------------------------------------------------
  inject: {
    header: [
      // Favicon（浏览器标签页图标）
      ["link", { rel: "icon", href: "/favicon.ico" }],

      // RSS 订阅（如后续接入生成，可在此补上真实 href）
      ["link", { rel: "alternate", type: "application/rss+xml", title: "RSS", href: "#" }],

      // 预连接第三方 CDN（降低网络时延）
      ["link", { crossorigin: "", rel: "preconnect", href: "https://s1.hdslb.com" }],
      ["link", { crossorigin: "", rel: "preconnect", href: "https://cdn.jsdmirror.com" }],

      // 在线字体（注意：线上字体可能引入渲染阻塞；可使用 font-display: swap 的 CSS）
      ["link", { crossorigin: "anonymous", rel: "stylesheet", href: "https://cdn.jsdmirror.com/gh/kazukokawagawa/chiyupic@main/fonts/vivosans.css" }],
      ["link", { crossorigin: "anonymous", rel: "stylesheet", href: "https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css" }],
      ["link", { crossorigin: "anonymous", rel: "stylesheet", href: "https://cdn.jsdmirror.com/gh/kazukokawagawa/chiyupic@main/fonts/xiaolai.css" }],

      // 图标字体（图标类名由对应库提供）
      ["link", { crossorigin: "anonymous", rel: "stylesheet", href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css" }],
      ["link", { crossorigin: "anonymous", rel: "stylesheet", href: "https://at.alicdn.com/t/c/font_4982617_bpbw30gpjso.css" }],

      // Google Fonts 镜像（Fira Code 等等）
      ["link", { rel: "preconnect", href: "https://use.sevencdn.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
      ["link", { crossorigin: "anonymous", href: "https://use.sevencdn.com/css2?family=Fira+Code:wght@300..700&display=swap", rel: "stylesheet" }],
    ],
  },

  // ------------------------------------------------
  // 🧭 顶部导航（右侧主导航）
  // - 支持分组下拉：text + items[]
  // - icon 字段需主题支持（自定义 icon 名 → 字体库类名映射）
  // ------------------------------------------------
  nav: [
    {
      text: "文库",
      items: [
        { text: "文章列表", link: "/pages/archives", icon: "article" },
        { text: "全部分类", link: "/pages/categories", icon: "folder" },
        { text: "全部标签", link: "/pages/tags", icon: "hashtag" },
      ],
    },
    {
      text: "友链",
      items: [{ text: "友情链接", link: "/pages/link", icon: "people" }],
    },
    {
      text: "我的",
      items: [{ text: "关于本站", link: "/pages/about", icon: "contacts" }],
    },
  ],

  // ------------------------------------------------
  // 🧭 左侧更多导航（展开面板内的小组件式导航）
  // - 适合放“项目/站群/工具/监控”等入口
  // ------------------------------------------------
  navMore: [
    {
      name: "项目",
      list: [
        { icon: "https://api.ddnsy.fun/clogo.webp", name: "主站", url: "/" },
        { icon: "https://api.ddnsy.fun/hot.jpg", name: "热榜 By 池鱼鱼", url: "https://hot.chiyu.it" },
        { icon: "https://api.ddnsy.fun/nav.jpg", name: "Nav By 池鱼鱼", url: "https://nav.chiyu.it" },
      ],
    },
  ],

  // ------------------------------------------------
  // 🖼️ 首页封面块（大图/布局/默认占位）
  // - enable=false 关闭封面；defaultCover 在文章未设 cover 时兜底
  // - coverLayout: 'left' | 'right' | 'both'（根据主题实现）
  // ------------------------------------------------
  cover: {
    twoColumns: false, // 是否双栏（文本/图片并排）
    showCover: {
      enable: false,
      coverLayout: "both",
      defaultCover: [
        "https://example.com/1.avif",
        "https://example.com/2.avif",
        "https://example.com/3.avif",
      ],
    },
  },

  // ------------------------------------------------
  // 🦶 页脚（社交链接 & 站点地图）
  // - social 数组建议偶数个，便于栅格布局对齐
  // - sitemap 可按“博客/项目/页面/关于”等分组
  // ------------------------------------------------
  footer: {
    social: [
      { icon: "email", link: "mailto:me@404yann.com" },
      { icon: "github", link: "https://github.com/Lightly20110815" },
      { icon: "telegram", link: "https://t.me/Sy_Yann" },
      { icon: "bilibili", link: "https://space.bilibili.com/1548870900" },
      { icon: "qq", link: "https://res.abeim.cn/api/qq/?qq=2473665578" },
      { icon: "twitter-x", link: "https://x.com/yxrchina" },
    ],
    sitemap: [
      {
        text: "博客",
        items: [
          { text: "近期文章", link: "/" },
          { text: "全部分类", link: "/pages/categories" },
          { text: "全部标签", link: "/pages/tags" },
          { text: "文章归档", link: "/pages/archives", newTab: true }, // newTab=true 在新标签打开
        ],
      },
      {
        text: "项目",
        items: [
          {
            text: "本站源码",
            link: "https://github.com/Lightly20110815/vitepress-theme-curve",
            newTab: true,
          },
        ],
      },
      {
        text: "页面",
        items: [
          { text: "关于本站", link: "/pages/about" },
          { text: "隐私政策", link: "/pages/privacy" },
          { text: "版权协议", link: "/pages/cc" },
          { text: "TODO", link: "/pages/todo" },
        ],
      },
      {
        text: "关于 Sy",
        items: [
          { text: "个人主页", link: "https://hp.ddnsy.store/", newTab: true },
          { text: "关于 Sy", link: "/pages/aboutme" },
        ],
      },
    ],
  },

  // ------------------------------------------------
  // 💬 评论系统（twikoo/artalk）
  // - 选一个：type = 'twikoo' 或 'artalk'
  // - twikoo.envId：你的部署地址或环境 ID
  // - CDN 版本可根据需要锁定/升级
  // ------------------------------------------------
  comment: {
    enable: true,
    type: "twikoo",                // 可切换 'artalk'
    artalk: { site: "", server: "" },
    twikoo: {
      js: "https://cdn.jsdelivr.net/npm/twikoo@1.6.42/dist/twikoo.all.min.js",
      envId: "https://twikoo.ddnsy.fun/", // 自建 twikoo 服务地址
      region: "",                          // 腾讯云地区（vercel 自建留空）
      lang: "zh-CN",
    },
  },

  // ------------------------------------------------
  // 🧱 侧边栏小组件（开关/文案/数据源）
  // - enable 逐项开关
  // - countDown/birthDate 为自定义组件示例
  // ------------------------------------------------
  aside: {
    // 简介模块（支持 HTML）
    hello: {
      enable: true,
      text:
        "我一直想要一个地方，可以随手记下那些写代码时迸发的灵感，和日常里不愿忘记的瞬间。所以，便有了这座“数字花园”。<br><br>这里大概会有一些关于<strong>前端开发</strong>的技术笔记，也会有我的碎碎念和生活感悟。它就像我的一个小树洞，安放着我的成长和困惑。",
    },
    toc: { enable: true },                    // 目录（依据文章标题层级生成）
    randomQuote: { enable: true },            // 一言/语录（需主题内置或自行实现）
    tags: { enable: true },                   // 标签云
    countDown: {                              // 倒计时（自定义目标）
      enable: true,
      data: { name: "🎉生日", date: "2026-08-15" }, // YYYY-MM-DD
    },
    birthDate: { enable: true, name: "Sy Yann", date: "2011-08-15" }, // 个人生日展示
    HelloGithub: { enable: true },            // 例：GitHub 榜单/卡片（依主题实现）
    siteData: { enable: true },               // 站点统计（文章数/标签数等）
    weather: { enable: true },                // 天气组件（需在主题/前端里实现数据源）
  },

  // ------------------------------------------------
  // 🔗 友情链接/动态友链（若使用第三方表格或接口）
  // - circleOfFriends：朋友圈 RSS/聚合接口地址
  // - dynamicLink：自建服务的鉴权/表 ID 等
  // ------------------------------------------------
  friends: {
    circleOfFriends: "",
    dynamicLink: { server: "", app_token: "", table_id: "" },
  },

  // ------------------------------------------------
  // 🎵 音乐播放器（Meting API）
  // - url 指向 meting 接口；server 选 'netease' | 'tencent' | 'kugou'
  // - type 选 'playlist' | 'album' | 'song'
  // - id 需与 type 对应（歌单/专辑/歌曲 ID）
  // ------------------------------------------------
  music: {
    enable: true,
    url: "https://meting.20110815.xyz/api",
    id: 14022768906,
    server: "netease",
    type: "playlist",
  },

  // ------------------------------------------------
  // 🔎 站内搜索（Algolia 示例）
  // - 若不开启可设 enable=false
  // - 注意：apiKey/appId 属公开配置，不要塞私密索引权限
  // ------------------------------------------------
  search: {
    enable: false,
    appId: "0F1DUC8MAX",
    apiKey: "1f97c9169943484cfb9a05c825851ca4",
  },

  // ------------------------------------------------
  // 💝 打赏（扫码图）
  // - 关闭即可不显示
  // - 建议使用体积较小的 webp
  // ------------------------------------------------
  rewardData: {
    enable: false,
    wechat: "https://raw.chiyu.it/pic/pay/wx.webp",
    alipay: "https://raw.chiyu.it/pic/pay/zfb.webp",
  },

  // ------------------------------------------------
  // 🖼️ 图片灯箱（Fancybox）
  // - js/css 来自 CDN，注意版本更新与可用性
  // ------------------------------------------------
  fancybox: {
    enable: true,
    js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js",
    css: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css",
  },

  // ------------------------------------------------
  // 🚦 外链中转（防止直接跳出站点/统计点击）
  // - exclude：满足任一类名的链接将跳过中转（保持直连）
  // - 中转页通常可记录来源/去向，用于统计或二次确认
  // ------------------------------------------------
  jumpRedirect: {
    enable: true,
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

  // ------------------------------------------------
  // 📈 站点统计 (51la)
  // - 若更换统计平台，保留同名字段或在主题里映射
  // ------------------------------------------------
  tongji: { "51la": "3MtrQOhuvEl8wjgK" },
};
