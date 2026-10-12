const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {buildSearchIndex} = require('../../plugins/search-index/build.cjs');
const {validateCatalog} = require('../../plugins/search-index/validate.cjs');
const {createUrlTools} = require('../../plugins/search-index/urls.cjs');
const {outgoingLinks} = require('../../plugins/search-index/adapters/links.cjs');
const {plainText, linkLabels} = require('../../plugins/search-index/text.cjs');

async function fixture(t) {
  const siteDir = await fs.mkdtemp(path.join(os.tmpdir(), 'softwhere-search-'));
  t.after(() => fs.rm(siteDir, {recursive: true, force: true}));
  await fs.mkdir(path.join(siteDir, 'docs'), {recursive: true});
  await fs.mkdir(path.join(siteDir, 'src/pages/tool/gpa'), {recursive: true});
  await fs.writeFile(path.join(siteDir, 'docs/2023.mdx'), '# 竞赛加分\n**学生工作**\n');
  await fs.writeFile(path.join(siteDir, 'src/pages/tool/gpa/index.jsx'), 'export default function Gpa() { return null; }');
  const materials = {collections: [{name: '唐同学', path: '唐同学', type: 'directory', fileCount: 1, children: [{name: '期末 复习.pdf', path: '唐同学/期末 复习.pdf', type: 'file', extension: '.pdf', size: 12}]}]};
  const allContent = {
    'docusaurus-plugin-content-docs': {default: {loadedVersions: [{sidebars: {docs: [{type: 'category', label: '综测方案', link: {type: 'generated-index', permalink: '/docs/comprehensive-assessment'}, items: []}]}, docs: [{title: '2023级', permalink: '/docs/comprehensive-assessment/2023', description: '2023级综合素质测评', source: '@site/docs/2023.mdx', tags: [], frontMatter: {}}]}]}},
    'docusaurus-plugin-content-pages': {default: [{type: 'jsx', permalink: '/tool/gpa', source: '@site/src/pages/tool/gpa/index.jsx'}]},
    'materials-index': {default: materials},
  };
  const data = {
    'src/pages/repo/repo.json': {org: {githubUrl: 'https://github.com/org'}, repos: [{name: 'course', description: '课程资料'}]},
    'src/pages/recommend/friend-links.json': {blogs: []},
    'src/pages/tool/tools.json': {tools: [{id: 'gpa', name: 'GPA 计算器', tagline: '计算课程绩点'}]},
    'src/pages/share/shares.json': {shares: [{id: 'event', title: '算法串讲', summary: '算法复习', resources: [{name: '讲座 PPT', downloadUrl: '/file/talk.pptx'}]}]},
    'docs/BUAA工具.tools.json': {tools: []},
    'docs/科研工具.tools.json': {tools: []},
  };
  return {siteDir, allContent, data};
}

test('catalog covers generated categories, contextual documents, canonical tools and every material path', async (t) => {
  const built = await buildSearchIndex(await fixture(t));
  const byUrl = new Map(built.catalog.records.map((record) => [record.url, record]));
  assert.equal(byUrl.get('/docs/comprehensive-assessment').kind, 'category');
  assert.equal(byUrl.get('/docs/comprehensive-assessment/2023').title, '2023级综测方案');
  assert.ok(byUrl.get('/docs/comprehensive-assessment/2023').keywords.includes('竞赛加分'));
  assert.ok(byUrl.has('/tool#gpa'));
  assert.ok(!byUrl.has('/tool/gpa'));
  const material = byUrl.get(`/materials#${new URLSearchParams({path: '唐同学/期末 复习.pdf'})}`);
  assert.ok(material.keywords.includes('唐同学/期末 复习.pdf'));
  assert.equal(byUrl.get(`/materials#${new URLSearchParams({path: '唐同学'})}`).kind, 'collection');
  assert.ok(byUrl.has('/share#event'));
  assert.ok(byUrl.has('/file/talk.pptx'));
  assert.ok(byUrl.has('https://github.com/org/course'));
  assert.equal(new Set(built.catalog.records.map((record) => record.id)).size, built.catalog.records.length);
});

test('overrides enrich existing URLs and fail when a destination was removed', async (t) => {
  const options = await fixture(t);
  const built = await buildSearchIndex({...options, overrides: {'/tool/gpa': {aliases: ['算绩点'], keywords: ['加权平均']}}});
  const tool = built.catalog.records.find((record) => record.url === '/tool#gpa');
  assert.deepEqual(tool.aliases, ['算绩点']);
  assert.ok(tool.keywords.includes('在线工具'));
  assert.ok(tool.keywords.includes('加权平均'));
  await assert.rejects(buildSearchIndex({...options, overrides: {'/removed': {aliases: ['旧资源']}}}), /no live destination/);
  await assert.rejects(buildSearchIndex({...options, overrides: {'/tool#gpa': {url: 'javascript:alert(1)'}}}), /Unsupported search override field/);
});

