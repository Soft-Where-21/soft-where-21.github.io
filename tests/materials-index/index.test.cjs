const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {test} = require('node:test');
const chokidar = require('chokidar');
const materialsIndexPlugin = require('../../plugins/materials-index');
const {buildMaterialsIndex} = require('../../plugins/materials-index/scan');

async function fixture(t) {
  const siteDir = await fs.mkdtemp(path.join(os.tmpdir(), 'materials-index-test-'));
  const root = path.join(siteDir, 'static', 'file', '资料分享');
  await fs.mkdir(root, {recursive: true});
  t.after(() => fs.rm(siteDir, {recursive: true, force: true}));
  const write = async (relative, content = 'abc') => {
    const target = path.join(root, relative);
    await fs.mkdir(path.dirname(target), {recursive: true});
    await fs.writeFile(target, content);
    return target;
  };
  return {siteDir, root, write};
}

test('recursively indexes every ordinary file, preserving names and byte totals', async (t) => {
  const {root, write} = await fixture(t);
  await write('付宁远/资料10/复习 #1 + 100%.PDF', '你好');
  await write('付宁远/资料2/README', 'four');
  await write('付宁远/资料2/2.md', '2');
  await write('付宁远/资料2/10.md', '10');
  await write('付宁远/说明.txt', 'abc');
  await fs.mkdir(path.join(root, '付宁远', '空目录'));

  const manifest = await buildMaterialsIndex(root);
  assert.equal(manifest.totalFiles, 5);
  assert.equal(manifest.totalSize, 16);
  const student = manifest.collections[0];
  assert.equal(student.path, '付宁远');
  assert.equal(student.fileCount, 5);
  assert.equal(student.totalSize, 16);
  assert.deepEqual(student.children.map((node) => node.name), ['空目录', '资料2', '资料10', '说明.txt']);
  assert.deepEqual(student.children[0].children, []);
  assert.deepEqual(student.children[1].children.map((node) => node.name), ['2.md', '10.md', 'README']);
  assert.equal(student.children[1].children[2].extension, '');
  assert.deepEqual(student.children[2].children[0], {
    name: '复习 #1 + 100%.PDF',
    path: '付宁远/资料10/复习 #1 + 100%.PDF',
    type: 'file',
    extension: '.pdf',
    size: 6,
  });
  assert.deepEqual(await buildMaterialsIndex(root), manifest);
});

test('new students and themes appear automatically, and root files form a collection', async (t) => {
  const {root, write} = await fixture(t);
  await write('付宁远/a.pdf');
  assert.equal((await buildMaterialsIndex(root)).collections.length, 1);
  await write('另一位同学/b.pdf', 'second');
  await write('算法专题/c.cpp', 'code');
  await write('阅读须知.md', 'read me');

  const manifest = await buildMaterialsIndex(root);
  assert.equal(manifest.collections.length, 4);
  assert.equal(manifest.totalFiles, 4);
  assert.equal(manifest.totalSize, 20);
  assert.ok(manifest.collections.every((node) => node.type === 'directory'));
  const shared = manifest.collections.find((node) => node.path === '');
  assert.equal(shared.name, '共享文件');
  assert.equal(shared.children[0].path, '阅读须知.md');
  assert.equal(shared.fileCount, 1);
  await fs.rm(path.join(root, '另一位同学'), {recursive: true});
  assert.equal((await buildMaterialsIndex(root)).totalFiles, 3);
});

test('ignores hidden and OS files, external symlinks, and symlink cycles', async (t) => {
  const {siteDir, root, write} = await fixture(t);
  const regular = await write('付宁远/notes.md', 'safe');
  await write('.DS_Store');
  await write('付宁远/._notes.md');
  await write('付宁远/.git/config');
  await write('付宁远/Thumbs.db');
  await write('付宁远/desktop.ini');
  await write('__MACOSX/file');
  const outside = path.join(siteDir, 'outside.txt');
  await fs.writeFile(outside, 'outside');
  await fs.symlink(outside, path.join(root, '付宁远', 'external.txt'));
  await fs.symlink(regular, path.join(root, '付宁远', 'internal.md'));
  await fs.symlink(root, path.join(root, '付宁远', 'loop'));
  const manifest = await buildMaterialsIndex(root);
  assert.equal(manifest.totalFiles, 1);
  assert.equal(manifest.totalSize, 4);
  assert.deepEqual(manifest.collections[0].children.map((node) => node.name), ['notes.md']);
  assert.equal(await fs.readFile(outside, 'utf8'), 'outside');
});

test('missing roots return an empty manifest and symlink roots are rejected', async (t) => {
  const {siteDir, root} = await fixture(t);
  assert.deepEqual(await buildMaterialsIndex(path.join(siteDir, 'missing')), {
    collections: [], totalFiles: 0, totalSize: 0,
  });
  const rootLink = path.join(siteDir, 'linked-root');
  await fs.symlink(root, rootLink);
  await assert.rejects(buildMaterialsIndex(rootLink), /must be a directory/);
});

