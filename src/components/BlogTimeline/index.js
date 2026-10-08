import React from 'react';
import Heading from '@theme/Heading';
import {useTimeline} from './context';
import TimelineImages from './TimelineImages';
import TimelineLinks from './TimelineLinks';
import {getTimelineHeadingId} from './toc';
import styles from './styles.module.css';

export default function BlogTimeline() {
  const context = useTimeline();
  if (!context?.timelines?.length) return <p>暂无时间线。</p>;
  const {timelines, panelId} = context;

  return (
    <>
      {timelines.map((timeline) => (
        <section key={timeline.id} id={`${panelId}-${timeline.id}`} aria-labelledby={getTimelineHeadingId(timeline)} className={styles.timeline}>
          <Heading as="h2" id={getTimelineHeadingId(timeline)} className={styles.title}>{timeline.title}</Heading>
          {timeline.intro && (
            <div className={styles.intro}>
              {timeline.intro.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <TimelineLinks links={timeline.intro.links} link={timeline.intro.link} />
            </div>
          )}
          <ol className={styles.events}>
            {timeline.events.map((event, index) => (
              <li key={`${timeline.id}-${event.date}-${index}`} className={styles.event}>
                <time dateTime={event.date}>{event.date.replaceAll('-', '.')}</time>
                <div className={styles.eventContent}>
                  <p>{event.text}</p>
                  <TimelineLinks links={event.links} link={event.link} />
                  <TimelineImages images={event.images} />
                </div>
              </li>
            ))}
          </ol>
          {timeline.outro && (
            <div className={styles.outro}>
              {timeline.outro.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <TimelineLinks links={timeline.outro.links} link={timeline.outro.link} />
            </div>
          )}
        </section>
      ))}
    </>
  );
}
