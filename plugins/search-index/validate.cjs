const fs = require('node:fs/promises');
const path = require('node:path');

const normalizeRoute = (route) => route === '/' ? '/' : route.replace(/\/$/, '');

async function validateCatalog({catalog, materialPaths, toolIds, shareIds, outDir, routesPaths, baseUrl = '/'}) {
  outDir = path.resolve(outDir);
  const failures = [];
  const routes = new Set(routesPaths.map(normalizeRoute));
  const seen = new Set();
  const prefix = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
  for (const record of catalog.records) {
    if (seen.has(record.url)) failures.push(`重复地址: ${record.url}`);
    seen.add(record.url);
    if (!record.title || !record.description) failures.push(`缺少标题/简介: ${record.url}`);
    if (!record.url.startsWith('/')) continue;
    const parsed = new URL(record.url, 'https://search.invalid');
    const pathname = normalizeRoute(parsed.pathname);
    if (!routes.has(pathname)) {
      const relative = decodeURIComponent(pathname.slice(prefix.length)).replace(/^\/+/, '');
      const filename = path.resolve(outDir, relative);
      if (!filename.startsWith(`${outDir}${path.sep}`)) failures.push(`不安全文件地址: ${record.url}`);
      else {
        try {if (!(await fs.stat(filename)).isFile()) failures.push(`不是可访问文件: ${record.url}`);} catch {failures.push(`目标页面/文件不存在: ${record.url}`);}
      }
    }
    if (pathname === `${prefix}/materials` && parsed.hash) {
      const selection = new URLSearchParams(parsed.hash.slice(1));
      const materialPath = selection.get('path');
      if (materialPath === null || !materialPaths.has(materialPath)) failures.push(`资料路径不存在: ${record.url}`);
      else {
        const filename = path.join(outDir, 'file', '资料分享', materialPath);
        try {await fs.stat(filename);} catch {failures.push(`资料未随页面部署: ${record.url}`);}
      }
    }
    if (pathname === `${prefix}/tool` && parsed.hash && !toolIds.includes(decodeURIComponent(parsed.hash.slice(1)))) failures.push(`工具不存在: ${record.url}`);
    if (pathname === `${prefix}/share` && parsed.hash && !shareIds.includes(decodeURIComponent(parsed.hash.slice(1)))) failures.push(`分享场次不存在: ${record.url}`);
  }
  if (failures.length) throw new Error(`Search index validation failed (${failures.length}):\n${failures.join('\n')}`);
}
module.exports = {validateCatalog};
