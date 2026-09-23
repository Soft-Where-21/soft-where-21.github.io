import React from 'react';
import {useTimeline} from './context';
import TimelineNavigation from './TimelineNavigation';
import TimelineImages from './TimelineImages';
import styles from './styles.module.css';

export default function BlogTimeline() {
  const context = useTimeline();
  if (!context?.activeTimeline) return <p>暂无时间线。</p>;
  const {activeTimeline, panelId} = context;

  return (
    <>
      <TimelineNavigation mobile />
      <section id={panelId} aria-labelledby={`${panelId}-title`} className={styles.timeline}>
        <h2 id={`${panelId}-title`} className={styles.title} aria-live="polite">{activeTimeline.title}</h2>
        <ol className={styles.events}>
          {activeTimeline.events.map((event, index) => (
            <li key={`${event.date}-${index}`} className={styles.event}>
              <time dateTime={event.date}>{event.date.replaceAll('-', '.')}</time>
              <div className={styles.eventContent}>
                <p>{event.text}</p>
                <TimelineImages images={event.images} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
