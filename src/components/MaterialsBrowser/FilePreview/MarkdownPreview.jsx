import React, {isValidElement, useEffect, useMemo, useRef, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import CodeBlock from '@theme/CodeBlock';
import 'katex/dist/katex.min.css';
import usePreviewResource, {readText} from './usePreviewResource';
import PreviewState from './PreviewState';
import styles from './styles.module.css';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes.code || []), ['className', /^language-./, 'math-inline', 'math-display']],
  },
};

// Transform Obsidian links only in text nodes; code and mathematical notation
// must remain byte-for-byte intact.
function remarkWikiLinks() {
  return (tree) => {
    function visit(node) {
      if (!node.children || ['link', 'image', 'code', 'inlineCode', 'html'].includes(node.type)) return;
      node.children = node.children.flatMap((child) => {
        if (child.type !== 'text') {
          visit(child);
          return [child];
        }
        const parts = [];
        const pattern = /(!?)\[\[([^\]\n]+)\]\]/g;
        let offset = 0;
        let match;
        while ((match = pattern.exec(child.value))) {
          if (match.index > offset) parts.push({type: 'text', value: child.value.slice(offset, match.index)});
          const [rawTarget, ...aliasParts] = match[2].split('|');
          const target = rawTarget.trim();
          const alias = aliasParts.join('|').trim();
          const hash = target.indexOf('#');
          const pathname = hash === -1 ? target : target.slice(0, hash);
          const fragment = hash === -1 ? '' : target.slice(hash);
          const isImage = match[1] === '!';
          const needsExtension = !isImage && pathname && !/\.[^/]+$/.test(pathname) && !/^[a-z]+:/i.test(pathname);
          const url = `${pathname}${needsExtension ? '.md' : ''}${fragment}`;
          parts.push(isImage
            ? {type: 'image', url, alt: alias && !/^\d+(x\d+)?$/.test(alias) ? alias : pathname}
            : {type: 'link', url, children: [{type: 'text', value: alias || target}]});
          offset = pattern.lastIndex;
        }
        if (!parts.length) return [child];
        if (offset < child.value.length) parts.push({type: 'text', value: child.value.slice(offset)});
        return parts;
      });
    }
    visit(tree);
  };
}

function scrollToFragment(article, fragment) {
  if (!article || !fragment) return;
  let id = fragment.replace(/^#/, '');
  try {id = decodeURIComponent(id);} catch { /* Keep malformed source anchors readable. */ }
  const candidates = [id, `material-${id}`, `user-content-${id}`];
  const target = [...article.querySelectorAll('[id]')].find((element) => candidates.includes(element.id));
  if (target) {
    target.scrollIntoView({block: 'start'});
    target.setAttribute('tabindex', '-1');
    target.focus({preventScroll: true});
  }
}

function MarkdownImage({src, alt, title, width, height, resolveLink}) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveLink(src || '');
  if (failed || !src || !resolved.url) {
    return <span className={styles.missingImage}>图片未随资料提供或暂时无法载入{alt ? `：${alt}` : ''}</span>;
  }
  return <img src={resolved.url} alt={alt || ''} title={title} width={width} height={height} loading="lazy" onError={() => setFailed(true)} />;
}

export default function MarkdownPreview({url, resolveLink, onNavigate, fragment}) {
  const {status, data, retry} = usePreviewResource(url, readText);
  const articleRef = useRef(null);
  const components = useMemo(() => ({
    a({href, children, title}) {
      if (!href) return <span>{children}</span>;
      const resolved = resolveLink(href);
      if (!resolved.url) return <span>{children}</span>;
      return (
        <a
          href={resolved.url}
          title={title}
          target={resolved.external ? '_blank' : undefined}
          rel={resolved.external ? 'noopener noreferrer' : undefined}
          onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (href.startsWith('#')) {
              event.preventDefault();
              scrollToFragment(articleRef.current, href);
            } else if (resolved.path !== undefined) {
              event.preventDefault();
              onNavigate(resolved.path, resolved.fragment);
            }
          }}
        >{children}</a>
      );
    },
    img(props) {
      return <MarkdownImage key={props.src} {...props} resolveLink={resolveLink} />;
    },
    pre({children}) {
      const code = isValidElement(children) ? children.props : null;
      if (!code) return <pre>{children}</pre>;
      const language = /language-([^\s]+)/.exec(code.className || '')?.[1] || 'text';
      return <CodeBlock language={language}>{String(code.children || '').replace(/\n$/, '')}</CodeBlock>;
    },
  }), [resolveLink, onNavigate]);

  useEffect(() => {
    if (status === 'ready' && fragment) scrollToFragment(articleRef.current, fragment);
  }, [status, url, fragment]);

  if (status !== 'ready') return <PreviewState status={status} retry={retry} url={url} />;

  return (
    <article ref={articleRef} className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkWikiLinks]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          [rehypeSlug, {prefix: 'material-'}],
          [rehypeKatex, {throwOnError: false, strict: false, trust: false}],
        ]}
        components={components}
      >{data}</ReactMarkdown>
    </article>
  );
}
