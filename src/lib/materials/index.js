const MATERIALS_DIRECTORY = '资料分享';
const UNSAFE_CHARACTERS = /[\\\u0000-\u001f\u007f]/;

/** Index the generated tree without copying nodes or changing their order. */
export function indexMaterials(collections) {
  const nodesByPath = new Map();
  const collectionByPath = new Map();
  const files = [];

  function visit(node, collection) {
    nodesByPath.set(node.path, node);
    collectionByPath.set(node.path, collection);
    if (node.type === 'file') files.push(node);
    else (node.children || []).forEach((child) => visit(child, collection));
  }

  collections.forEach((collection) => visit(collection, collection));
  return {nodesByPath, files, collectionByPath};
}

function withTrailingSlash(baseUrl) {
  return `${baseUrl.replace(/\/+$/, '')}/`;
}

/** Accept decoded manifest paths; encode each filename exactly once. */
export function buildFileUrl(path, baseUrl = '/') {
  const encodedPath = [MATERIALS_DIRECTORY, ...path.split('/')]
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${withTrailingSlash(baseUrl)}file/${encodedPath}`;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4);
  if (exponent <= 0) return `${Math.round(bytes)} B`;
  const value = bytes / 1024 ** exponent;
  return `${Number(value.toFixed(value < 10 ? 1 : 0))} ${units[exponent]}`;
}

export function getAncestors(path) {
  const segments = path.split('/').filter(Boolean);
  return segments.slice(0, -1).map((_, index) =>
    segments.slice(0, index + 1).join('/')
  );
}

export function searchMaterials(files, query) {
  const normalize = (value) => value.normalize('NFKC').toLowerCase();
  const tokens = normalize(query).trim().split(/\s+/).filter(Boolean);
  return files.filter((file) => {
    const path = normalize(file.path);
    return tokens.every((token) => path.includes(token));
  });
}

function decodeSegment(segment) {
  try {
    // Markdown may contain a literal percent sign; valid escapes are decoded once.
    const decoded = decodeURIComponent(segment.replace(/%(?![0-9a-f]{2})/gi, '%25'));
    return UNSAFE_CHARACTERS.test(decoded) || decoded.includes('/') ? null : decoded;
  } catch {
    return null;
  }
}

function decodePath(path) {
  const segments = path.split('/').map(decodeSegment);
  return segments.includes(null) ? null : segments;
}

function normalizePath(segments, initial = []) {
  const result = [...initial];
  for (const segment of segments) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (!result.length) return null;
      result.pop();
    } else {
      result.push(segment);
    }
  }
  return result.join('/');
}

function startsWithSegments(segments, prefix) {
  return prefix.every((segment, index) => segments[index] === segment);
}

function decodeFragment(fragment) {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

/** Resolve Markdown links inside the materials root; unsafe links have an empty URL. */
export function resolveMaterialLink(href, currentPath, nodesByPath, baseUrl = '/') {
  if (typeof href !== 'string') return {url: ''};
  const value = href.trim();
  if (!value || UNSAFE_CHARACTERS.test(value)) return {url: ''};

  const scheme = value.match(/^([a-z][a-z0-9+.-]*):/i)?.[1].toLowerCase();
  if (scheme || value.startsWith('//')) {
    if (scheme && !['https', 'http', 'mailto'].includes(scheme)) return {url: ''};
    try {
      const parsed = new URL(value, 'https://materials.invalid');
      if (!['https:', 'http:', 'mailto:'].includes(parsed.protocol)) return {url: ''};
      return {url: value, external: true};
    } catch {
      return {url: ''};
    }
  }

  const hashIndex = value.indexOf('#');
  const beforeHash = hashIndex < 0 ? value : value.slice(0, hashIndex);
  const fragment = hashIndex < 0 ? undefined : decodeFragment(value.slice(hashIndex + 1));
  const fragmentSuffix = hashIndex < 0 ? '' : value.slice(hashIndex);
  if (!beforeHash) return {url: fragmentSuffix, fragment};

  const queryIndex = beforeHash.indexOf('?');
  const pathname = queryIndex < 0 ? beforeHash : beforeHash.slice(0, queryIndex);
  const query = queryIndex < 0 ? '' : beforeHash.slice(queryIndex);
  const segments = decodePath(pathname);
  if (!segments) return {url: ''};

  let path;
  if (pathname.startsWith('/')) {
    const rootSegments = segments.slice(1);
    const baseSegments = decodePath(baseUrl)?.filter(Boolean) || [];
    const prefixes = [
      [...baseSegments, 'file', MATERIALS_DIRECTORY],
      ['file', MATERIALS_DIRECTORY],
      ['static', 'file', MATERIALS_DIRECTORY],
    ];
    const prefix = prefixes.find((candidate) => startsWithSegments(rootSegments, candidate));
    if (!prefix) return {url: value};
    path = normalizePath(rootSegments.slice(prefix.length));
  } else if (!pathname) {
    path = currentPath;
  } else {
    path = normalizePath(segments, currentPath.split('/').slice(0, -1));
  }
  if (path === null) return {url: ''};

  return {
    url: `${buildFileUrl(path, baseUrl)}${query}${fragmentSuffix}`,
    ...(nodesByPath.has(path) ? {path} : {}),
    ...(fragment === undefined ? {} : {fragment}),
  };
}