test('structured resource names keep underscores and punctuation', () => {
  assert.equal(plainText('BUAA_OS_resources'), 'BUAA_OS_resources');
  assert.equal(plainText('file_name.cpp'), 'file_name.cpp');
  assert.equal(plainText('**学生工作**与 `C++`'), '学生工作与 C++');
});

test('URL canonicalization preserves browser selections and rejects unsafe schemes', () => {
  const {canonicalUrl} = createUrlTools({toolIds: ['gpa']});
  assert.equal(canonicalUrl('https://softwhere.top/tool/gpa'), '/tool#gpa');
  assert.equal(canonicalUrl('/materials#path=notes%2Fa%20b.pdf'), '/materials#path=notes%2Fa+b.pdf');
  for (const url of ['javascript:alert(1)', '//elsewhere.test', 'data:text/html,x', '/foo\\bar', 'https://user:password@host.test']) assert.throws(() => canonicalUrl(url));
});

test('public article links are included while code examples and image URLs are omitted', () => {
  const source = '# 参考\n[官方通知](https://university.test/notice)\n![图片](https://images.test/a.png)\n```sh\nhttps://example.test/fake\n```\n学院官网：https://university.test/\n[https://university.test/notice](https://university.test/notice)后面紧跟中文。\n';
  assert.deepEqual([...new Set(outgoingLinks(source).map((link) => link.url))].sort(), ['https://university.test/', 'https://university.test/notice']);
});

test('deployment validation rejects broken routes, stale browser selections and missing downloadable assets', async (t) => {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'softwhere-search-output-'));
  t.after(() => fs.rm(outDir, {recursive: true, force: true}));
  const make = (url) => ({id: url, url, title: '资源', description: '资源说明'});
  const options = {outDir, routesPaths: ['/materials', '/tool', '/share'], materialPaths: new Set(['notes/file.pdf']), toolIds: ['gpa'], shareIds: ['event']};
  await assert.rejects(validateCatalog({...options, catalog: {records: [make('/missing')]}}), /目标页面\/文件不存在/);
  await assert.rejects(validateCatalog({...options, catalog: {records: [make('/tool#unknown')]}}), /工具不存在/);
  await assert.rejects(validateCatalog({...options, catalog: {records: [make('/materials#path=missing')]}}), /资料路径不存在/);
  await assert.rejects(validateCatalog({...options, catalog: {records: [make('/file/missing.pdf')]}}), /目标页面\/文件不存在/);
  await fs.mkdir(path.join(outDir, 'file/资料分享/notes'), {recursive: true});
  await fs.writeFile(path.join(outDir, 'file/资料分享/notes/file.pdf'), 'pdf fixture');
  await validateCatalog({...options, catalog: {records: [make('/tool#gpa'), make('/share#event'), make('/materials#path=notes%2Ffile.pdf')]}});
});


test('new document attachments and meaningful link labels stay discoverable', async (t) => {
  const options = await fixture(t);
  await fs.appendFile(path.join(options.siteDir, 'docs/2023.mdx'), '\n[实验补充资料](/file/lab.pdf)\n[选课入口](/docs/intro)\n[https://example.test/](https://example.test/)\n![装饰图片](https://image.test/logo.png)\n[![徽章](https://image.test/badge.svg)](https://badge.test/)\n');
  const built = await buildSearchIndex(options);
  const attachment = built.catalog.records.find((record) => record.url === '/file/lab.pdf');
  assert.equal(attachment.kind, 'file');
  assert.equal(attachment.title, '实验补充资料');
  assert.ok(attachment.keywords.includes('lab.pdf'));
  const parent = built.catalog.records.find((record) => record.url === '/docs/comprehensive-assessment/2023');
  assert.ok(parent.keywords.includes('实验补充资料'));
  assert.ok(parent.keywords.includes('选课入口'));
  assert.deepEqual(linkLabels('[选课入口](/docs/intro) ![装饰](https://image.test/x.png) [![徽章](https://image.test/badge.svg)](https://badge.test/) [https://example.test/](https://example.test/)'), ['选课入口']);
  const validation = {...built, catalog: {records: [attachment]}, outDir: options.siteDir, routesPaths: []};
  await assert.rejects(validateCatalog(validation), /目标页面\/文件不存在/);
  await fs.mkdir(path.join(options.siteDir, 'file'));
  await fs.writeFile(path.join(options.siteDir, 'file/lab.pdf'), 'test attachment');
  await validateCatalog(validation);
});
