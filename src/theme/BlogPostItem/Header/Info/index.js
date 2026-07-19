import React, {useEffect} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {usePluralForm} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {useLocation} from '@docusaurus/router';

import styles from './styles.module.css';

const initialPathname = typeof window === 'undefined' ? '' : window.location.pathname;
let hasMountedPageViews = false;

function useReadingTimePlural() {
  const {selectMessage} = usePluralForm();
  return (readingTimeFloat) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          message: 'One min read|{readingTime} min read',
        },
        {readingTime},
      ),
    );
  };
}

function ReadingTime({readingTime}) {
  const readingTimePlural = useReadingTimePlural();
  return <>{readingTimePlural(readingTime)}</>;
}

function PageViews() {
  const {pathname} = useLocation();

  useEffect(() => {
    const isInitialArticleLoad = !hasMountedPageViews && pathname === initialPathname;
    hasMountedPageViews = true;

    // The global script handles a hard-loaded article. Docusaurus client-side
    // navigation needs an explicit refresh because the script is not rerun.
    if (isInitialArticleLoad) return undefined;

    const valueElement = document.getElementById('busuanzi_value_page_pv');
    if (valueElement) valueElement.textContent = '统计中';

    let attempts = 0;
    const refresh = () => {
      attempts += 1;
      if (window.bszCaller?.fetch && window.bszTag) {
        window.bszCaller.fetch(
          '//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback',
          (data) => {
            window.bszTag.texts(data);
            window.bszTag.shows();
          },
        );
        return;
      }

      if (attempts < 25) window.setTimeout(refresh, 200);
    };

    refresh();
    return undefined;
  }, [pathname]);

  return (
    <span id="busuanzi_container_page_pv" className={styles.pageViews}>
      <span id="busuanzi_value_page_pv">统计中</span>
      {' views'}
    </span>
  );
}

function Spacer() {
  return <span className={styles.spacer}>·</span>;
}

export default function BlogPostItemHeaderInfo({className}) {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {date, readingTime} = metadata;
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <div className={clsx(styles.container, 'margin-vert--md', className)}>
      <time dateTime={date}>{dateTimeFormat.format(new Date(date))}</time>
      {typeof readingTime !== 'undefined' && (
        <>
          <Spacer />
          <ReadingTime readingTime={readingTime} />
        </>
      )}
      {isBlogPostPage && (
        <>
          <Spacer />
          <PageViews />
        </>
      )}
    </div>
  );
}
