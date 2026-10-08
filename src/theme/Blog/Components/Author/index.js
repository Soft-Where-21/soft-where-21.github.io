import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import BlogAuthor from '@theme-original/Blog/Components/Author';
import AuthorSocials from '@theme/Blog/Components/Author/Socials';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function MaybeLink({href, children, ...props}) {
  return href ? <Link href={href} {...props}>{children}</Link> : children;
}

export default function BlogAuthorWithStudentId({author, className, as, count, ...props}) {
  if (!author.student_id) {
    return <BlogAuthor {...props} author={author} className={className} as={as} count={count} />;
  }

  const {name, title, imageURL, url, email, page, student_id: studentId} = author;
  const link = page?.permalink || url || (email && `mailto:${email}`) || undefined;
  // Keep the existing authors.yml contact field as the single source of truth.
  const wechat = title?.match(/^微信[：:]\s*(.+)$/)?.[1];
  const hasSocials = Object.keys(author.socials ?? {}).length > 0;
  const authorName = as ? (
    <Heading as={as} className={styles.name} translate="no">{name}</Heading>
  ) : (
    <span className={styles.name} translate="no">{name}</span>
  );

  return (
    <div className={clsx(styles.author, as === 'h1' && styles.profile, as === 'h2' && styles.directory, className)}>
      {imageURL && (
        <MaybeLink href={link} className={styles.avatarLink}>
          <img className={styles.avatar} src={imageURL} alt={name || '作者头像'} />
        </MaybeLink>
      )}

      <div className={styles.info}>
        <div className={styles.nameRow}>
          {name && <MaybeLink href={link} className={styles.nameLink}>{authorName}</MaybeLink>}
          {count !== undefined && <span className={styles.count}>{count}</span>}
        </div>

        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt className={styles.label}>学号</dt>
            <dd className={styles.value} translate="no">{studentId}</dd>
          </div>
          {wechat && (
            <div className={styles.detail}>
              <dt className={styles.label}>微信</dt>
              <dd className={styles.value} translate="no">{wechat}</dd>
            </div>
          )}
        </dl>

        {title && !wechat && <p className={styles.title}>{title}</p>}
        {hasSocials && <AuthorSocials author={author} />}
      </div>
    </div>
  );
}
