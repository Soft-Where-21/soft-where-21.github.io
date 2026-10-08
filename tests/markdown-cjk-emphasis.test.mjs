import assert from 'node:assert/strict';
import test from 'node:test';
import {evaluate} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import {renderToStaticMarkup} from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';

async function render(value, cjkFriendly = true) {
  const {default: Content} = await evaluate(value, {
    ...runtime,
    format: 'md',
    remarkPlugins: [remarkGfm, ...(cjkFriendly ? [remarkCjkFriendly] : [])],
  });
  return renderToStaticMarkup(runtime.jsx(Content, {}));
}

test('bold Chinese punctuation can directly precede Chinese text or a number', async () => {
  const source = '**内容。**紧跟中文\n\n**标签：**5 月 12 日';
  assert.equal(await render(source),
    '<p><strong>内容。</strong>紧跟中文</p>\n<p><strong>标签：</strong>5 月 12 日</p>');
  assert.equal(await render(source, false),
    '<p>**内容。**紧跟中文</p>\n<p>**标签：**5 月 12 日</p>');
});

test('bold spans retain nested inline code and links', async () => {
  const source = '**请运行 `solution.py` 并访问 [学院](https://example.com)。**继续阅读。';
  assert.equal(await render(source),
    '<p><strong>请运行 <code>solution.py</code> 并访问 <a href="https://example.com">学院</a>。</strong>继续阅读。</p>');
});

test('inline code, fenced code, and escaped asterisks stay literal', async () => {
  const source = [
    '`**内容。**紧跟中文`',
    '```text\n**内容。**紧跟中文\n```',
    String.raw`\*\*内容。\*\*紧跟中文`,
  ].join('\n\n');
  assert.equal(await render(source),
    '<p><code>**内容。**紧跟中文</code></p>\n' +
    '<pre><code class="language-text">**内容。**紧跟中文\n</code></pre>\n' +
    '<p>**内容。**紧跟中文</p>');
});

test('standard English emphasis, links, and GFM features keep their rendering', async () => {
  const source = [
    '**bold** and *italic* and ~~deleted~~ with [link](https://example.com).',
    '| name | value |\n| --- | --- |\n| example | **yes** |',
  ].join('\n\n');
  const html = await render(source);
  assert.equal(html, await render(source, false));
  assert.match(html, /<strong>bold<\/strong> and <em>italic<\/em> and <del>deleted<\/del>/);
  assert.match(html, /<a href="https:\/\/example.com">link<\/a>/);
  assert.match(html, /<table>/);
  assert.match(html, /<td><strong>yes<\/strong><\/td>/);
});
