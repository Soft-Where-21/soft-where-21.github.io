/** Derive resource cards from Docusaurus's resolved sidebar and document metadata. */
export function createModuleSections(sidebarItems, docs, currentDocId) {
  const seen = new Set();
  function collect(items) {
    return items.flatMap((item) => {
      // Nested folders remain part of their top-level resource section.
      if (item.type === 'category') return collect(item.items || []);
      if (item.type !== 'link' || item.unlisted || item.docId === currentDocId || !item.href || seen.has(item.href)) return [];
      seen.add(item.href);
      const doc = docs[item.docId];
      return [{title: doc?.title || item.label, description: item.description ?? doc?.description ?? '', link: item.href}];
    });
  }
  const categories = [];
  const standaloneItems = [];
  for (const item of sidebarItems) {
    if (item.type === 'category') {
      const items = collect(item.items || []);
      if (items.length) categories.push({title: item.label, link: item.linkUnlisted ? undefined : item.href, items});
    } else {
      standaloneItems.push(...collect([item]));
    }
  }
  return {categories, standaloneItems};
}
