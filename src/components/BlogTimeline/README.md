# 博客时间线

保留 Docusaurus 默认博客布局，在正文中按数据数组的顺序展示全部时间线。每条时间线包含标题、事件，以及可选的引言、结语和配图；窄屏时自动调整日期与正文的间距。

## 文件分工

| 文件 | 用途 |
| --- | --- |
| `blog/<文章目录>/index.mdx` | 标题、摘要与时间线入口 |
| `blog/<文章目录>/timelines.js` | 这篇文章的全部时间线内容 |
| `src/components/BlogTimeline/index.js` | 日期和一句话事件的展示 |
| `src/components/BlogTimeline/TimelineImages.js` | 多图展示与原图链接 |
| `src/components/BlogTimeline/TimelineLinks.js` | 单个链接与多个并列链接 |
| `src/components/BlogTimeline/imagePath.js` | 本地图片路径与公网 URL 解析 |
| `src/components/BlogTimeline/context.js` | 当前文章的数据与节点标识 |
| `src/components/BlogTimeline/toc.js` | 时间线标题目录与固定跳转锚点 |
| `src/components/BlogTimeline/styles.module.css` | 时间线、配图和窄屏样式 |
| `src/components/BlogTimeline/theme.js` | 本地 Docusaurus theme 注册入口 |
| `src/components/BlogTimeline/theme/BlogPostPage/index.js` | 读取文章导出的数据，传给正文组件并补充标题目录 |
| `static/file/timeline/` | 按需创建的本地配图目录，可按文章创建子目录 |

时间线的展示、数据传递和主题接入集中在 `src/components/BlogTimeline/`。`docusaurus.config.js` 通过 `themes: ['./src/components/BlogTimeline/theme.js']` 注册本地主题；主题入口和配置调整后需重启开发服务，文章内容与样式继续支持热更新。

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

时间线标题会按数组顺序自动加入文章右侧目录，支持点击跳转和滚动高亮。标题锚点固定为 `timeline-<id>`；修改标题不影响已有章节链接，因此应保持 `id` 稳定，且避免与正文中手动指定的锚点重名。目录沿用 Docusaurus 默认样式和标题层级设置（时间线标题为二级），窄屏时与普通博客一样隐藏右侧目录。需要隐藏目录时，可在文章顶部添加 `hide_table_of_contents: true`。

## 配置并列链接

引言 `intro`、结语 `outro` 和每个事件都支持 `links` 数组。链接按数组顺序并列显示，窄屏时自动换行：

```js
intro: {
  paragraphs: ['核对成绩时可使用以下工具。'],
  links: [
    {href: '/tool#gpa', label: 'GPA 计算器'},
    {href: '/tool#postgrad', label: '保研成绩计算器'},
    {href: '/tool#comprehensive', label: '综测加分计算器'},
  ],
},
```

原有单链接写法 `link: {href, label}` 仍然有效；同时配置时以 `links` 为准。不要重复写多个同名的 `link` 属性，否则 JavaScript 只会保留最后一个。

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

需要本地配图时，再创建 `static/file/timeline/` 及文章对应的子目录，并放入实际图片；没有本地配图时无需保留空目录。

## 新建时间线博客

新建 `blog/YYYY-MM-DD-文章名/` 目录，放入 `index.mdx` 和 `timelines.js`。MDX 写法：

```mdx
---
title: 我的时间线
slug: my-timeline
reading_time: 6
---

一句话摘要。

<!-- truncate -->

import BlogTimeline from '@site/src/components/BlogTimeline';

export {default as timelines} from './timelines';

<BlogTimeline />
```

命名导出 `timelines` 会将这篇文章的数据交给 `<BlogTimeline />`，按数组顺序展示全部时间线，不需要额外配置开关或全局注册。每篇文章只加载自己的数据；未导出时间线的普通博客保持默认行为。

`reading_time` 是可选的阅读时长，单位为分钟，必须是有限的非负数字，例如 `6` 或 `2.5`。省略此属性或填写无效值时，沿用自动计算的阅读时长。
