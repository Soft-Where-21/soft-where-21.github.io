# 资料浏览逻辑

本目录只放与界面无关的纯函数。目录数据由资料插件生成，组件不直接扫描文件系统。

- 节点为 `{type: 'directory' | 'file', name, path, children?}`，`path` 是相对 `static/file/资料分享` 的原始文件名路径，不能提前 URL 编码。
- `indexMaterials(collections)` 保留节点引用和目录顺序，建立全节点索引、文件列表，以及节点所属的第一级资料集索引。根目录散落文件可放在 `path: ''` 的合成资料集中。
- `buildFileUrl` 接收原始路径，按路径段编码中文、空格、`#`、`%` 等字符，并兼容站点 `baseUrl`。
- `resolveMaterialLink` 接收 Markdown 的链接地址，先区分查询参数和锚点，再解码路径。已收录文件返回 `path`，未收录附件仍返回静态 URL。允许跨资料集链接，拒绝越过资料根目录和危险协议；拒绝时返回 `{url: ''}`。`fragment` 不含开头的 `#`，并已解码，可用于查找页面锚点。
- `searchMaterials` 对完整路径进行 NFKC 规范化与不区分大小写的多词匹配，所有搜索词均须命中，不截断结果。

验证：`node --test tests/materials-browser.test.mjs`。
