import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import SearchSuggestions from './SearchSuggestions';
import useResourceSearch from './useResourceSearch';
import styles from './styles.module.css';

export default function HomeSearch() {
  const location = useLocation();
  const history = useHistory();
  const isBrowser = useIsBrowser();
  // Static HTML is shared by every ?q= URL. Read the query after hydration so
  // opening or refreshing a saved search matches the server's initial markup.
  const query = isBrowser ? (new URLSearchParams(location.search).get('q') || '').trim().slice(0, 256) : '';
  const [draft, setDraft] = useState(query);
  useEffect(() => setDraft(query), [query]);
  const {status, results, retry} = useResourceSearch(query);
  function search(value) {
    const next = value.trim().slice(0, 256);
    setDraft(next);
    if (next === query) return;
    history.push({pathname: location.pathname, search: next ? `?${new URLSearchParams({q: next})}` : '', hash: ''});
  }
  return <div className={styles.search}>
    <SearchForm query={query} value={draft} onChange={setDraft} onSearch={search} />
    <SearchSuggestions query={query} onSearch={search} />
    <SearchResults query={query} status={status} results={results} onRetry={retry} />
  </div>;
}
