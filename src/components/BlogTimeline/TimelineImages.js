import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {resolveTimelineImagePath} from './imagePath';
import styles from './styles.module.css';

export default function TimelineImages({images = []}) {
  const {withBaseUrl} = useBaseUrlUtils();
  if (!images.length) return null;

  return (
    <div className={styles.images}>
      {images.map((image, index) => {
        const {src, alt = `事件配图 ${index + 1}`} = typeof image === 'string' ? {src: image} : image;
        const url = withBaseUrl(resolveTimelineImagePath(src));
        return (
          <a key={`${src}-${index}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`查看原图：${alt}`}>
            <img src={url} alt={alt} loading="lazy" decoding="async" />
          </a>
        );
      })}
    </div>
  );
}
