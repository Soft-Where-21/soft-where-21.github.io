const path = require('node:path');
const {strings, plainText, contentKeywords, metadataKeywords, readSource, supplementaryKeywords} = require('../text.cjs');

function instances(allContent, name) {
  return Object.values(allContent[name] || {}).filter(Boolean);
}

function generatedCategories(version) {
  // LoadedContent exposes normalized sidebars, while categoryGeneratedIndices is
  // added only to the docs plugin's private FullVersion inside contentLoaded.
  // Traverse the resolved sidebar links so route metadata remains authoritative.
  const result = [...(version.categoryGeneratedIndices || [])];
  const visit = (items) => {
    for (const item of items || []) {
      if (item.type !== 'category') continue;
      if (item.link?.type === 'generated-index') result.push({...item.link, title: item.link.title || item.label});
      visit(item.items);
    }
  };
  for (const sidebar of Object.values(version.sidebars || {})) visit(sidebar);
  return [...new Map(result.map((category) => [category.permalink, category])).values()];
}

function categoryUrl(category) {
  return category.permalink || category.slug;
}

function parentCategory(categories, permalink) {
  return categories.filter((category) => permalink.startsWith(`${categoryUrl(category).replace(/\/$/, '')}/`))
    .sort((a, b) => categoryUrl(b).length - categoryUrl(a).length)[0];
}

function contextualTitle(title, section) {
  if (!section || title.includes(section)) return title;
  if (/^\d{4}(?:\s*级|\s*年)?$/.test(title)) return `${title}${section}`;
  if (section === '校园地图') return `${title}校区地图`;
  if (section === '北航校历') return `${title}北航校历`;
  return title;
}

const pageDefaults = {
  '/': ['Soft Where 首页', '检索软件学院的学习、生活、升学和工具资源'],
  '/materials': ['资料分享', '浏览同学分享的课程笔记、复习资料与代码'],
  '/recommend': ['优质博客', '同学们的技术博客与学习笔记'],
  '/tool/timestamp': ['时间戳转换工具', 'Unix 时间戳和日期时间互相转换'],
  '/tool/json': ['JSON 格式化工具', '在线美化、压缩和检查 JSON 数据'],
  '/tool/regex-builder': ['正则表达式工具', '构建、测试和匹配正则表达式'],
};

