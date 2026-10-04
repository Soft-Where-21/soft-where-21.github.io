// Some Markdown exports escape punctuation in bare URLs. GFM can turn these
// into invalid links and include the surrounding prose, breaking blog feeds.
// Opt in per article to render those URLs as ordinary Markdown text while
// keeping the author's source untouched.
module.exports = function remarkPreserveEscapedAutolinks() {
  return (tree, file) => {
    if (file.data.frontMatter?.preserve_escaped_autolinks !== true) {
      return;
    }

    const source = String(file.value);
    function visit(parent) {
      if (!parent.children) return;

      parent.children = parent.children.map((node) => {
        if (node.type === 'link' && node.url.includes('\\') && node.position) {
          const raw = source.slice(node.position.start.offset, node.position.end.offset);
          // Explicit [links](...) and <autolinks> retain their normal behavior.
          if (/^https?:\/\//i.test(raw)) {
            return {
              type: 'text',
              value: raw.replace(/\\([!-/:-@\[-`{-~])/g, '$1'),
              position: node.position,
            };
          }
        }
        visit(node);
        return node;
      });
    }

    visit(tree);
  };
};
