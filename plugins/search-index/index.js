const fs = require('node:fs/promises');
const path = require('node:path');
const {loadResourceData, JSON_SOURCES} = require('./adapters/resources.cjs');
const {buildSearchIndex} = require('./build.cjs');
const {validateCatalog} = require('./validate.cjs');

module.exports = function searchIndexPlugin(context) {
  const {siteDir, siteConfig} = context;
  const configDir = path.join(siteDir, 'config', 'search');
  let generatedIndex;
  let built;
  return {
    name: 'search-index',
    getPathsToWatch() {
      return [configDir, path.join(siteDir, 'docs'), path.join(siteDir, 'blog'), path.join(siteDir, 'src', 'pages'), path.join(siteDir, 'static', 'file', '资料分享'), ...JSON_SOURCES.map((file) => path.join(siteDir, file))];
    },
    async loadContent() {
      const [data, overridesText] = await Promise.all([
        loadResourceData(siteDir),
        fs.readFile(path.join(configDir, 'overrides.json'), 'utf8'),
      ]);
      return {data, overrides: JSON.parse(overridesText)};
    },
    async allContentLoaded({allContent, actions}) {
      const content = allContent['search-index'].default;
      built = await buildSearchIndex({siteDir, allContent, ...content, siteUrl: siteConfig.url, baseUrl: siteConfig.baseUrl});
      generatedIndex = await actions.createData('index.json', built.catalog);
      await actions.createData('report.json', built.report);
    },
    configureWebpack() {
      return {resolve: {alias: {'@search-index': generatedIndex}}};
    },
    async postBuild({outDir, routesPaths}) {
      if (!built) throw new Error('Search catalog was not generated.');
      await validateCatalog({...built, outDir, routesPaths, baseUrl: siteConfig.baseUrl});
      await Promise.all([
        fs.writeFile(path.join(outDir, 'search-index.json'), `${JSON.stringify(built.catalog)}\n`),
        fs.writeFile(path.join(outDir, 'search-index-report.json'), `${JSON.stringify(built.report, null, 2)}\n`),
      ]);
      console.log(`[search-index] Validated ${built.report.total} searchable destinations.`);
    },
  };
};
