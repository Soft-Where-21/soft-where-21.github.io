import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import usePreviewResource, {readText} from './usePreviewResource';
import PreviewState from './PreviewState';
import styles from './styles.module.css';

const languages = {
  '.c': 'c', '.h': 'c', '.cpp': 'cpp', '.cc': 'cpp', '.hpp': 'cpp',
  '.py': 'python', '.js': 'javascript', '.jsx': 'jsx', '.ts': 'typescript',
  '.tsx': 'tsx', '.java': 'java', '.json': 'json', '.css': 'css',
  '.sh': 'bash', '.sql': 'sql', '.xml': 'xml', '.yaml': 'yaml',
  '.yml': 'yaml', '.rs': 'rust', '.go': 'go', '.tex': 'latex',
};

export default function TextPreview({file, url}) {
  const {status, data, retry} = usePreviewResource(url, readText);
  if (status !== 'ready') return <PreviewState status={status} retry={retry} url={url} />;
  return (
    <div className={styles.source}>
      <CodeBlock language={languages[file.extension?.toLowerCase()] || 'text'} showLineNumbers>{data}</CodeBlock>
    </div>
  );
}
