# 资料分享索引

构建时递归扫描 `static/file/资料分享/`，生成供资料分享页面使用的 JSON。索引由 Docusaurus 管理，源文件不会被修改，也无需手动维护文件列表。

## 添加资料

在 `static/file/资料分享/` 下新建以同学姓名或主题命名的目录，再按实际需要组织子目录和文件。例如：

```text
static/file/资料分享/
├── repos.json
├── avatar/
│   └── 付宁远.jpg
├── 付宁远/
│   ├── 往届资料/
│   └── 保研时间规划-8天版.xlsx
└── 另一位同学/
    └── 课程笔记/
        └── 第一章.pdf
```

一级目录自动成为一个资料集。开发服务器会监测新增、修改和删除；发布时需重新构建。直接放在资料根目录的文件归入“共享文件”，此合成资料集的 `path` 为空字符串。隐藏文件/目录、`__MACOSX`、`Thumbs.db`、`desktop.ini` 和符号链接不参与索引；其他普通文件无格式限制。

## 配置头像与联系方式

在 `static/file/资料分享/repos.json` 中，以**实际一级目录名**为键配置：

```json
{
  "付宁远": {
    "name": "付宁远 / 软院保研资料分享",
    "avatar": "avatar/付宁远.jpg",
    "wechat": "在这里填写微信号"
  }
}
```

- `name`：页面显示名称，可省略或留空，默认使用目录名；文件路径和已有链接保持不变。
- `avatar`：相对于资料分享根目录的图片路径，图片放在 `avatar/` 下。支持 PNG、JPG、WebP、GIF、SVG、AVIF。留空或图片加载失败时显示姓名首字。
- `wechat`：微信号，填入后总览与当前资料集侧栏直接展示微信号，并提供复制按钮。留空则隐藏联系方式。
- 新增同学时，增加同名 JSON 条目即可；未配置的资料集也会正常展示。根目录共享文件可使用空字符串 `""` 作为键。
- 根目录的 `avatar/` 和 `repos.json` 是专用配置，不展示为资料集，也不计入文件总数。资料集内部同名文件夹或文件仍照常索引。
- 开发服务器会监听配置和头像变化，发布时重新构建。JSON 格式或字段类型错误会给出具体提示。

现有 `collectionNames` 插件选项仍兼容，`repos.json` 中的非空 `name` 优先。

## 集成与数据结构

在 Docusaurus 配置的 `plugins` 中注册 `require.resolve('./plugins/materials-index')`，页面通过 `import materialsIndex from '@materials-index'` 读取：

```js
{
  collections: [/* 一级目录节点 */],
  totalFiles: 0, // 全部文件数量
  totalSize: 0,  // 全部文件字节数
}
```

- 目录：`{name, path, type: 'directory', children, fileCount, totalSize}`。
- 顶层资料集额外包含 `avatar` 和 `wechat` 字符串，未配置时为空字符串。
- 文件：`{name, path, type: 'file', extension, size}`，扩展名包含点且转为小写，无扩展名时为 `''`。
- `path` 相对于 `static/file/资料分享/`，使用 `/` 分隔，保留原始文件名，**未经 URL 编码**。静态文件 URL 应按每个路径段分别使用 `encodeURIComponent`，再拼接站点 `baseUrl` 和 `file/资料分享/`。
- 每层目录排在文件之前，名称使用中文自然排序（数字 `2` 在 `10` 前）；目录计数递归汇总。
- 缺少资料目录时返回空索引，不会创建或改动资料目录。

验证索引及开发监听行为：`node --test tests/materials-index/*.test.cjs`。
