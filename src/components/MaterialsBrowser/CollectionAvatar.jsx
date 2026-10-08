import React, {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {buildFileUrl} from '@site/src/lib/materials';

export default function CollectionAvatar({collection, className}) {
  const baseUrl = useBaseUrl('/');
  const [failedUrl, setFailedUrl] = useState('');
  const url = collection.avatar ? buildFileUrl(collection.avatar, baseUrl) : '';

  return (
    <span className={className} aria-hidden="true">
      {url && failedUrl !== url
        ? <img src={url} alt="" loading="lazy" onError={() => setFailedUrl(url)} />
        : collection.name.slice(0, 1)}
    </span>
  );
}
