import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import friendLinksData from '../data/friend-links.json';
import styles from './blogs.module.css';

function getHost(url) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, '') : '';
  } catch (_) {
    return '';
  }
}

export default function BlogsPage() {
  const blogs = Array.isArray(friendLinksData?.blogs) ? friendLinksData.blogs : [];
  const title = friendLinksData?.title ?? '优质博客';
  const subtitle = friendLinksData?.subtitle ?? '';

  return (
    <Layout
      title={title}
      description={subtitle}>
      <main className={styles.root}>
        <div className={styles.container}>
          <header className={styles.header}>
            <Heading as="h1" className={styles.title}>
              {title}
            </Heading>
            {subtitle && (
              <p className={styles.subtitle}>{subtitle}</p>
            )}
          </header>
          <div className={styles.grid}>
            {blogs.map((blog, i) => {
              const host = getHost(blog.url);
              const tagline = blog.tagline || (host ? `点击访问 · ${host}` : '点击访问');
              const avatarSrc = blog.avatar || null;
              const thumbnailSrc = blog.thumbnail || null;
              const nickname = blog.nickname || host || '博客';
              const initial = nickname.charAt(0);
              const linkHref = (blog.url && String(blog.url).trim()) ? blog.url : '#';
              return (
                <a
                  key={`${blog.nickname}-${blog.url}-${i}`}
                  href={linkHref}
                  target={linkHref.startsWith('#') ? undefined : '_blank'}
                  rel={linkHref.startsWith('#') ? undefined : 'noopener noreferrer'}
                  className={styles.card}
                >
                  <div className={styles.thumbnail}>
                    {thumbnailSrc ? (
                      <>
                        <img
                          src={thumbnailSrc}
                          alt=""
                          className={styles.thumbnailImg}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className={styles.thumbnailPlaceholder} style={{ display: 'none' }} aria-hidden>
                          <span className={styles.thumbnailIcon}>博客</span>
                        </div>
                      </>
                    ) : (
                      <div className={styles.thumbnailPlaceholder}>
                        <span className={styles.thumbnailIcon}>博客</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.avatarRow}>
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt=""
                          className={styles.avatar}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={styles.avatarFallback}
                        style={{ display: avatarSrc ? 'none' : 'flex' }}
                        aria-hidden>
                        {initial}
                      </div>
                      <div className={styles.cardText}>
                        <span className={styles.cardTitle}>{nickname}</span>
                        <span className={styles.cardTagline}>{tagline}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}
