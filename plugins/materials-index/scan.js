const fs = require('node:fs/promises');
const path = require('node:path');

const collator = new Intl.Collator('zh-CN', {
  numeric: true,
  sensitivity: 'base',
});

const systemNames = new Set(['__macosx', 'thumbs.db', 'desktop.ini']);

function isIgnored(name) {
  return name.startsWith('.') || systemNames.has(name.toLowerCase());
}

function compareNodes(a, b) {
  if (a.type !== b.type) {
    return a.type === 'directory' ? -1 : 1;
  }

  return (
    collator.compare(a.name, b.name) ||
    (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
  );
}

function summarize(children) {
  return children.reduce(
    (totals, node) => ({
      fileCount: totals.fileCount + (node.type === 'directory' ? node.fileCount : 1),
      totalSize: totals.totalSize + (node.type === 'directory' ? node.totalSize : node.size),
    }),
    {fileCount: 0, totalSize: 0},
  );
}

async function readDirectory(rootPath, relativePath = '') {
  const directoryPath = path.join(rootPath, relativePath);
  let entries;
  try {
    entries = await fs.readdir(directoryPath, {withFileTypes: true});
  } catch (error) {
    // A directory can disappear while the development watcher is rescanning.
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const children = [];
  for (const entry of entries) {
    // Symlinks are intentionally excluded, including links into this tree:
    // the index describes physical assets and cannot recurse into a link cycle.
    if (isIgnored(entry.name) || entry.isSymbolicLink()) continue;

    const relative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const nested = await readDirectory(rootPath, relative);
      children.push({
        name: entry.name,
        path: relative,
        type: 'directory',
        children: nested,
        ...summarize(nested),
      });
    } else if (entry.isFile()) {
      try {
        const stat = await fs.lstat(path.join(rootPath, relative));
        // Recheck in case the file was replaced with a symlink during scanning.
        if (!stat.isFile()) continue;
        children.push({
          name: entry.name,
          path: relative,
          type: 'file',
          extension: path.extname(entry.name).toLowerCase(),
          size: stat.size,
        });
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }

  return children.sort(compareNodes);
}

async function buildMaterialsIndex(rootPath) {
  try {
    const stat = await fs.lstat(rootPath);
    if (!stat.isDirectory()) {
      throw new Error(`Materials root must be a directory: ${rootPath}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {collections: [], totalFiles: 0, totalSize: 0};
    }
    throw error;
  }

  const children = await readDirectory(rootPath);
  const collections = children.filter((node) => node.type === 'directory');
  const rootFiles = children.filter((node) => node.type === 'file');

  if (rootFiles.length) {
    collections.push({
      name: '共享文件',
      path: '',
      type: 'directory',
      children: rootFiles,
      ...summarize(rootFiles),
    });
    collections.sort(compareNodes);
  }

  const totals = summarize(collections);
  return {collections, totalFiles: totals.fileCount, totalSize: totals.totalSize};
}

module.exports = {buildMaterialsIndex};
