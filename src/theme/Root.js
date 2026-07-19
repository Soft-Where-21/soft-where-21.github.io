import React, {useEffect} from 'react';
import DeveloperDialog from '@site/src/components/DeveloperDialog';

let cachedSitePageViews = '';

function syncBusuanziSitePageViews() {
  const valueElement = document.getElementById('busuanzi_value_site_pv');
  const containerElement = document.getElementById('busuanzi_container_site_pv');
  if (!valueElement || !containerElement) return;

  const currentValue = valueElement.textContent?.trim() || '';
  if (currentValue) {
    cachedSitePageViews = currentValue;
    containerElement.style.display = 'inline-flex';
    return;
  }

  // Docusaurus replaces the footer during client-side navigation, while the
  // Busuanzi script only runs on the initial page load. Restore the value that
  // the script wrote into the previous footer instance.
  if (cachedSitePageViews) {
    valueElement.textContent = cachedSitePageViews;
    containerElement.style.display = 'inline-flex';
  }
}

export default function Root({children}) {
  useEffect(() => {
    syncBusuanziSitePageViews();

    const observer = new MutationObserver(syncBusuanziSitePageViews);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {children}
      <DeveloperDialog />
    </>
  );
}
