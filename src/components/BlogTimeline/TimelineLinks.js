import React from 'react';
import styles from './styles.module.css';

export default function TimelineLinks({links, link}) {
  const items = links ?? (link ? [link] : []);
  if (!items.length) return null;

  return (
    <div className={styles.links}>
      {items.map((item, index) => (
        <a key={`${item.href}-${index}`} href={item.href}>
          {item.label}
        </a>
      ))}
    </div>
  );
}
