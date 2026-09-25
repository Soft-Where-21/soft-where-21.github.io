import React, {useEffect, useState} from 'react';
import MaterialIcon from './MaterialIcon';
import styles from './styles.module.css';

export default function WechatContact({wechat, compact = false}) {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {setFeedback('');}, [wechat]);
  useEffect(() => {
    if (!feedback) return undefined;
    const timeout = window.setTimeout(() => setFeedback(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  if (!wechat) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(wechat);
      setFeedback('已复制');
    } catch {
      setFeedback('请选中微信号复制');
    }
  }

  return (
    <div className={`${styles.wechatContact} ${compact ? styles.wechatBadge : ''}`}>
      {compact && <MaterialIcon name="message" />}
      <span className={styles.wechatText}>
        <span>微信</span>
        <span className={styles.wechatId}>{wechat}</span>
      </span>
      <button type="button" onClick={copy} title={feedback || '复制微信号'} aria-label={`复制微信号 ${wechat}`}>{compact ? <MaterialIcon name={feedback === '已复制' ? 'check' : 'copy'} /> : '复制'}</button>
      <span className={styles.copyFeedback} role="status">{feedback}</span>
    </div>
  );
}
