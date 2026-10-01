import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function BlogTagsLink({compact = false, label, className, onClick}) {
  return (
    <Link
      isNavLink
      to="/blog/tags"
      className={clsx(styles.link, compact && styles.compact, className)}
      activeClassName={styles.active}
      onClick={onClick}
      aria-label="浏览全部标签"
      title="浏览全部标签">
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false">
        <path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z" />
        <circle cx="7" cy="7" r="1" />
      </svg>
      <span>{label ?? (compact ? '全部标签' : '浏览全部标签')}</span>
    </Link>
  );
}
