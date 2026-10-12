import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createSearchEngine} from '../src/lib/search/engine.mjs';

const root = new URL('../', import.meta.url);
const json = async (path) => JSON.parse(await fs.readFile(new URL(path, root), 'utf8'));
const [catalog, topics, fixtures, discovery] = await Promise.all([
  json('build/search-index.json'), json('config/search/topics.json'), json('tests/search/fixtures/queries.json'),
  json('tests/search/fixtures/discovery-queries.json'),
]);
assert.equal(catalog.version, 1);
assert.ok(catalog.records.length > 0, 'The production search catalog must not be empty');
const engine = createSearchEngine(catalog.records, topics);
const failures = [];
const destination = (url) => url?.startsWith('http') ? new URL(url).href : url;

// These queries represent intended user outcomes, not implementation details.
for (const {query, expectedUrl} of fixtures) {
  const {results} = engine.search(query);
  if (destination(results[0]?.url) !== destination(expectedUrl)) {
    failures.push(`${query}: expected ${expectedUrl}, got ${results[0]?.url ?? '(no result)'}`);
  }
}

for (const {query, expectedAnyUrls, topK} of discovery) {
  const {results} = engine.search(query, {limit: topK});
  if (!results.some(({url}) => expectedAnyUrls.map(destination).includes(destination(url)))) {
    failures.push(`${query}: none of the expected destinations in the top ${topK}: ${results.map(({url}) => url).join(', ')}`);
  }
}

// Every indexed resource must be reachable, including duplicate filenames in collections.
for (const record of catalog.records) {
  const {results} = engine.search(record.title, {limit: Infinity});
  if (!results.some(({url}) => url === record.url)) failures.push(`Unsearchable title: ${record.title} -> ${record.url}`);
  if (record.url.startsWith('/materials#path=')) {
    const path = new URLSearchParams(record.url.split('#')[1]).get('path');
    const found = engine.search(path, {limit: Infinity});
    if (!found.results.some(({url}) => url === record.url)) failures.push(`Unsearchable material path: ${path}`);
  }
}

for (const query of ['', '完全不存在的火星资源xyz9842', '2099级综测方案', '火星 校园 地图']) {
  if (engine.search(query).total !== 0) failures.push(`Unrelated results for: ${query || '(empty)'}`);
}

if (failures.length) {
  process.stderr.write(`${failures.join('\n')}\n\n${failures.length} search verification failures.\n`);
  process.exitCode = 1;
} else {
  const counts = {};
  for (const {kind} of catalog.records) counts[kind] = (counts[kind] || 0) + 1;
  const bytes = Buffer.from(JSON.stringify(catalog));
  console.log(`Verified ${fixtures.length} ranked queries, ${discovery.length} discovery queries and discoverability of all ${catalog.records.length} resources.`);
  console.log(`Catalog: ${(bytes.length / 1024).toFixed(1)} KiB, gzip ${(gzipSync(bytes).length / 1024).toFixed(1)} KiB. ${JSON.stringify(counts)}`);
}
