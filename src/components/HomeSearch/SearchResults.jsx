import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const kinds = {doc: '文档', category: '导航', blog: '经验', page: '页面', tool: '工具', repository: '仓库', external: '外链', share: '分享', file: '文件', collection: '资料集'};
const PAGE_SIZE = 8;

function readableUrl(url) {
  if (/^https?:/i.test(url)) return new URL(url).hostname + new URL(url).pathname.replace(/\/$/, '');
  if (url.startsWith('/materials#')) {
    const path = new URLSearchParams(url.split('#')[1]).get('path');
    return path ? `资料分享 / ${path.replaceAll('/', ' / ')}` : url;
  }
  try {return decodeURIComponent(url);} catch {return url;}
}

export default function SearchResults({query, status, results, onRetry}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const firstNew = useRef(null);
  const [focusMore, setFocusMore] = useState(false);
  useEffect(() => {setVisible(PAGE_SIZE); setFocusMore(false);}, [query]);
  useEffect(() => {
    if (focusMore) {firstNew.current?.focus(); setFocusMore(false);}
  }, [visible, focusMore]);
  if (status === 'idle') return <div id="resource-results" />;
  return (
    <section id="resource-results" className={styles.results} aria-label="检索结果" aria-busy={status === 'loading'}>
      {status === 'loading' && <p className={styles.status} role="status">正在查找相关资源…</p>}
      {status === 'error' && <div className={styles.empty} role="alert"><h2>资源目录暂时没能加载</h2><p>请检查网络后重试，也可以从上方栏目继续浏览。</p><button type="button" onClick={onRetry} className={styles.retry}>重新加载</button></div>}
      {status === 'ready' && <>
        <div className={styles.resultsHeading}><h2>与「{query}」相关的资源</h2><span role="status">{results.length} 条结果</span></div>
        {!results.length ? <div className={styles.empty}><h3>还没有找到匹配的资源</h3><p>试试更短的关键词，或换成课程名、同学姓名。<br />例如「计组」「保研经验」「学院路地图」。</p><Link to="/docs/intro">浏览资源导航 <span aria-hidden="true">→</span></Link></div> : <>
          <ol className={styles.resultList}>
            {results.slice(0, visible).map((record, index) => {
              const external = /^https?:/i.test(record.url);
              // Full navigation preserves existing tool/share hash selection on arrival.
              return <li key={record.url} className={styles.resultItem}>
                <a className={styles.resultLink} href={record.url} ref={index === visible - PAGE_SIZE ? firstNew : undefined}
                  {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
                  <div className={styles.resultMeta}><span className={styles.kind}>{kinds[record.kind] || '资源'}</span><span>{record.section}</span>{external && <span className={styles.external}>站外</span>}</div>
                  <div className={styles.resultTitle}><h3>{record.title}</h3><span className={styles.resultArrow} aria-hidden="true">{external ? '↗' : '→'}</span></div>
                  <p className={styles.description}>{record.description}</p>
                  <span className={styles.resultUrl}>{readableUrl(record.url)}</span>
                </a>
              </li>;
            })}
          </ol>
          {visible < results.length && <button type="button" className={styles.more} onClick={() => {setVisible((value) => value + PAGE_SIZE); setFocusMore(true);}}>查看更多 <span>还有 {results.length - visible} 条</span></button>}
        </>}
      </>}
    </section>
  );
}
