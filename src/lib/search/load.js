import {createSearchEngine} from './engine.mjs';

let pending;

/** Fetch the catalog only when requested; failed loads remain retryable. */
export function loadSearchEngine() {
  if (!pending) {
    pending = Promise.all([
      import(/* webpackChunkName: "resource-search-index" */ '@search-index'),
      import('@site/config/search/topics.json'),
    ]).then(([catalog, topics]) => createSearchEngine(catalog.default.records, topics.default))
      .catch((error) => {pending = undefined; throw error;});
  }
  return pending;
}
