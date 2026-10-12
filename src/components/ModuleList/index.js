import React from 'react';
import Link from '@docusaurus/Link';
import {useDoc, useDocsSidebar, useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import {createModuleSections} from './sidebar.mjs';
import styles from './styles.module.css';

function ModuleCard({ title, description, link }) {
  return (
    <Link to={link} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.footer}>
        <span className={styles.arrow}>立即阅读 →</span>
      </div>
    </Link>
  );
}

function CategorySection({ title, link, items }) {
  return (
    <div className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h2 className={styles.categoryTitle}>{link ? <Link to={link}>{title}</Link> : title}</h2>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <ModuleCard key={item.link} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function ModuleList() {
  const sidebar = useDocsSidebar();
  const {docs} = useDocsVersion();
  const {metadata} = useDoc();
  const {categories, standaloneItems} = createModuleSections(sidebar?.items || [], docs, metadata.id);

  return (
    <div className={styles.modules}>
      {categories.map((category) => (
        <CategorySection key={category.link || category.items[0].link} {...category} />
      ))}

      {standaloneItems.length > 0 && (
        <CategorySection title="其他资源" items={standaloneItems} />
      )}
    </div>
  );
}
