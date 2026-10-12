import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Layout from '@theme/Layout';
import HomeSearch from '@site/src/components/HomeSearch';
import styles from './index.module.css';

export default function Home() {
  const mascot = useBaseUrl('/img/爱心软院猫.png');
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const hasQuery = isBrowser && Boolean(new URLSearchParams(location.search).get('q')?.trim());
  return (
    <Layout title="软件学院资源库" description="搜索北航软件学院的课程资料、经验分享、校园信息和实用工具，直达相关页面与资源。" noFooter>
      <main className={`${styles.home} ${hasQuery ? styles.hasQuery : ''}`}>
        <header className={styles.intro}>
          <h1 className={styles.identity}><img src={mascot} alt="" width="128" height="128" /><span>Soft Where</span></h1>
        </header>
        <HomeSearch />
        <footer className={styles.footer}><span>北航软件学院学生会 · 共建与分享</span><Link to="/docs/contribute">贡献一份资源 <span aria-hidden="true">↗</span></Link></footer>
      </main>
    </Layout>
  );
}
