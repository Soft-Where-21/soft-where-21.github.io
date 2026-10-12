import test from 'node:test';
import assert from 'node:assert/strict';
import {createSearchEngine} from '../../src/lib/search/engine.mjs';

const records = [
  {url: '/docs/comprehensive-assessment', title: '综测方案', aliases: ['综测'], keywords: ['综合素质测评'], priority: 5},
  {url: '/docs/comprehensive-assessment/2023', title: '2023级综测方案', aliases: ['2023级综测'], keywords: ['综合素质测评'], priority: 3},
  {url: '/tool#comprehensive', title: '综测加分计算器', aliases: ['综测计算器'], keywords: ['综合素质测评', '计算'], priority: 4},
  {url: '/docs/campus-map/xueyuan-road', title: '学院路校区地图', aliases: ['学院路地图'], keywords: ['校园地图'], priority: 4},
  {url: '/docs/campus-map/shahe', title: '沙河校区地图', aliases: ['沙河地图'], keywords: ['校园地图'], priority: 4},
  {url: '/ai', title: '人工智能课程', aliases: [], keywords: ['人工智能']},
  {url: '/mail', title: 'mail 邮箱', aliases: [], keywords: []},
];
const engine = createSearchEngine(records, {groups: [{terms: ['综测', '综合素质测评']}, {terms: ['ai', '人工智能']}]});

test('prioritizes general categories, exact aliases, and specific tools', () => {
  for (const [query, expected] of [
    ['综测方案', '/docs/comprehensive-assessment'], ['综测', '/docs/comprehensive-assessment'],
    ['综测计算器', '/tool#comprehensive'], ['学院路地图', '/docs/campus-map/xueyuan-road'],
    ['学院路 地图', '/docs/campus-map/xueyuan-road'], ['请问学院路地图在哪里？', '/docs/campus-map/xueyuan-road'],
    ['我想知道学院路地图在哪', '/docs/campus-map/xueyuan-road'], ['给我找综测方案', '/docs/comprehensive-assessment'],
    ['学院路地图入口', '/docs/campus-map/xueyuan-road'], ['学院路地图网址', '/docs/campus-map/xueyuan-road'],
    ['２３级综测', '/docs/comprehensive-assessment/2023'],
  ]) assert.equal(engine.search(query).results[0]?.url, expected, query);
});

test('requires all concepts and respects explicit cohorts', () => {
  assert.equal(engine.search('综测 火星').total, 0);
  assert.equal(engine.search('2024级综测方案').total, 0);
  assert.equal(engine.search('沙河 学院路 地图').total, 0);
});

test('expands synonyms as alternatives; ASCII words do not match interiors', () => {
  assert.equal(engine.search('AI').results[0].url, '/ai');
  assert.equal(engine.search('AI').total, 1);
  assert.equal(engine.search('综合素质测评 方案').results[0].url, '/docs/comprehensive-assessment');
});

test('handles punctuation, empty input, pagination and duplicate destinations', () => {
  for (const query of ['', '   ', '？', '请问', '帮我找一下']) assert.equal(engine.search(query).total, 0, query);
  const duplicate = createSearchEngine([...records, records[0]]);
  const all = duplicate.search('综测', {limit: 100});
  assert.equal(new Set(all.results.map((record) => record.url)).size, all.total);
  assert.deepEqual(duplicate.search('综测', {offset: 1, limit: 1}).results, all.results.slice(1, 2));
});

test('filenames and symbols are searchable without executing regular expressions', () => {
  const files = createSearchEngine([{url: '/file', title: 'C++ 学习(第1章).pdf', keywords: ['张三/程序设计/C++ 学习(第1章).pdf']}]);
  assert.equal(files.search('C++ 学习(第1章).pdf').results[0].url, '/file');
  assert.equal(files.search('张三/程序设计/C++ 学习(第1章).pdf').results[0].url, '/file');
  assert.equal(files.search('.*').total, 0);
  const languages = createSearchEngine([
    {url: '/c', title: 'C 语言'}, {url: '/cpp', title: 'C++ 程序设计'}, {url: '/csharp', title: 'C# 程序设计'},
  ]);
  assert.deepEqual(languages.search('C++').results.map((r) => r.url), ['/cpp']);
  assert.deepEqual(languages.search('C#').results.map((r) => r.url), ['/csharp']);
});

test('a file can inherit its cohort from its directory', () => {
  const files = createSearchEngine([{url: '/file', title: '操作系统笔记.pdf', keywords: ['张三/2023级/操作系统笔记.pdf']}]);
  assert.equal(files.search('23级 操作系统').results[0]?.url, '/file');
  assert.equal(files.search('24级 操作系统').total, 0);
  const repo = createSearchEngine([{url: '/repo', title: 'BUAA_OS_resources', description: 'BUAA 23 级操作系统资料'}]);
  assert.equal(repo.search('23级操作系统资料').results[0]?.url, '/repo');
});

test('multiword English names retain word boundaries', () => {
  const programs = createSearchEngine([{url: '/vscode', title: 'Visual Studio Code'}]);
  assert.equal(programs.search('Visual Studio').results[0]?.url, '/vscode');
  assert.equal(programs.search('studio').results[0]?.url, '/vscode');
  assert.equal(programs.search('stud').total, 0);
});
