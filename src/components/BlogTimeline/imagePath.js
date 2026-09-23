// Relative image paths are rooted at static/file/timeline, not at the blog URL.
export function resolveTimelineImagePath(src) {
  const path = src.trim();
  if (/^(https?:)?\/\//i.test(path)) return path;

  const relativePath = path
    .replace(/^(\.\/)+/, '')
    .replace(/^\/?(?:static\/)?file\/timeline\//, '')
    .replace(/^\/+/, '');
  return `/file/timeline/${relativePath}`;
}
