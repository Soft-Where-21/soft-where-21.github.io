# 博客时间线

保留 Docusaurus 默认博客布局：左侧文章导航，中间时间线，右侧文字切换。窄屏时，时间线选项放在正文上方。

## 文件分工

| 文件 | 用途 |
| --- | --- |
| `blog/<文章目录>/index.mdx` | 标题、摘要与时间线入口 |
| `blog/<文章目录>/timelines.js` | 这篇文章的全部时间线内容 |
| `src/components/BlogTimeline/index.js` | 日期和一句话事件的展示 |
| `src/components/BlogTimeline/TimelineNavigation.js` | 桌面与手机共用的文字选择器 |
| `src/components/BlogTimeline/TimelineImages.js` | 多图展示与原图链接 |
| `src/components/BlogTimeline/imagePath.js` | 本地图片路径与公网 URL 解析 |
| `src/components/BlogTimeline/context.js` | 当前文章的选中状态 |
| `src/components/BlogTimeline/styles.module.css` | 时间线和选择器的样式 |
| `src/components/BlogTimeline/theme.js` | 本地 Docusaurus theme 注册入口 |
| `src/components/BlogTimeline/theme/BlogPostPage/index.js` | 读取文章导出的数据，提供切换状态 |
| `src/components/BlogTimeline/theme/BlogLayout/index.js` | 将右侧目录替换为时间线选择器 |
| `static/file/timeline/` | 本地配图，可按文章创建子目录 |

时间线的展示、状态和主题接入集中在 `src/components/BlogTimeline/`。`docusaurus.config.js` 通过 `themes: ['./src/components/BlogTimeline/theme.js']` 注册本地主题；主题入口和配置调整后需重启开发服务，文章内容与样式继续支持热更新。

## 增加内容

在文章目录的 `timelines.js` 中维护数据，数组顺序即显示顺序：

```js
export default [
  {
    id: 'research',
    title: '科研初体验',
    events: [
      {date: '2026-03-15', text: '读完第一篇论文，整理问题与方法。'},
      {date: '2026-04-09', text: '跑通基线，记录环境与实验配置。'},
    ],
  },
];
```

时间线 `id` 在同一篇文章中保持唯一；日期用 `YYYY-MM-DD` 格式，事件按时间排列。每个事件包含日期、一句话及可选配图。

## 配置多张图片

`images` 为可选数组，省略或设置 `[]` 时不显示图片区。支持路径字符串和带替代文字的对象，二者可以混用：

```js
{
  date: '2026-03-15',
  text: '参加校园活动，记录当天的见闻。',
  images: [
    'campus/activity-1.jpg',
    {src: './campus/activity-2.jpg', alt: '活动现场合影'},
    {src: 'https://example.com/activity-3.jpg', alt: '活动现场照片'},
  ],
}
```

- 相对路径以 `static/file/timeline/` 为根目录。例如 `campus/activity-1.jpg` 对应 `static/file/timeline/campus/activity-1.jpg`。
- 也接受 `/file/timeline/campus/activity-1.jpg` 和 `/static/file/timeline/campus/activity-1.jpg`，都会转换为正确的站点访问路径。
- `http://`、`https://` 和 `//` 开头的公网 URL 直接使用；本地图片自动适配网站的 `baseUrl`。
- 图片按数组顺序显示为缩略图，保持比例且不裁切，点击在新标签页查看原图。窄屏时自动换行。
- 可通过 `{src, alt}` 提供图片说明；示例公网 URL 请替换为自己的实际地址。

示例文章第一条事件混合使用两张本地软院猫配图和一张公网配图，本地文件位于 `static/file/timeline/demo/`。

## 新建时间线博客

新建 `blog/YYYY-MM-DD-文章名/` 目录，放入 `index.mdx` 和 `timelines.js`。MDX 写法：

```mdx
---
title: 我的时间线
slug: my-timeline
hide_table_of_contents: true
---

一句话摘要。

<!-- truncate -->

import BlogTimeline from '@site/src/components/BlogTimeline';

export {default as timelines} from './timelines';

<BlogTimeline />
```

命名导出 `timelines` 会自动启用右侧选择器，不需要额外配置开关或全局注册。每篇文章只加载自己的数据；未导出时间线的普通博客使用原有目录。
