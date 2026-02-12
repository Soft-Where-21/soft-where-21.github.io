import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import modules from '../../data/modules.json';

function ModuleCard({ title, description, link }) {
  return (
    <Link to={link} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <span className={styles.arrow}>立即阅读 →</span>
      </div>
    </Link>
  );
}

function CategorySection({ title, items }) {
  return (
    <div className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h2 className={styles.categoryTitle}>{title}</h2>
      </div>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <ModuleCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function ModuleList() {
  const standaloneItems = modules.filter(m => !m.isCategory);
  const categoryItems = modules.filter(m => m.isCategory);

  return (
    <div className={styles.modules}>
      {/* First show categories and their sub-items */}
      {categoryItems.map((cat, idx) => (
        <CategorySection key={idx} title={cat.title} items={cat.items} />
      ))}

      {/* Then show standalone top-level items */}
      {standaloneItems.length > 0 && (
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>其他资源</h2>
          </div>
          <div className={styles.grid}>
            {standaloneItems.map((item, idx) => (
              <ModuleCard key={idx} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
