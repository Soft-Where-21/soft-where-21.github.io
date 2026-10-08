import React from 'react';

export default function MaterialIcon({name = 'file', className = ''}) {
  const paths = {
    folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3z" />,
    'folder-open': <><path d="M3 10V5h7l2 2h7v3" /><path d="M3 10h19l-3 9H3z" /></>,
    file: <><path d="M14 3H5v18h14V8z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>,
    pdf: <><path d="M14 3H5v18h14V8z" /><path d="M14 3v5h5M8 15h8M10 12v6" /></>,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 6-6 4 4 3-3 5 5" /></>,
    sheet: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    message: <><path d="M21 11a8 8 0 0 1-8 8H8l-5 3V7a4 4 0 0 1 4-4h6a8 8 0 0 1 8 8Z" /><path d="M7 9h9M7 13h6" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" /></>,
    external: <><path d="M14 3h7v7m0-7-11 11M10 3H3v18h18v-7" /></>,
    library: <><rect x="3" y="4" width="4" height="16" rx="1" /><rect x="9" y="4" width="4" height="16" rx="1" /><path d="m16 5 4-1 3 15-4 1z" /></>,
    tree: <><path d="M4 4v14h5M4 8h5M14 4h7v7h-7zM14 15h7v6h-7z" /></>,
    collapse: <><path d="m5 9 7-6 7 6M5 15l7 6 7-6M5 12h14" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.file}</svg>;
}

export function getMaterialIcon(node) {
  if (node.type === 'directory') return 'folder';
  if (node.extension === '.pdf') return 'pdf';
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(node.extension)) return 'image';
  if (['.xlsx', '.xls', '.csv'].includes(node.extension)) return 'sheet';
  if (['.c', '.h', '.cpp', '.js', '.py', '.java', '.json', '.css', '.sh'].includes(node.extension)) return 'code';
  return 'file';
}
