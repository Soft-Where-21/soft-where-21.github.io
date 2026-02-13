import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.heroBackdrop} />
      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.heroText}>
          <span className={styles.heroEyebrow}>软件学院(21系)学生会官网</span>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>
            同学想要的，这里都会有！
          </p>
          <div className={styles.heroActions}>
            <Link className={clsx('button button--primary', styles.primaryButton)} to="/docs/intro">
              不来看一看嘛(づ′▽`)づ
            </Link>
          </div>
        </div>
        {/* <div className={styles.heroSide}>
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>6+</div>
              <div className={styles.statLabel}>功能版块</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100+</div>
              <div className={styles.statLabel}>条目持续更新</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>开放共享</div>
            </div>
          </div>
        </div> */}
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="软件学院学生会官网，聚合资源库、工具库与科研信息，助力学习与成长。">
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                软院学生会信息中枢
              </Heading>
              <p className={styles.sectionSubtitle}>
                资源库、工具库、开源仓库集成与文档中心完整集成，不再回首翻阅聊天记录和浏览器的日子∑(✘Д✘๑ )
              </p>
            </div>
            <HomepageFeatures />
          </div>
        </section>
        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                全面开放的平台⁽⁽٩(๑˃̶͈̀ ᗨ ˂̶͈́)۶⁾⁾
              </Heading>
              <p className={styles.sectionSubtitle}>
                鼓励开源、开放与共享。我们将零散的经验沉淀为可复用的知识！
              </p>
            </div>
            <div className={styles.ctaGrid}>
              <div className={styles.ctaCard}>
                <h3 className={styles.ctaTitle}>资源共建</h3>
                <p className={styles.ctaText}>
                  任何人都可以提交内容，完善文档资源、开源仓库。
                </p>
                <div className={styles.ctaButtons}>
                  <Link className={clsx('button button--primary', styles.primaryButton)} to="/docs/contribute">
                    查看贡献指南
                  </Link>
                </div>
              </div>
              <div className={styles.ctaCard}>
                <h3 className={styles.ctaTitle}>数据与服务</h3>
                <p className={styles.ctaText}>
                  开源仓库与实用工具持续更新，为学习和校园生活提供一条稳固的信息链。
                </p>
                <div className={styles.ctaButtons}>
                  <Link className={clsx('button button--secondary', styles.ghostButton)} to="/docs/intro">
                    了解更多
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
