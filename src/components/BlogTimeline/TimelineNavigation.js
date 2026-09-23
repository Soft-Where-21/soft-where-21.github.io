import React from 'react';
import clsx from 'clsx';
import {useTimeline} from './context';
import styles from './styles.module.css';

export default function TimelineNavigation({mobile = false}) {
  const {timelines, activeTimeline, setActiveId, panelId} = useTimeline();

  return (
    <nav aria-label="时间线选择" className={clsx(styles.navigation, mobile ? styles.mobileNavigation : styles.desktopNavigation)}>
      <div className={styles.navigationTitle}>时间线</div>
      <ul>
        {timelines.map((timeline) => (
          <li key={timeline.id}>
            <button
              type="button"
              aria-pressed={timeline.id === activeTimeline?.id}
              aria-controls={panelId}
              onClick={() => setActiveId(timeline.id)}>
              {timeline.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
