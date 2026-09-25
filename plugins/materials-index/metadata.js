const fs = require('node:fs/promises');
const path = require('node:path');

const CONFIG_FILE = 'repos.json';
const AVATAR_DIRECTORY = 'avatar';
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

async function readRepoMetadata(rootPath) {
  let text;
  try {
    text = await fs.readFile(path.join(rootPath, CONFIG_FILE), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return new Map();
    throw error;
  }

  let config;
  try {
    config = JSON.parse(text);
  } catch (error) {
    throw new Error(`[materials-index] ${CONFIG_FILE} 不是有效的 JSON：${error.message}`);
  }
  if (!isObject(config)) throw new Error(`[materials-index] ${CONFIG_FILE} 必须是以资料集目录名为键的对象。`);

  const metadata = new Map();
  for (const [repo, values] of Object.entries(config)) {
    if (!isObject(values)) throw new Error(`[materials-index] ${CONFIG_FILE} 中“${repo}”的配置必须是对象。`);
    const entry = {};
    for (const field of ['name', 'avatar', 'wechat']) {
      if (values[field] !== undefined && typeof values[field] !== 'string') {
        throw new Error(`[materials-index] ${CONFIG_FILE} 中“${repo}.${field}”必须是字符串。`);
      }
      entry[field] = values[field]?.trim() || '';
    }
    if (entry.avatar) {
      const segments = entry.avatar.split('/');
      if (segments.length < 2 || segments[0] !== AVATAR_DIRECTORY ||
          segments.some((segment) => !segment || segment === '.' || segment === '..') ||
          /[\\\u0000-\u001f\u007f]/.test(entry.avatar) ||
          !imageExtensions.has(path.extname(entry.avatar).toLowerCase())) {
        throw new Error(`[materials-index] ${CONFIG_FILE} 中“${repo}.avatar”应为 avatar/ 下的图片路径，例如 avatar/付宁远.jpg。`);
      }
    }
    metadata.set(repo, entry);
  }
  return metadata;
}

module.exports = {CONFIG_FILE, AVATAR_DIRECTORY, readRepoMetadata};
