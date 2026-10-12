import {useEffect, useState} from 'react';
import {loadSearchEngine} from '@site/src/lib/search/load';

export default function useResourceSearch(query) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({query: '', status: 'idle', results: []});
  useEffect(() => {
    if (!query) {
      setState({query, status: 'idle', results: []});
      return undefined;
    }
    let active = true;
    setState({query, status: 'loading', results: []});
    loadSearchEngine().then((engine) => {
      if (active) setState({query, status: 'ready', results: engine.search(query, {limit: Infinity}).results});
    }).catch(() => {
      if (active) setState({query, status: 'error', results: []});
    });
    return () => {active = false;};
  }, [query, attempt]);
  const current = state.query === query ? state : {status: query ? 'loading' : 'idle', results: []};
  return {...current, retry: () => setAttempt((value) => value + 1)};
}
