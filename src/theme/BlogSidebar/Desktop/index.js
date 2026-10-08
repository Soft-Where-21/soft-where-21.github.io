import React, {memo} from 'react';
import clsx from 'clsx';
import {
  useVisibleBlogSidebarItems,
  BlogSidebarItemList,
} from '@docusaurus/plugin-content-blog/client';
import BlogSidebarContent from '@theme/BlogSidebar/Content';
import BlogTagsLink from '@site/src/components/BlogTagsLink';
import themeStyles from '@docusaurus/theme-classic/lib/theme/BlogSidebar/Desktop/styles.module.css';
import styles from './styles.module.css';

function ListComponent({items}) {
  return (
    <BlogSidebarItemList
      items={items}
      ulClassName={clsx(themeStyles.sidebarItemList, 'clean-list')}
      liClassName={themeStyles.sidebarItem}
      linkClassName={themeStyles.sidebarItemLink}
      linkActiveClassName={themeStyles.sidebarItemLinkActive}
    />
  );
}

function BlogSidebarDesktop({sidebar}) {
  const items = useVisibleBlogSidebarItems(sidebar.items);

  return (
    <aside className="col col--3">
      <nav className={clsx(themeStyles.sidebar, 'thin-scrollbar')} aria-label="博客文章导航">
        <div className={styles.header}>
          <div className={clsx(themeStyles.sidebarItemTitle, styles.title)}>{sidebar.title}</div>
          <BlogTagsLink compact />
        </div>
        <BlogSidebarContent
          items={items}
          ListComponent={ListComponent}
          yearGroupHeadingClassName={themeStyles.yearGroupHeading}
        />
      </nav>
    </aside>
  );
}

export default memo(BlogSidebarDesktop);