async function docusaurusRecords({siteDir, allContent, add, canonicalUrl, localUrl}) {
  const documents = [];
  const sources = [];
  for (const plugin of instances(allContent, 'docusaurus-plugin-content-docs')) {
    for (const version of plugin.loadedVersions || []) {
      const categories = generatedCategories(version);
      for (const category of categories) {
        add({url: categoryUrl(category), title: category.title, description: category.description || `查看${category.title}相关页面与资源`, keywords: category.keywords || [], aliases: [], kind: 'category', section: category.title, priority: 3});
      }
      for (const metadata of version.docs || []) {
        if (metadata.draft || metadata.unlisted) continue;
        const section = parentCategory(categories, metadata.permalink)?.title || '资源导航';
        const source = await readSource(siteDir, metadata.source);
        const title = contextualTitle(metadata.title, section);
        add({url: metadata.permalink, title, description: plainText(metadata.description), keywords: strings([metadataKeywords(metadata), metadata.title, section, contentKeywords(source), await supplementaryKeywords(siteDir, metadata.source, source)]), aliases: [], kind: 'doc', section, priority: 2});
        documents.push(metadata.permalink);
        sources.push({source, metadata: {...metadata, title}, kind: 'doc'});
      }
    }
  }

  for (const plugin of instances(allContent, 'docusaurus-plugin-content-blog')) {
    for (const post of plugin.blogPosts || []) {
      const metadata = post.metadata;
      if (metadata.unlisted || metadata.frontMatter?.draft) continue;
      const source = post.content || await readSource(siteDir, metadata.source);
      add({url: metadata.permalink, title: metadata.title, description: plainText(metadata.description), keywords: strings([metadataKeywords(metadata), contentKeywords(source), await supplementaryKeywords(siteDir, metadata.source, source)]), aliases: [], kind: 'blog', section: '经验博客', priority: 2});
      sources.push({source, metadata, kind: 'blog'});
    }
    const firstPage = (plugin.blogListPaginated || []).find((page) => page.metadata.page === 1);
    if (firstPage) add({url: firstPage.metadata.permalink, title: '经验博客', description: '课程学习、毕业去向、考研与保研经验分享', keywords: ['博客', '学习经验', '升学经验'], aliases: [], kind: 'category', section: '经验博客', priority: 3});
    if (firstPage) {
      add({url: `${firstPage.metadata.permalink.replace(/\/$/, '')}/archive`, title: '博客归档', description: '按发布日期查看全部经验博客', keywords: ['全部博客', '历史文章', '时间归档'], aliases: [], kind: 'category', section: '经验博客', priority: 1});
    }
    if (plugin.blogTagsListPath) add({url: plugin.blogTagsListPath, title: '博客标签', description: '按主题浏览经验博客', keywords: ['博客分类', '文章标签'], aliases: [], kind: 'category', section: '经验博客', priority: 1});
    const authorPages = new Map();
    for (const post of plugin.blogPosts || []) {
      if (post.metadata.unlisted || post.metadata.frontMatter?.draft) continue;
      for (const author of post.metadata.authors || []) {
        if (author.page?.permalink) authorPages.set(author.page.permalink, author);
      }
    }
    for (const [url, author] of authorPages) add({url, title: `${author.name}的经验博客`, description: plainText(author.description || author.title || `查看${author.name}发表的经验博客`), keywords: strings([author.name, author.key, '博客作者']), aliases: [], kind: 'category', section: '经验博客', priority: 1});
    if (authorPages.size) add({url: localUrl('/blog/authors'), title: '博客作者', description: '查看分享学习与升学经验的同学及其文章', keywords: ['作者', '学长学姐', '博客'], aliases: [], kind: 'category', section: '经验博客', priority: 1});
    // Tag and author pages are useful aggregate destinations with their real permalinks.
    for (const [url, tag] of Object.entries(plugin.blogTags || {})) {
      const label = tag.label || tag.name || tag.tag?.label;
      if (label) add({url, title: `${label} · 经验博客`, description: plainText(tag.description || `查看与${label}相关的经验博客`), keywords: [label, '博客'], aliases: [], kind: 'category', section: '经验博客', priority: 1});
    }
  }

  const exclusions = [];
  for (const plugin of instances(allContent, 'docusaurus-plugin-content-pages')) {
    for (const metadata of plugin || []) {
      if (metadata.unlisted || metadata.frontMatter?.draft) continue;
      const source = await readSource(siteDir, metadata.source);
      const pageUrl = canonicalUrl(metadata.permalink);
      if (pageUrl === localUrl('/counselor') && !source.replace(/^---[^]*?---/, '').trim()) {
        exclusions.push({url: metadata.permalink, reason: '仅有标题和描述，尚无正文内容'});
        continue;
      }
      // Tool components also become standalone routes; the configured tool workspace
      // is their canonical destination, so those entries merge with the JSON adapter.
      if (metadata.permalink.replace(/\/$/, '').includes('/tool/') && canonicalUrl(metadata.permalink).includes('#')) continue;
      const defaults = pageDefaults[pageUrl];
      const layoutTitle = source.match(/<Layout\b[^>]*\btitle="([^"]+)"/)?.[1];
      const title = metadata.title || metadata.frontMatter?.title || defaults?.[0] || layoutTitle || path.basename(path.dirname(metadata.source));
      const description = plainText(metadata.description || metadata.frontMatter?.description || defaults?.[1] || `${title}相关页面与资源`);
      add({url: metadata.permalink, title, description, keywords: strings([metadataKeywords(metadata), contentKeywords(source), await supplementaryKeywords(siteDir, metadata.source, source)]), aliases: [], kind: metadata.permalink.startsWith('/tool/') ? 'tool' : 'page', section: metadata.permalink.startsWith('/tool') ? '在线工具' : '站点导航', priority: 2});
      sources.push({source, metadata: {...metadata, title}, kind: 'page'});
    }
  }
  return {sources, exclusions, documents};
}

module.exports = {docusaurusRecords, contextualTitle, instances, generatedCategories};
