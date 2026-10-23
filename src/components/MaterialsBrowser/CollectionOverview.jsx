import React, {useEffect, useRef} from 'react';
import MaterialIcon, {getMaterialIcon} from './MaterialIcon';
import {formatBytes} from '@site/src/lib/materials';
import CollectionAvatar from './CollectionAvatar';
import WechatContact from './WechatContact';
import styles from './styles.module.css';

function CollectionTopics({collection, onNavigate}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    const handleWheel = (event) => {
      // Preserve zoom and native horizontal trackpad gestures.
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll <= 0) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientWidth : 1;
      const nextScroll = Math.max(0, Math.min(maxScroll, scroller.scrollLeft + event.deltaY * unit));
      // At either edge, let the wheel continue scrolling the page.
      if (Math.abs(nextScroll - scroller.scrollLeft) < 1) return;
      event.preventDefault();
      scroller.scrollLeft = nextScroll;
    };
    scroller.addEventListener('wheel', handleWheel, {passive: false});
    return () => scroller.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className={styles.topicLinks} ref={scrollRef} role="region" aria-label={`${collection.name}的顶层资料`} tabIndex={0}>
      {collection.children.map((entry) => <button key={entry.path} type="button" onClick={() => onNavigate(entry.path)}><MaterialIcon name={getMaterialIcon(entry)} /><span className={styles.topicName}>{entry.name}</span><span className={styles.topicCount}>{entry.type === 'directory' ? `${entry.fileCount} 份` : formatBytes(entry.size)}</span></button>)}
    </div>
  );
}

export default function CollectionOverview({materials, onNavigate}) {
  return (
    <div className={styles.overview}>
      <div className={styles.collectionGrid}>
        {materials.collections.map((collection) => {
          return (
            <article className={styles.collectionCard} key={collection.path}>
              <div className={styles.collectionCardTop}>
                <CollectionAvatar collection={collection} className={styles.collectionAvatar} />
                <div><h2><button type="button" onClick={() => onNavigate(collection.path)}>{collection.name}</button></h2><span className={styles.muted}>{collection.fileCount} 份文件 · {formatBytes(collection.totalSize)}</span></div>
              </div>
              <CollectionTopics collection={collection} onNavigate={onNavigate} />
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
