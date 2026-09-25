import React from 'react';
import MaterialIcon, {getMaterialIcon} from './MaterialIcon';
import {formatBytes} from '@site/src/lib/materials';
import CollectionAvatar from './CollectionAvatar';
import WechatContact from './WechatContact';
import styles from './styles.module.css';

export default function CollectionOverview({materials, onNavigate}) {
  return (
    <div className={styles.overview}>
      <div className={styles.collectionGrid}>
        {materials.collections.map((collection) => {
          const entries = collection.children;
          return (
            <article className={styles.collectionCard} key={collection.path}>
              <div className={styles.collectionCardTop}>
                <CollectionAvatar collection={collection} className={styles.collectionAvatar} />
                <div><h2><button type="button" onClick={() => onNavigate(collection.path)}>{collection.name}</button></h2><span className={styles.muted}>{collection.fileCount} 份文件 · {formatBytes(collection.totalSize)}</span></div>
              </div>
              <div className={styles.topicLinks}>
                {entries.slice(0, 6).map((entry) => <button key={entry.path} type="button" onClick={() => onNavigate(entry.path)}><MaterialIcon name={getMaterialIcon(entry)} /><span className={styles.topicName}>{entry.name}</span><span className={styles.topicCount}>{entry.type === 'directory' ? `${entry.fileCount} 份` : formatBytes(entry.size)}</span></button>)}
                {entries.length > 6 && <button className={styles.moreEntries} type="button" onClick={() => onNavigate(collection.path)}>另有 {entries.length - 6} 项</button>}
              </div>
              <div className={styles.collectionActions}>
                <WechatContact wechat={collection.wechat} compact />
                <button className={styles.openCollection} type="button" aria-label={`浏览${collection.name}的全部资料`} onClick={() => onNavigate(collection.path)}>浏览资料<MaterialIcon name="chevron" /></button>
              </div>
            </article>
          );
        })}
      </div>
      {!materials.collections.length && <div className={styles.emptyState}><MaterialIcon name="library" /><h2>还没有分享的资料</h2><p>同学分享的笔记与课件会出现在这里。</p></div>}
    </div>
  );
}
