# 浏览器检索目录

本插件只在开发服务和构建时运行。浏览器按需加载 `@search-index`，不读取源文件，也不请求大模型或搜索服务。检索排序在 `src/lib/search/`，主页界面在独立组件中；本插件不依赖 `ModuleList`。

## 文件职责

- `index.js`：Docusaurus 生命周期、监听、生成数据模块、构建后校验。
- `build.cjs`：合并记录、稳定 ID、人工增补与去重。
- `adapters/docusaurus.cjs`：已解析的文档、目录、博客和页面元信息。
- `adapters/resources.cjs`：站内资源 JSON、分享场次、下载链接、资料树。
- `adapters/links.cjs`：正文参考链接，过滤代码示例和装饰图片。
- `text.cjs`：有限的关键词抽取；读取标题、小标题、加粗短语、有意义的 Markdown 链接文字、作者、标签以及本地导入数据的展示名称。
- `urls.cjs`：URL 安全检查、站内域名统一、工具路径合并。
- `validate.cjs`：验证输出中的页面、分享场次、工具、材料路径及下载文件。

## 数据契约

```js
{
  version: 1,
  records: [{
    id: 'stable hash of canonical URL',
    url: '/docs/comprehensive-assessment',
    title: '综测方案',
    description: '简介',
    keywords: ['综合素质测评'],
    aliases: ['综测细则'],
    kind: 'category',
    section: '综测方案',
    priority: 3 // integer, 0–5
  }]
}
```

- `kind`：`category`、`doc`、`blog`、`page`、`tool`、`repository`、`external`、`share`、`file`、`collection`。
- 相同 canonical URL 合并。四个已启用工具的独立页统一到 `/tool#id`；未加入工具工作台的独立页仍按真实页面收录。
- 资料文件与非空目录使用现有 `/materials#path=...` 协议，保留完整原始路径作为关键词。索引不读取 PDF、图片或 Office 正文。
- 目录页面来自 Docusaurus **已解析 sidebar 的 generated-index links**。`LoadedVersion` 并不包含内部 `FullVersion.categoryGeneratedIndices`，不能依赖该私有字段或带 hash 的缓存文件名。
- JSX 页面缺少标题元信息时可在 `config/search/overrides.json` 增补。人工配置不能新增不存在的 URL；删除/改名资源而未更新配置会使构建失败。
- `topics.json` 供浏览器按词义匹配，插件不将整组同义词散布到各资源，以免引入误匹配。

## 覆盖与边界

文档内指向 `/file/` 的附件、文档及生成目录、全部公开博客、博客标签与作者聚合、博客归档、内容页面、在线工具、仓库、推荐博客、北航/科研工具外链、分享活动与下载/网盘/录制链接、资料文件及非空目录会自动收录。静态装饰图片、代码示例 URL、博客重复分页、草稿/未列出内容和仅有 frontmatter 的辅导员占位页不会收录。

本文站点沿用默认 `/blog/archive`、`/blog/authors` 聚合路由；若修改 Docusaurus 对应路径，应同步适配器，构建时真实路由校验会阻止发布失效链接。外部链接只索引当前网站已有地址，不下载外站正文，也不承诺第三方网站持续可用。

每次 `npm run build` 会生成 `build/search-index.json` 与 `build/search-index-report.json`。报告记录按类型计数与显式页面排除理由。CI 同时执行检索查询回归，并将索引与网站作为同一产物部署。

运行目录生成器单测：

```sh
node --test tests/search-index/*.test.cjs
```
