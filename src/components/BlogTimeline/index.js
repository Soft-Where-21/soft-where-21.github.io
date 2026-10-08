import React from 'react';
import {useTimeline} from './context';
import TimelineImages from './TimelineImages';
import styles from './styles.module.css';

export default function BlogTimeline() {
  const context = useTimeline();
  if (!context?.timelines?.length) return <p>暂无时间线。</p>;
  const {timelines, panelId} = context;

  return (
    <>
      {timelines.map((timeline) => (
        <section key={timeline.id} id={`${panelId}-${timeline.id}`} aria-labelledby={`${panelId}-${timeline.id}-title`} className={styles.timeline}>
          <h2 id={`${panelId}-${timeline.id}-title`} className={styles.title}>{timeline.title}</h2>
          {timeline.intro && (
            <div className={styles.intro}>
              {timeline.intro.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {timeline.intro.link && <p><a href={timeline.intro.link.href}>{timeline.intro.link.label}</a></p>}
            </div>
          )}
          <ol className={styles.events}>
            {timeline.events.map((event, index) => (
              <li key={`${timeline.id}-${event.date}-${index}`} className={styles.event}>
                <time dateTime={event.date}>{event.date.replaceAll('-', '.')}</time>
                <div className={styles.eventContent}>
                  <p>{event.text}</p>
                  {event.link && <a href={event.link.href}>{event.link.label}</a>}
                  <TimelineImages images={event.images} />
                </div>
              </li>
            ))}
          </ol>
          {timeline.outro && (
            <div className={styles.outro}>
              {timeline.outro.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {timeline.outro.link && <p><a href={timeline.outro.link.href}>{timeline.outro.link.label}</a></p>}
            </div>
          )}
        </section>
      ))}
    </>
  );
}
