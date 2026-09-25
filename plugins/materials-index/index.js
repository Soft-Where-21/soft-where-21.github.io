const path = require('node:path');
const {buildMaterialsIndex} = require('./scan');

module.exports = function materialsIndexPlugin(context, options = {}) {
  const materialsRoot = path.join(context.siteDir, 'static', 'file', '资料分享');
  let generatedIndex;

  return {
    name: 'materials-index',

    getPathsToWatch() {
      // Docusaurus uses chokidar: a directory path is watched recursively,
      // including files and directories added or removed after startup.
      return [materialsRoot];
    },

    async loadContent() {
      const content = await buildMaterialsIndex(materialsRoot);
      return {
        ...content,
        collections: content.collections.map((collection) => ({
          ...collection,
          name: options.collectionNames?.[collection.path] || collection.name,
        })),
      };
    },

    async contentLoaded({content, actions}) {
      generatedIndex = await actions.createData('index.json', content);
    },

    configureWebpack() {
      return {resolve: {alias: {'@materials-index': generatedIndex}}};
    },
  };
};
