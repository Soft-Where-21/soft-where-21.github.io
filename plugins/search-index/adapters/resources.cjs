const fs = require('node:fs/promises');
const path = require('node:path');
const {strings, plainText} = require('../text.cjs');

const JSON_SOURCES = [
  'src/pages/repo/repo.json',
  'src/pages/recommend/friend-links.json',
  'src/pages/tool/tools.json',
  'src/pages/share/shares.json',
  'docs/BUAA工具.tools.json',
  'docs/科研工具.tools.json',
];

async function readJson(siteDir, relative) {
  return JSON.parse(await fs.readFile(path.join(siteDir, relative), 'utf8'));
}

async function loadResourceData(siteDir) {
  return Object.fromEntries(await Promise.all(JSON_SOURCES.map(async (relative) => [relative, await readJson(siteDir, relative)])));
}

function resourceRecords({data, add, localUrl}) {
  const repositories = data['src/pages/repo/repo.json'];
  for (const repo of repositories.repos || []) {
    add({url: repo.url || `${repositories.org.githubUrl.replace(/\/$/, '')}/${repo.name}`, title: repo.name, description: repo.description || repo.name, keywords: strings([repo.description, repo.language, repo.author?.name, '开源仓库', '代码', 'GitHub']), aliases: [], kind: 'repository', section: '开源仓库', priority: repo.featured ? 2 : 1});
  }
  for (const blog of data['src/pages/recommend/friend-links.json'].blogs || []) {
    add({url: blog.url, title: `${blog.nickname} 的博客`, description: blog.tagline || `${blog.nickname}的学习笔记`, keywords: [blog.nickname, blog.tagline, '个人博客', '学习笔记'], aliases: [blog.nickname], kind: 'external', section: '优质博客', priority: 1});
  }
  for (const tool of data['src/pages/tool/tools.json'].tools || []) {
    add({url: `${localUrl('/tool')}#${encodeURIComponent(tool.id)}`, title: tool.name, description: tool.tagline || tool.name, keywords: strings([tool.shortName, tool.tagline, '在线工具']), aliases: [], kind: 'tool', section: '在线工具', priority: 3});
  }
  for (const [filename, section] of [['docs/BUAA工具.tools.json', '北航工具'], ['docs/科研工具.tools.json', '科研工具']]) {
    for (const tool of data[filename].tools || []) {
      add({url: tool.href, title: tool.name, description: tool.tagline || tool.name, keywords: strings([tool.tags || [], tool.details || [], section]), aliases: [], kind: 'external', section, priority: 1});
    }
  }
  for (const share of data['src/pages/share/shares.json'].shares || []) {
    const resources = (share.resources || []).flatMap((resource) => [resource, ...(resource.files || [])]);
    add({url: `${localUrl('/share')}#${encodeURIComponent(share.id)}`, title: share.title, description: share.summary || share.title, keywords: strings([share.tag, share.date, resources.flatMap((resource) => [resource.name, resource.note])]), aliases: [], kind: 'share', section: '分享回放', priority: 2});
    for (const resource of resources) {
      for (const url of strings([resource.downloadUrl, resource.url])) {
        add({url: url.startsWith('/') ? localUrl(url) : url, title: `${share.title} · ${resource.name || '分享资源'}`, description: plainText(resource.note || share.summary || share.title), keywords: strings([share.title, share.tag, share.date, resource.name, resource.type, '分享资源']), aliases: [], kind: url.startsWith('/') ? 'file' : 'external', section: '分享回放', priority: 0});
      }
    }
  }
}

function materialsRecords({materials, add, localUrl}) {
  const paths = new Set();
  const visit = (node, collection, parents = []) => {
    // Empty directories have no resources and are not copied by static hosting.
    if (node.type === 'directory' && node.fileCount === 0) return;
    paths.add(node.path);
    const segments = node.path.split('/').filter(Boolean);
    const ancestors = strings([collection.name, parents.map((parent) => parent.name), segments.slice(0, -1)]);
    const title = node.name;
    const isDirectory = node.type === 'directory';
    add({url: `${localUrl('/materials')}#${new URLSearchParams({path: node.path})}`, title, description: isDirectory ? `${collection.name} · ${node.path || '共享文件'} · ${node.fileCount} 份资料` : `${collection.name} · ${segments.slice(1).join(' / ') || node.name}`, keywords: strings([node.path, ancestors, node.extension?.replace(/^\./, ''), '资料分享', isDirectory ? '资料目录' : '课程资料']), aliases: [], kind: isDirectory ? 'collection' : 'file', section: '资料分享', priority: isDirectory ? 1 : 0});
    for (const child of node.children || []) visit(child, collection, [...parents, node]);
  };
  for (const collection of materials.collections || []) visit(collection, collection);
  return paths;
}

module.exports = {JSON_SOURCES, loadResourceData, resourceRecords, materialsRecords};
