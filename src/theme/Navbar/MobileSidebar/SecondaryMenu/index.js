import React from 'react';
import useRouteContext from '@docusaurus/useRouteContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import OriginalSecondaryMenu from '@theme-original/Navbar/MobileSidebar/SecondaryMenu';
import BlogTagsLink from '@site/src/components/BlogTagsLink';
import styles from './styles.module.css';

function BlogSecondaryMenu() {
  const isPrimaryMenuEmpty = useThemeConfig().navbar.items.length === 0;
  const secondaryMenu = useNavbarSecondaryMenu();
  const mobileSidebar = useNavbarMobileSidebar();

  function closeSidebar(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) {
      return;
    }
    if (mobileSidebar.shown) mobileSidebar.toggle();
  }

  return (
    <>
      <div className={styles.toolbar}>
        {!isPrimaryMenuEmpty && (
          <button type="button" className={styles.backButton} onClick={secondaryMenu.hide}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="m12 5-7 7 7 7M5 12h14" />
            </svg>
            返回主菜单
          </button>
        )}
        <BlogTagsLink compact label="标签" className={styles.tagsLink} onClick={closeSidebar} />
      </div>
      {secondaryMenu.content}
    </>
  );
}

export default function NavbarMobileSidebarSecondaryMenu() {
  const routeContext = useRouteContext();
  return routeContext?.plugin?.name === 'docusaurus-plugin-content-blog'
    ? <BlogSecondaryMenu />
    : <OriginalSecondaryMenu />;
}
