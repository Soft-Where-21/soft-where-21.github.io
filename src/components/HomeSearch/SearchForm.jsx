import React, {useRef} from 'react';
import styles from './styles.module.css';

export default function SearchForm({query, value, onChange, onSearch}) {
  const input = useRef(null);
  const composing = useRef(false);
  return (
    <form className={styles.form} role="search" aria-label="全站资源检索" onSubmit={(event) => {
      event.preventDefault();
      if (!composing.current) onSearch(value.trim());
    }}>
      <label className={styles.srOnly} htmlFor="resource-query">搜索软件学院的课程资料、经验分享和实用工具</label>
      <div className={styles.inputRow}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
        <input id="resource-query" ref={input} type="search" value={value} maxLength={256}
          placeholder="搜搜课程资料、保研经验、优质博客…" autoComplete="off" autoCapitalize="none" spellCheck={false}
          aria-controls="resource-results" enterKeyHint="search" onChange={(event) => onChange(event.target.value)}
          onCompositionStart={() => {composing.current = true;}} onCompositionEnd={() => {composing.current = false;}}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (composing.current || event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault();
          }} />
        {(value || query) && <button className={styles.clear} type="button" aria-label="清空搜索" onClick={() => {onSearch(''); input.current?.focus();}}>×</button>}
        <button className={styles.submit} type="submit" aria-label="查找资源" disabled={!value.trim()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </button>
      </div>
    </form>
  );
}
