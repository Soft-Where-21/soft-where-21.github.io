import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/lib/materials/index.js', import.meta.url), 'utf8');
const {
  indexMaterials,
  buildFileUrl,
  formatBytes,
  getAncestors,
  searchMaterials,
  resolveMaterialLink,
} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const file = (path) => ({type: 'file', path, name: path.split('/').at(-1)});
const directory = (path, children) => ({type: 'directory', path, name: path.split('/').at(-1), children});
const collections = [
  directory('付宁远', [
    file('付宁远/README.md'),
    directory('付宁远/机器学习', [
      file('付宁远/机器学习/Ｌｅｃｔｕｒｅ 01.md'),
      file('付宁远/机器学习/笔记 #1 50%+复习?.pdf'),
      file('付宁远/机器学习/100%25.txt'),
    ]),
  ]),
  directory('另一位同学', [file('另一位同学/lecture 02.pdf')]),
];
const {nodesByPath, files, collectionByPath} = indexMaterials(collections);
const currentPath = '付宁远/机器学习/Ｌｅｃｔｕｒｅ 01.md';
const resolve = (href, baseUrl) => resolveMaterialLink(href, currentPath, nodesByPath, baseUrl);

test('indexes all files and directories across collections without changing nodes', () => {
  assert.equal(nodesByPath.size, 8);
  assert.equal(files.length, 5);
  assert.equal(nodesByPath.get(currentPath), collections[0].children[1].children[0]);
  assert.equal(collectionByPath.get(currentPath), collections[0]);
  assert.equal(collectionByPath.get('另一位同学/lecture 02.pdf'), collections[1]);
  assert.equal(collectionByPath.get('另一位同学'), collections[1]);

  const shared = directory('', [file('说明.md')]);
  const rootIndex = indexMaterials([shared]);
  assert.equal(rootIndex.nodesByPath.get(''), shared);
  assert.equal(rootIndex.collectionByPath.get('说明.md'), shared);
});

test('file URLs encode raw Chinese and reserved filename characters by path segment', () => {
  const path = '付宁远/机器学习/笔记 #1 50%+复习?.pdf';
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  assert.equal(buildFileUrl(path), `/file/${encodeURIComponent('资料分享')}/${encoded}`);
  assert.equal(buildFileUrl(path, '/soft-where/'), `/soft-where/file/${encodeURIComponent('资料分享')}/${encoded}`);
  assert.equal(buildFileUrl(path, '/soft-where'), buildFileUrl(path, '/soft-where/'));
  assert.match(buildFileUrl('付宁远/100%25.txt'), /100%2525\.txt$/);
});

test('ancestor paths exclude the selected node and support root files', () => {
  assert.deepEqual(getAncestors('付宁远/a/b.md'), ['付宁远', '付宁远/a']);
  assert.deepEqual(getAncestors('付宁远'), []);
  assert.deepEqual(getAncestors('说明.md'), []);
  assert.deepEqual(getAncestors(''), []);
});

test('search matches all normalized case-insensitive tokens anywhere in the path', () => {
  assert.deepEqual(searchMaterials(files, '付宁远 LECTURE'), [nodesByPath.get(currentPath)]);
  assert.equal(searchMaterials(files, 'lecture').length, 2);
  assert.equal(searchMaterials(files, 'lecture 机器学习').length, 1);
  assert.equal(searchMaterials(files, 'lecture 不存在').length, 0);
  assert.equal(searchMaterials(files, '  ').length, files.length);
  const manyFiles = Array.from({length: 400}, (_, index) => file(`资料/${index}.md`));
  assert.equal(searchMaterials(manyFiles, '资料').length, 400);
});

test('relative and parent Markdown links resolve to indexed files and keep fragments', () => {
  assert.deepEqual(resolve('../README.md#%E7%9B%AE%E5%BD%95'), {
    url: `${buildFileUrl('付宁远/README.md')}#%E7%9B%AE%E5%BD%95`,
    path: '付宁远/README.md',
    fragment: '目录',
  });
  assert.deepEqual(resolve('../../另一位同学/lecture%2002.pdf'), {
    url: buildFileUrl('另一位同学/lecture 02.pdf'),
    path: '另一位同学/lecture 02.pdf',
  });
  assert.deepEqual(resolve('#%E7%AE%80%E4%BB%8B'), {url: '#%E7%AE%80%E4%BB%8B', fragment: '简介'});
  assert.deepEqual(resolve('#'), {url: '#', fragment: ''});
});

test('encoded #, %, + and ? remain filename characters without double encoding', () => {
  const path = '付宁远/机器学习/笔记 #1 50%+复习?.pdf';
  const href = `${encodeURIComponent(path.split('/').at(-1))}?download=1#page=2`;
  assert.deepEqual(resolve(href), {
    url: `${buildFileUrl(path)}?download=1#page=2`,
    path,
    fragment: 'page=2',
  });
  assert.deepEqual(resolve('100%2525.txt'), {
    url: buildFileUrl('付宁远/机器学习/100%25.txt'),
    path: '付宁远/机器学习/100%25.txt',
  });
  assert.deepEqual(resolve('?download=1'), {
    url: `${buildFileUrl(currentPath)}?download=1`,
    path: currentPath,
  });
});

test('root static URLs recognize nodes with or without a deployment base URL', () => {
  const path = '付宁远/README.md';
  assert.deepEqual(resolve(`/file/资料分享/${path}`), {url: buildFileUrl(path), path});
  assert.deepEqual(resolve(`/static/file/资料分享/${path}`), {url: buildFileUrl(path), path});
  assert.deepEqual(resolve(buildFileUrl(path, '/site/'), '/site/'), {
    url: buildFileUrl(path, '/site/'),
    path,
  });
  assert.deepEqual(resolve('/docs/getting-started'), {url: '/docs/getting-started'});
});

test('missing relative images retain an encoded static URL but no indexed path', () => {
  assert.deepEqual(resolve('images/讲义 图%20示.png', '/site/'), {
    url: buildFileUrl('付宁远/机器学习/images/讲义 图 示.png', '/site/'),
  });
});

test('rejects traversal outside materials, backslashes and dangerous protocols', () => {
  for (const href of [
    '../../../secret.txt',
    '%2e%2e/%2e%2e/%2e%2e/secret.txt',
    '/file/资料分享/../secret.txt',
    '/file/资料分享/%2e%2e/secret.txt',
    '..\\..\\secret.txt',
    '..%5c..%5csecret.txt',
    '%2f%2fevil.example/path',
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'java\nscript:alert(1)',
    'data:text/html,test',
    'file:///etc/passwd',
    'vbscript:test',
  ]) {
    assert.deepEqual(resolve(href), {url: ''}, href);
  }
});

test('allows external HTTP, HTTPS, mailto and protocol-relative links', () => {
  for (const href of ['https://example.com/a#b', 'http://example.com/', 'mailto:hello@example.com', '//example.com/image.png']) {
    assert.deepEqual(resolve(href), {url: href, external: true});
  }
});

test('formats byte sizes compactly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(-1), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(2 * 1024 ** 2), '2 MB');
  assert.equal(formatBytes(20.1 * 1024 ** 2), '20 MB');
});
