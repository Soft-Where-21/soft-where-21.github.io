import test from 'node:test';
import assert from 'node:assert/strict';
import {createModuleSections} from '../src/components/ModuleList/sidebar.mjs';

test('new nested documents appear in navigation with source metadata and sidebar order', () => {
  const sidebar = [{type: 'category', label: '课程', href: '/docs/courses', items: [
    {type: 'category', label: '计算机', items: [{type: 'link', docId: 'os', label: 'OS', href: '/docs/os'}]},
  ]}];
  const docs = {os: {title: '操作系统', description: '课程复习资料'}};
  const before = createModuleSections(sidebar, docs, 'intro');
  assert.deepEqual(before.categories[0], {
    title: '课程', link: '/docs/courses',
    items: [{title: '操作系统', description: '课程复习资料', link: '/docs/os'}],
  });
  sidebar[0].items[0].items.unshift({type: 'link', docId: 'network', label: '网络', href: '/docs/network'});
  docs.network = {title: '计算机网络', description: '新加入的课程'};
  assert.deepEqual(createModuleSections(sidebar, docs, 'intro').categories[0].items.map(({link}) => link), ['/docs/network', '/docs/os']);
});

test('navigation omits itself, unlisted documents, duplicate links and empty groups', () => {
  const sidebar = [
    {type: 'link', docId: 'intro', label: '资料介绍', href: '/docs/intro'},
    {type: 'category', label: '空分类', items: [{type: 'link', docId: 'hidden', href: '/docs/hidden', unlisted: true}]},
    {type: 'link', label: '校外资源', href: 'https://example.org/'},
    {type: 'link', label: '重复资源', href: 'https://example.org/'},
    {type: 'html', value: '<hr>'},
  ];
  assert.deepEqual(createModuleSections(sidebar, {}, 'intro'), {
    categories: [],
    standaloneItems: [{title: '校外资源', description: '', link: 'https://example.org/'}],
  });
});
