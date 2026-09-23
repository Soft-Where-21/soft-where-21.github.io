# 时间线配图

将图片放在此目录，可按文章创建子目录，例如 `campus/activity-1.jpg`。

在文章的 `timelines.js` 中使用相对路径：

```js
images: [
  'campus/activity-1.jpg',
  {src: 'campus/activity-2.jpg', alt: '活动合影'},
  'https://example.com/activity-3.jpg',
]
```

`demo/` 的两张软院猫来自项目已有的 `static/img/` 素材，仅用于示例文章的多图展示。
