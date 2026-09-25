import React, {Component, Suspense, lazy, useState} from 'react';
import PreviewState from './PreviewState';
import styles from './styles.module.css';

const MarkdownPreview = lazy(() => import('./MarkdownPreview'));
const SpreadsheetPreview = lazy(() => import('./SpreadsheetPreview'));
const TextPreview = lazy(() => import('./TextPreview'));

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.avif', '.svg']);
const textExtensions = new Set(['.txt', '.c', '.h', '.cpp', '.hpp', '.cc', '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.json', '.yaml', '.yml', '.css', '.sh', '.sql', '.xml', '.csv', '.log', '.toml', '.ini', '.tex', '.rs', '.go']);

class PreviewBoundary extends Component {
  state = {failed: false};

  static getDerivedStateFromError() {
    return {failed: true};
  }

  render() {
    return this.state.failed
      ? <PreviewState status="error" url={this.props.url} />
      : this.props.children;
  }
}

function ImagePreview({file, url}) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (failed) {
    return <PreviewState status="error" url={url} retry={() => {setFailed(false); setAttempt((value) => value + 1);}}>图片暂时无法载入</PreviewState>;
  }
  return (
    <div className={styles.imageCanvas}>
      <img key={attempt} src={url} alt={file.name} className={styles.image} onError={() => setFailed(true)} />
    </div>
  );
}

export default function FilePreview({file, url, resolveLink, onNavigate, fragment}) {
  const extension = (file.extension || '').toLowerCase();
  let preview;

  if (extension === '.pdf') {
    preview = (
      <div className={styles.pdfCanvas}>
        <iframe className={styles.pdf} src={`${url}#view=FitH`} title={`${file.name} · PDF 预览`} />
        <p className={styles.pdfHint}>如果浏览器未显示 PDF，可<a href={url} target="_blank" rel="noopener noreferrer">在新窗口打开</a>。</p>
      </div>
    );
  } else if (imageExtensions.has(extension)) {
    preview = <ImagePreview key={url} file={file} url={url} />;
  } else if (extension === '.md' || extension === '.markdown') {
    preview = <MarkdownPreview url={url} resolveLink={resolveLink} onNavigate={onNavigate} fragment={fragment} />;
  } else if (extension === '.xlsx') {
    preview = <SpreadsheetPreview key={url} file={file} url={url} />;
  } else if (textExtensions.has(extension)) {
    preview = <TextPreview file={file} url={url} />;
  } else {
    preview = <PreviewState status="unsupported" url={url}>此格式可下载后查看</PreviewState>;
  }

  return (
    <div className={`${styles.preview} ${extension === '.pdf' ? styles.pdfPreview : ''}`}>
      <PreviewBoundary key={url} url={url}>
        <Suspense fallback={<PreviewState />}>{preview}</Suspense>
      </PreviewBoundary>
    </div>
  );
}
