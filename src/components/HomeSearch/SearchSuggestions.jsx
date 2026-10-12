import React from 'react';
import styles from './styles.module.css';

const suggestions = [
  {label: '北航校历', path: 'M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 9h2m4 0h2m-8 3h2'},
  {label: '保研经验', path: 'm2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v7'},
  {label: '计算机硬件基础', path: 'M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 4h6v6H9V9ZM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3'},
  {label: '综测方案', path: 'M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3M9 2h6v5H9V2Zm-1 12 3 3 5-6'},
];

export default function SearchSuggestions({query, onSearch}) {
  return (
    <div className={styles.suggestions} aria-label="推荐检索词">
      <span className={styles.suggestionLabel}>试试</span>
      <div className={styles.suggestionItems}>
        {suggestions.map(({label, path}) => (
          <button type="button" key={label} onClick={() => onSearch(label)} data-active={query === label || undefined}>
            <svg className={styles.suggestionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
