import {useEffect, useState} from 'react';

export const readText = (response) => response.text();

/** Fetch only the selected file, and never let an older request replace it. */
export default function usePreviewResource(url, readResponse) {
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState(null);
  const requestKey = `${url}\n${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setResource({key: requestKey, status: 'loading'});

    async function load() {
      try {
        const response = await fetch(url, {signal: controller.signal});
        if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
          throw new Error('文件暂时无法读取');
        }
        const data = await readResponse(response);
        if (active) setResource({key: requestKey, status: 'ready', data});
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setResource({key: requestKey, status: 'error'});
        }
      }
    }

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [url, requestKey, readResponse]);

  return {
    ...(resource?.key === requestKey ? resource : {status: 'loading'}),
    retry: () => setAttempt((value) => value + 1),
  };
}
