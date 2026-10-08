export function getTimelineHeadingId(timeline) {
  return `timeline-${timeline.id}`;
}

export function createTimelineTOC(timelines) {
  return timelines.map((timeline) => ({
    id: getTimelineHeadingId(timeline),
    // Docusaurus renders TOC values as HTML; timeline titles are plain text.
    value: timeline.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    level: 2,
  }));
}
