import React from 'react';
import MaterialIcon from './MaterialIcon';
import styles from './styles.module.css';

export default function SearchBox({query, onChange, inputRef}) {
  return (
    <div className={styles.searchBox}>
      <MaterialIcon name="search" />
      <input ref={inputRef} type="search" placeholder="搜索文件、同学或主题" aria-label="搜索全部资料" value={query} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => {if (event.key === 'Escape') onChange('');}} />
      {query && <button type="button" aria-label="清空搜索" onClick={() => {onChange(''); inputRef.current?.focus();}}><MaterialIcon name="close" /></button>}
    </div>
  );
}
