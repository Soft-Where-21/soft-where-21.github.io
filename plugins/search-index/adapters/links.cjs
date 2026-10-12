const {prose, plainText, strings} = require('../text.cjs');

const MEDIA = /\.(?:png|jpe?g|gif|webp|svg|ico|avif)(?:[?#]|$)/i;

// URLs are extracted only from public content, without crawling linked sites.
// Code examples, images and placeholder links do not become search destinations.
function outgoingLinks(source) {
  const body = prose(source);
  const links = [];
  for (const match of body.matchAll(/(?<!!)\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    links.push({url: match[2], label: plainText(match[1])});
  }
  for (const match of body.matchAll(/<a\b[^>]*\bhref=['"](https?:\/\/[^'"]+|\/[^'"]+)['"][^>]*>([^]*?)<\/a>/g)) {
    links.push({url: match[1], label: plainText(match[2])});
  }
  // Ordinary prose also contains unlinked URLs and escaped autolinks; preserve
  // their paragraph as context but do not index JSX/JavaScript source strings.
  const unlinkedBody = body.replace(/!?\[[^\]\n]*\]\([^\n)]*\)/g, ' ').replace(/<a\b[^>]*>[^]*?<\/a>/g, ' ');
  for (const line of unlinkedBody.split(/\r?\n/)) {
    if (/^\s*(?:<|\{|\}|const |let |return |function |\/\/)/.test(line)) continue;
    for (const match of line.matchAll(/https?:\/\/[^\s<>"'，。；、（）()[\]]+/g)) {
      const url = match[0].replace(/\\([.#_-])/g, '$1').replace(/[)\]}>.,;:]+$/, '');
      if (links.some((link) => link.url === url)) continue;
      links.push({url, label: plainText(line.replace(match[0], '')).replace(/[()[\]]/g, '').replace(/^[-*\s]+/, '').slice(0, 120), bare: true});
    }
  }
  return links.filter((link) => !MEDIA.test(link.url));
}

function linkedRecords({sources, add, canonicalUrl, records, localUrl = (url) => url}) {
  for (const {source, metadata} of sources) {
    for (const link of outgoingLinks(source)) {
      let url;
      try {url = canonicalUrl(link.url);} catch {continue;}
      // Internal content already has higher quality titles and context. Adding an
      // incoming article's keywords here would make unrelated pages rank for it.
      if (records.has(url)) continue;
      const localAttachment = url.startsWith(localUrl('/file/'));
      if (url.startsWith('/') && !localAttachment) continue;
      const generic = !link.label || /^[\p{P}\p{S}\s]+$/u.test(link.label) || /^(?:https?:|链接$|click here$)/i.test(link.label);
      if (localAttachment) {
        const filename = decodeURIComponent(new URL(url, 'https://search.invalid').pathname.split('/').pop());
        add({url, title: generic ? filename : link.label, description: `来自《${metadata.title}》的附件`, keywords: strings([metadata.title, link.label, filename]), aliases: [], kind: 'file', section: '文内附件', priority: 0});
        continue;
      }
      const usefulLabel = link.label.replace(/[:：。\s]+$/, '');
      const title = link.bare ? `${metadata.title} · ${usefulLabel && usefulLabel.length <= 24 ? usefulLabel : new URL(url).hostname}` : generic ? `${metadata.title} · 相关链接` : link.label;
      add({url, title, description: `来自《${metadata.title}》的参考链接`, keywords: strings([metadata.title, link.label]), aliases: [], kind: 'external', section: '文章参考', priority: 0});
    }
    // These download/install links are literals because the tools page renders
    // them via variables. Keep them attached to their meaningful parent page.
    if (metadata.permalink.replace(/\/$/, '') === '/tool') {
      for (const match of source.matchAll(/https:\/\/github\.com\/Soft-Where-21\/byxt-grade-extension[^'"\s;]*/g)) {
        add({url: match[0], title: match[0].includes('/releases/download/') ? '保研成绩导入插件下载' : '保研成绩导入插件安装说明', description: '从保研成绩认定系统导入成绩，配合本站保研成绩计算器使用', keywords: ['成绩导入', '保研成绩', '浏览器插件', 'byxt-grade-extension'], aliases: [], kind: 'external', section: '在线工具', priority: 1});
      }
    }
  }
}

module.exports = {outgoingLinks, linkedRecords};
