import React from 'react';
import MaterialIcon, {getMaterialIcon} from './MaterialIcon';
import {formatBytes} from '@site/src/lib/materials';
import styles from './styles.module.css';

export default function DirectoryView({directory, onNavigate}) {
  const folders = directory.children.filter((item) => item.type === 'directory').length;
  return (
    <div className={styles.directoryView}>
      <h2 className={styles.srOnly}>{directory.name}</h2>
      <div className={styles.directoryTable}>
        <div className={styles.tableHeading}><span>名称</span><span>{folders} 个文件夹 · 共 {directory.fileCount} 份文件</span></div>
        {directory.children.map((node) => (
          <button type="button" className={styles.directoryRow} key={node.path} onClick={() => onNavigate(node.path)}>
            <MaterialIcon name={getMaterialIcon(node)} className={node.type === 'directory' ? styles.folderIcon : styles.fileIcon} />
            <span className={styles.directoryName}>{node.name}</span>
            <span className={styles.directoryMeta}>{node.type === 'directory' ? `${node.fileCount} 份文件` : formatBytes(node.size)}</span>
            <MaterialIcon name="chevron" className={styles.rowArrow} />
          </button>
        ))}
        {!directory.children.length && <div className={styles.emptyState}><p>这个文件夹中还没有资料。</p></div>}
      </div>
    </div>
  );
}
