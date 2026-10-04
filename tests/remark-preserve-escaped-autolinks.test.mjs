import assert from 'node:assert/strict';
import test from 'node:test';
import {evaluate} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import {renderToStaticMarkup} from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import preserveEscapedAutolinks from '../plugins/remark-preserve-escaped-autolinks.cjs';

async function render(value, enabled = false) {
  const {default: Content} = await evaluate({
    value,
    data: {frontMatter: {preserve_escaped_autolinks: enabled}},
  }, {
    ...runtime,
    remarkPlugins: [preserveEscapedAutolinks, remarkGfm],
  });
  return renderToStaticMarkup(runtime.jsx(Content, {}));
}

test('opted-in escaped URLs preserve the surrounding prose without invalid links', async () => {
  const source = String.raw`学院（https://collegeai\.tsinghua\.edu\.cn/rydw\.htm\#sz2），时间6000\-7000。`;
  assert.equal(await render(source, true),
    '<p>学院（https://collegeai.tsinghua.edu.cn/rydw.htm#sz2），时间6000-7000。</p>');
});

test('other articles retain the default GFM behavior', async () => {
  const html = await render(String.raw`https://xhslink\.cn/o/example`);
  assert.match(html, /href="https:\/\/xhslink%5C\.cn/);
});

test('normal links, explicit escaped links, images, and formatting remain supported', async () => {
  const html = await render(String.raw`https://example.com

[官网](https://collegeai\.tsinghua\.edu\.cn/rydw\.htm\#sz2)

![图](/file/figure.png)

**重点**和~~删除线~~`, true);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /href="https:\/\/collegeai.tsinghua.edu.cn\/rydw.htm#sz2"/);
  assert.match(html, /<img src="\/file\/figure.png" alt="图"\/>/);
  assert.match(html, /<strong>重点<\/strong>和<del>删除线<\/del>/);
});
