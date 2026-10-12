function createUrlTools({siteUrl = 'https://softwhere.top', baseUrl = '/', toolIds = []} = {}) {
  const prefix = `/${baseUrl.replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '');
  const localUrl = (value) => `${prefix}/${value.replace(/^\/+/, '')}`;
  const siteHosts = new Set(['softwhere.top', 'www.softwhere.top', 'soft-where-21.github.io', new URL(siteUrl).host]);
  const toolRoutes = new Map(toolIds.map((id) => [localUrl(`/tool/${id}`), `${localUrl('/tool')}#${encodeURIComponent(id)}`]));
  function canonicalUrl(value) {
    if (typeof value !== 'string' || !value.trim() || /[\\\u0000-\u001f\u007f]/.test(value)) throw new Error(`Invalid search URL: ${value}`);
    const input = value.trim().replace(/%(?![0-9a-f]{2})/gi, '%25');
    if (input.startsWith('//') || (!input.startsWith('/') && !/^https?:\/\//i.test(input))) throw new Error(`Unsupported search URL: ${input}`);
    const parsed = new URL(input, siteUrl);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error(`Unsafe search URL: ${input}`);
    const internal = input.startsWith('/') || siteHosts.has(parsed.host);
    if (!internal) return parsed.href;
    const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/$/, '');
    const canonicalTool = toolRoutes.get(pathname);
    if (canonicalTool) return canonicalTool;
    // Browser selection hashes use URLSearchParams; normalize equivalent encodings
    // so article links to a collection merge with the generated collection record.
    if (pathname === localUrl('/materials') && parsed.hash.startsWith('#path=')) {
      const selection = new URLSearchParams(parsed.hash.slice(1));
      return `${pathname}${parsed.search}#${selection.toString()}`;
    }
    return `${pathname}${parsed.search}${parsed.hash}`;
  }
  return {localUrl, canonicalUrl};
}
module.exports = {createUrlTools};
