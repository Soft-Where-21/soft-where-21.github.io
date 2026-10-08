import React from 'react';
import styles from './styles.module.css';

export default function PreviewState({status = 'loading', retry, url, children}) {
  const loading = status === 'loading';
  return (
    <div className={styles.state} role={loading ? 'status' : undefined}>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      )}
      <p>{children || (loading ? '正在载入预览…' : '暂时无法预览这个文件')}</p>
      {!loading && (
        <div className={styles.stateActions}>
          {retry && <button type="button" onClick={retry}>重试</button>}
          {url && <a href={url} download>下载原文件</a>}
        </div>
      )}
    </div>
  );
}
