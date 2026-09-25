import React, {useEffect, useMemo, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {buildFileUrl, formatBytes, getAncestors, indexMaterials, resolveMaterialLink, searchMaterials} from '@site/src/lib/materials';
import MaterialIcon, {getMaterialIcon} from './MaterialIcon';
import FileTree from './FileTree';
import SearchBox from './SearchBox';
import FilePreview from './FilePreview';
import DirectoryView from './DirectoryView';
import CollectionOverview from './CollectionOverview';
import styles from './styles.module.css';

function getLocationSelection() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return {path: params.has('path') ? params.get('path') : null, fragment: params.get('heading') || ''};
}

export default function MaterialsBrowser({materials}) {
  const baseUrl = useBaseUrl('/');
  const {nodesByPath, files, collectionByPath} = useMemo(() => indexMaterials(materials.collections), [materials]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedFragment, setSelectedFragment] = useState('');
  const [expanded, setExpanded] = useState(new Set());
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);
  const treeRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const isCatalog = selectedPath === null;
  const selection = selectedPath === null ? null : nodesByPath.get(selectedPath);
  const collection = selection ? collectionByPath.get(selectedPath) : null;
  const results = useMemo(() => searchMaterials(files, query), [files, query]);
  const searching = Boolean(query.trim());
  const breadcrumbs = selection ? [...getAncestors(selection.path), selection.path].filter((path) => nodesByPath.has(path)) : [];

  useEffect(() => {
    const sync = () => {
      const {path, fragment} = getLocationSelection();
      setSelectedPath(path);
      setSelectedFragment(fragment);
      setQuery('');
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync);};
  }, []);

  useEffect(() => {
    if (selection) {
      setExpanded((previous) => new Set([...previous, ...getAncestors(selection.path), ...(selection.type === 'directory' ? [selection.path] : [])]));
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selection]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [query]);

  useEffect(() => {
    let frame;
    const revealSelection = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const active = treeRef.current?.querySelector('[aria-current="page"]');
        if (active?.getClientRects().length) active.scrollIntoView({block: 'nearest'});
      });
    };
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    revealSelection();
    mobileQuery.addEventListener('change', revealSelection);
    return () => {
      window.cancelAnimationFrame(frame);
      mobileQuery.removeEventListener('change', revealSelection);
    };
  }, [selection, sidebarOpen]);

  function navigate(path, fragment = '') {
    const hash = path === null ? '' : `#${new URLSearchParams({path, ...(fragment ? {heading: fragment} : {})}).toString()}`;
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    if (window.location.hash !== hash) window.history.pushState(null, '', url);
    setSelectedPath(path);
    setSelectedFragment(fragment);
    setQuery('');
    setSidebarOpen(false);
    window.requestAnimationFrame(() => contentRef.current?.focus({preventScroll: true}));
  }

  function toggle(path) {
    setExpanded((previous) => {const next = new Set(previous); if (next.has(path)) next.delete(path); else next.add(path); return next;});
  }

  function clearSearch() {
    setQuery('');
    const input = mobileSearchRef.current?.getClientRects().length ? mobileSearchRef.current : searchRef.current;
    input?.focus();
  }

  return (
    <main className={styles.browser}>
      {!isCatalog && <h1 className={styles.srOnly}>资料分享</h1>}
      {!isCatalog && <header className={styles.mobileHeader}>
        <button className={styles.mobileTreeButton} type="button" aria-expanded={sidebarOpen} aria-controls="materials-sidebar" onClick={() => setSidebarOpen((open) => !open)}><MaterialIcon name="tree" />目录</button>
        <SearchBox query={query} onChange={setQuery} inputRef={mobileSearchRef} />
      </header>}

      <div className={styles.workspace}>
        {!isCatalog && <aside id="materials-sidebar" className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`} aria-label="资料集与文件目录">
          <div className={styles.sidebarHeading}>
            <div className={styles.pageIdentity}><MaterialIcon name="library" /><strong>资料分享</strong><span>{materials.totalFiles} 份文件</span></div>
            <SearchBox query={query} onChange={setQuery} inputRef={searchRef} />
          </div>
          <div className={styles.collectionSection}>
            <div className={styles.sectionLabel}>资料集<span>{materials.collections.length}</span></div>
            <button type="button" className={`${styles.collectionLink} ${selectedPath === null ? styles.collectionLinkActive : ''}`} onClick={() => navigate(null)} aria-current={selectedPath === null ? 'page' : undefined}><MaterialIcon name="library" /><span>全部资料</span></button>
            <div className={styles.collectionList}>
              {materials.collections.map((item) => <button type="button" className={`${styles.collectionLink} ${collection?.path === item.path ? styles.collectionLinkActive : ''}`} key={item.path} onClick={() => navigate(item.path)} aria-current={collection?.path === item.path ? 'true' : undefined}><span className={styles.smallAvatar} aria-hidden="true">{item.name.slice(0, 1)}</span><span>{item.name}</span><span className={styles.collectionFileCount}>{item.fileCount}</span></button>)}
            </div>
          </div>
          {collection && <div className={styles.treeSection}>
            <div className={styles.treeHeader}><span className={styles.sectionLabel}>文件目录</span><button className={styles.iconButton} type="button" aria-label="收起所有目录" title="收起所有目录" onClick={() => setExpanded(new Set())}><MaterialIcon name="collapse" /></button></div>
            <div className={styles.treeScroller} ref={treeRef}><FileTree nodes={collection.children} expanded={expanded} selectedPath={selectedPath} onToggle={toggle} onNavigate={navigate} /></div>
          </div>}
        </aside>}

        <section className={`${styles.content} ${isCatalog ? styles.catalogContent : ''}`} aria-label="资料浏览与预览">
          {isCatalog ? <header className={styles.catalogHeader}>
            <div className={styles.catalogIdentity}><MaterialIcon name="library" /><h1>全部资料</h1><span>{materials.collections.length} 个资料集 · {materials.totalFiles} 份文件</span></div>
            <div className={styles.catalogSearch}><SearchBox query={query} onChange={setQuery} inputRef={searchRef} /></div>
          </header> : <div className={styles.contentToolbar}>
            <nav className={styles.breadcrumbs} aria-label="资料路径"><button type="button" onClick={() => navigate(null)}>全部资料</button>{breadcrumbs.map((path, index) => <React.Fragment key={path}><span aria-hidden="true">/</span><button type="button" title={nodesByPath.get(path).name} aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined} onClick={() => navigate(path)}>{nodesByPath.get(path).name}</button></React.Fragment>)}</nav>
            {selection?.type === 'file' && !searching && <div className={styles.fileActions}><span className={styles.fileSize}>{formatBytes(selection.size)}</span><a href={buildFileUrl(selection.path, baseUrl)} target="_blank" rel="noopener noreferrer" title="打开原文件" aria-label="打开原文件"><MaterialIcon name="external" /></a><a className={styles.downloadButton} href={buildFileUrl(selection.path, baseUrl)} download={selection.name}><MaterialIcon name="download" /><span>下载</span></a></div>}
          </div>}
          <div className={styles.contentBody} ref={contentRef} tabIndex={-1} aria-label={searching ? '搜索结果' : selection ? `${selection.name}，${selection.type === 'directory' ? '文件目录' : '文件预览'}` : '资料集列表'}>
            {searching ? <div className={styles.searchResults}>
              <div className={styles.searchHeading}><h2>搜索结果</h2><p role="status">找到 {results.length} 份与“{query.trim()}”相关的资料</p></div>
              {results.map((file) => <button className={styles.searchResult} type="button" key={file.path} onClick={() => navigate(file.path)}><MaterialIcon name={getMaterialIcon(file)} /><span><strong>{file.name}</strong><small>{file.path.split('/').slice(0, -1).join(' / ')}</small></span><span className={styles.resultSize}>{formatBytes(file.size)}</span><MaterialIcon name="chevron" /></button>)}
              {!results.length && <div className={styles.emptyState}><MaterialIcon name="search" /><h3>没有找到匹配的文件</h3><p>试试课程名称、文件名，或分享同学的名字。</p><button type="button" onClick={clearSearch}>清空搜索</button></div>}
            </div> : selectedPath === null ? <CollectionOverview materials={materials} onNavigate={navigate} /> : !selection ? <div className={styles.emptyState}><MaterialIcon name="file" /><h2>未找到这份资料</h2><p>文件可能已移动，可以从资料集重新查找。</p><button type="button" onClick={() => navigate(null)}>返回全部资料</button></div> : selection.type === 'directory' ? <DirectoryView directory={selection} onNavigate={navigate} /> : <FilePreview key={selection.path} file={selection} url={buildFileUrl(selection.path, baseUrl)} fragment={selectedFragment} resolveLink={(href) => resolveMaterialLink(href, selection.path, nodesByPath, baseUrl)} onNavigate={navigate} />}
          </div>
        </section>
      </div>
    </main>
  );
}
