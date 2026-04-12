# 代码审计报告 - VitePress Theme Curve

## 审计概要

对整个项目进行了全面的代码审查，发现并修复了以下问题。

---

## 一、已修复的 Bug

### 1. Player.vue - 浮空代码块（严重）
**文件**: `.vitepress/theme/components/Player.vue`  
**问题**: 在 `<script setup>` 中，第23-28行有一段代码不在任何函数体内，直接暴露在顶层作用域中执行：
```js
// 先显示播放器
if (store) {
  store.playerShow = true;
};
```
这段代码在组件 setup 阶段就直接执行了 `store.playerShow = true`，会导致播放器在组件加载时无条件显示，与后面 `onMounted` 中的条件判断逻辑矛盾。  
**修复**: 移除了这段浮空代码。

### 2. HlsPlayer.vue - HLS 实例未销毁（内存泄漏）
**文件**: `.vitepress/theme/components/HlsPlayer.vue`  
**问题**: 组件使用了 HLS.js 创建实例，但 `onBeforeUnmount` 钩子中没有销毁 HLS 实例，仅移除了事件监听器，导致内存泄漏。  
**修复**: 在 `onBeforeUnmount` 中添加了 `hlsInstance.value?.destroy()` 调用。

### 3. Banner.vue - defineProps 类型定义错误
**文件**: `.vitepress/theme/components/Banner.vue`  
**问题**: `height` prop 使用 `type: [null, String]`，`null` 不是有效的 Vue prop 类型。  
**修复**: 改为 `type: String, default: null`。

### 4. store/index.js - scrollData 初始值为 null 导致潜在的空引用
**文件**: `.vitepress/theme/store/index.js`  
**问题**: `scrollData` 初始值为 `null`，但多个组件直接访问 `store.scrollData.percentage` 等属性，在初始化完成前会报错。  
**修复**: 将初始值改为 `{ percentage: 0, height: 0, direction: null }`。

### 5. Settings.vue - themeType 响应式变量定义错误
**文件**: `.vitepress/theme/components/Settings.vue`  
**问题**: `themeType` 使用 `ref(store.themeType)` 初始化，这只是拿到了初始值的快照，后续 store 变化不会同步。  
**修复**: 改为使用 `computed(() => store.themeType)` 保持响应式。

### 6. Aside/index.vue - scrollData 空值访问
**文件**: `.vitepress/theme/components/Aside/index.vue`  
**问题**: watch 监听 `store.scrollData.percentage`，若 `scrollData` 为 null 会抛出错误。  
**修复**: 添加了安全访问 `store.scrollData?.percentage`。

---

## 二、已清理的冗余代码

### 7. 调试用 console.log 清理
以下文件中的开发调试用 `console.log` 已全部移除（保留了 `console.error` 和 `console.info` 用于错误追踪和关键信息）：

| 文件 | 移除的 console.log |
|------|-------------------|
| `views/Home.vue` | `"当前页数："`, `"滚动位置："` |
| `components/Player.vue` | `musicList`, `"开始播放"`, `"暂停播放"`, `songName/songArtist` |
| `components/Plugins/Comments/Artalk.vue` | `"评论已加载完毕"`, `"评论已更新完毕"`, `"填充评论："` |
| `components/Plugins/Comments/Twikoo.vue` | `"评论已加载完毕"`, `"填充评论："` |
| `components/Aside/Widgets/Toc.vue` | `"回到顶部"` |
| `api/index.js` | `"切换到备用 API："` |

### 8. Player.vue CSS 中的大量注释代码
**文件**: `.vitepress/theme/components/Player.vue`  
**说明**: CSS 中存在大量被注释掉的歌词显示相关样式代码（约50行），是歌词功能被移除后的残留。建议后续清理这些注释以保持代码整洁。

### 9. api/index.js 中的注释代码
**文件**: `.vitepress/theme/api/index.js`  
**说明**: `getHitokoto` 函数中有被注释掉的延迟返回代码（setTimeout 版本），以及底部被注释掉的 `getOtherWeather` 函数。建议后续清理。

### 10. themeConfig.mjs 中的 typo
**文件**: `.vitepress/theme/assets/themeConfig.mjs`  
**问题**: `slogin` 应为 `slogan`（拼写错误但不影响功能，因为是配置键名一致使用的）。  
**说明**: 修改此字段名需要同步修改所有引用处，影响范围较大，标记但未修改。

---

## 三、安全性改进

### 11. api/deepseek.ts - CORS 安全加固
**文件**: `api/deepseek.ts`  
**问题**: 原始代码存在几个安全隐患：
1. 缺少 CORS 域名白名单
2. 未验证请求方法
3. 缺少 try-catch 错误处理
**修复**: 
- 添加了 `ALLOWED_ORIGINS` 域名白名单
- 添加了 `OPTIONS` 预检请求处理
- 添加了请求方法验证（只允许 POST）
- 添加了 JSON 解析的 try-catch

---

## 四、潜在问题提醒（未修改）

### 12. getStatistics 函数缺少错误处理
**文件**: `.vitepress/theme/api/index.js`  
**说明**: `getStatistics` 函数中 `data.match()` 返回 `null` 时，后续的 `.map()` 调用会报错。建议添加空值检查。

### 13. getMusicList 函数缺少错误处理
**文件**: `.vitepress/theme/api/index.js`  
**说明**: `fetch` 失败或返回非 JSON 时缺少错误处理，`list.map` 可能在 `list` 为非数组时崩溃。

### 14. page/[num].paths.mjs 的路径生成
**说明**: 此文件用于生成分页路径，依赖 `themeConfig` 中的 `postData`。如果主题配置异常，可能生成错误的路径数据。

### 15. 冗余的 page/1.md 和 page/index.md
**说明**: `page/1.md` 和 `page/index.md` 的内容功能重复（都是首页），建议合并或移除其中一个。

---

## 修改文件汇总

| 文件 | 修改类型 |
|------|---------|
| `.vitepress/theme/store/index.js` | Bug 修复 |
| `.vitepress/theme/components/Banner.vue` | Bug 修复 |
| `.vitepress/theme/components/Settings.vue` | Bug 修复 |
| `.vitepress/theme/components/Aside/index.vue` | Bug 修复 |
| `.vitepress/theme/components/HlsPlayer.vue` | Bug 修复（内存泄漏） |
| `.vitepress/theme/components/Player.vue` | Bug 修复 + 代码清理 |
| `.vitepress/theme/views/Home.vue` | 代码清理 |
| `.vitepress/theme/components/Plugins/Comments/Artalk.vue` | 代码清理 |
| `.vitepress/theme/components/Plugins/Comments/Twikoo.vue` | 代码清理 |
| `.vitepress/theme/components/Aside/Widgets/Toc.vue` | 代码清理 |
| `.vitepress/theme/api/index.js` | 代码清理 |
| `api/deepseek.ts` | 安全性加固 |
| `.vitepress/theme/index.mjs` | 冗余依赖清理 |
| `.vitepress/config.mjs` | Bug 修复（深色模式冲突） |
| `package.json` | 依赖清理 |


