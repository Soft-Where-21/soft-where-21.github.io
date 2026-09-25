import React from 'react';
import MaterialIcon, {getMaterialIcon} from './MaterialIcon';
import styles from './styles.module.css';

export default function FileTree({nodes, expanded, selectedPath, onToggle, onNavigate}) {
  return (
    <ul className={styles.treeList}>
      {nodes.map((node) => {
        const folder = node.type === 'directory';
        const open = folder && expanded.has(node.path);
        return (
          <li key={node.path}>
            <div className={`${styles.treeRow} ${selectedPath === node.path ? styles.treeRowActive : ''}`}>
              {folder ? (
                <button className={`${styles.treeToggle} ${open ? styles.treeToggleOpen : ''}`} aria-label={`${open ? '收起' : '展开'} ${node.name}`} aria-expanded={open} type="button" onClick={() => onToggle(node.path)}>
                  <MaterialIcon name="chevron" />
                </button>
              ) : <span className={styles.treeSpacer} />}
              <button type="button" className={styles.treeLink} onClick={() => onNavigate(node.path)} aria-current={selectedPath === node.path ? 'page' : undefined} title={node.path}>
                <MaterialIcon name={open ? 'folder-open' : getMaterialIcon(node)} className={folder ? styles.folderIcon : styles.fileIcon} />
                <span>{node.name}</span>
              </button>
            </div>
            {open && <FileTree nodes={node.children} expanded={expanded} selectedPath={selectedPath} onToggle={onToggle} onNavigate={onNavigate} />}
          </li>
        );
      })}
    </ul>
  );
}