test('reserves only the root avatar directory and repo config without changing material counts', async (t) => {
  const {root, write} = await fixture(t);
  await write('avatar/头像.png', 'avatar image');
  await write('repos.json', '{"同学":{"avatar":"avatar/头像.png"}}');
  await write('同学/notes.md', 'abc');
  await write('同学/avatar/示例.png', 'png');
  await write('同学/repos.json', '{}');

  const content = await buildMaterialsIndex(root);
  assert.deepEqual(content.collections.map((node) => node.path), ['同学']);
  assert.equal(content.totalFiles, 3);
  assert.equal(content.totalSize, 8);
  assert.ok(content.collections[0].children.some((node) => node.name === 'repos.json'));
  assert.ok(content.collections[0].children.some((node) => node.name === 'avatar'));
});

test('loads optional repo profiles by directory path and refreshes metadata on reload', async (t) => {
  const {siteDir, root, write} = await fixture(t);
  await write('付宁远/notes.md');
  await write('新同学/notes.pdf');
  const plugin = materialsIndexPlugin({siteDir}, {collectionNames: {'付宁远': '原名称'}});
  const original = await plugin.loadContent();
  assert.equal(original.collections.find((node) => node.path === '付宁远').name, '原名称');
  assert.equal(original.collections[0].avatar, '');
  assert.equal(original.collections[0].wechat, '');
  await write('avatar/付宁远 #1.png');
  await write('repos.json', JSON.stringify({'付宁远': {
    name: '付宁远 / 软院保研资料分享', avatar: 'avatar/付宁远 #1.png', wechat: ' profile-test ',
  }}));
  const content = await plugin.loadContent();
  const student = content.collections.find((node) => node.path === '付宁远');
  assert.equal(student.name, '付宁远 / 软院保研资料分享');
  assert.equal(student.avatar, 'avatar/付宁远 #1.png');
  assert.equal(student.wechat, 'profile-test');
  assert.deepEqual(student.children, original.collections.find((node) => node.path === '付宁远').children);
  assert.equal(content.totalFiles, 2);
  assert.equal(content.collections.find((node) => node.path === '新同学').name, '新同学');

  await write('repos.json', JSON.stringify({'付宁远': {wechat: 'updated-test'}}));
  assert.equal((await plugin.loadContent()).collections.find((node) => node.path === '付宁远').wechat, 'updated-test');
  await fs.unlink(path.join(root, 'repos.json'));
  assert.equal((await plugin.loadContent()).collections.find((node) => node.path === '付宁远').wechat, '');
});

test('invalid repo metadata reports the config and rejects avatars outside the avatar directory', async (t) => {
  const {siteDir, write} = await fixture(t);
  const plugin = materialsIndexPlugin({siteDir});
  for (const invalid of ['{', '[]', '{"同学":null}', '{"同学":{"wechat":123}}']) {
    await write('repos.json', invalid);
    await assert.rejects(plugin.loadContent(), /repos\.json/);
  }
  for (const avatar of ['https://example.com/avatar.png', 'avatar/../other.png', 'other/avatar.png', 'avatar/code.js']) {
    await write('repos.json', JSON.stringify({'同学': {avatar}}));
    await assert.rejects(plugin.loadContent(), /同学\.avatar/);
  }
});

test('Docusaurus lifecycle writes generated JSON and aliases its exact path', async (t) => {
  const {siteDir, write} = await fixture(t);
  await write('同学/notes.md');
  const plugin = materialsIndexPlugin({siteDir});
  const content = await plugin.loadContent();
  const generatedFile = path.join(siteDir, '.docusaurus', 'materials-index', 'default', 'index.json');
  assert.equal(plugin.name, 'materials-index');
  await plugin.contentLoaded({
    content,
    actions: {
      createData: async (name, data) => {
        assert.equal(name, 'index.json');
        assert.equal(data, content);
        return generatedFile;
      },
    },
  });
  assert.equal(plugin.configureWebpack().resolve.alias['@materials-index'], generatedFile);
});

test('watch paths detect a new nested student file and deletion', {timeout: 10000}, async (t) => {
  const {siteDir, write} = await fixture(t);
  const plugin = materialsIndexPlugin({siteDir});
  // Polling avoids platform-specific native watcher startup races in CI.
  const watcher = chokidar.watch(plugin.getPathsToWatch(), {
    ignoreInitial: true,
    usePolling: true,
    interval: 25,
  });
  t.after(() => watcher.close());
  await new Promise((resolve, reject) => {
    watcher.once('ready', resolve);
    watcher.once('error', reject);
  });
  const relative = path.join('另一位同学', '新目录', 'new.md');
  const waitFor = (event) => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Missing watcher event: ${event}`)), 5000);
    watcher.on(event, (filePath) => {
      if (!filePath.endsWith(relative)) return;
      clearTimeout(timeout);
      resolve();
    });
  });
  const added = waitFor('add');
  const target = await write(relative);
  await added;
  assert.equal((await plugin.loadContent()).totalFiles, 1);
  const removed = waitFor('unlink');
  await fs.unlink(target);
  await removed;
  assert.equal((await plugin.loadContent()).totalFiles, 0);
});
