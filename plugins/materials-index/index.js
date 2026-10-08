const path = require('node:path');
const {buildMaterialsIndex} = require('./scan');
const {readRepoMetadata} = require('./metadata');

module.exports = function materialsIndexPlugin(context, options = {}) {
  const materialsRoot = path.join(context.siteDir, 'static', 'file', '资料分享');
  const collectionNames = new Map(Object.entries(options.collectionNames || {}));
  let generatedIndex;

  return {
    name: 'materials-index',

    getPathsToWatch() {
      // Docusaurus uses chokidar: a directory path is watched recursively,
      // including files and directories added or removed after startup.
      return [materialsRoot];
    },

    async loadContent() {
      const [content, metadata] = await Promise.all([
        buildMaterialsIndex(materialsRoot),
        readRepoMetadata(materialsRoot),
      ]);
      return {
        ...content,
        collections: content.collections.map((collection) => {
          const repo = metadata.get(collection.path);
          return {
            ...collection,
            name: repo?.name || collectionNames.get(collection.path) || collection.name,
            avatar: repo?.avatar || '',
            wechat: repo?.wechat || '',
          };
        }),
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
