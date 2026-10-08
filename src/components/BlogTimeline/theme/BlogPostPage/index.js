import React, {useMemo} from 'react';
import BlogPostPage from '@theme-init/BlogPostPage';
import {TimelineProvider} from '../../context';
import {createTimelineTOC} from '../../toc';

export default function BlogPostPageWrapper(props) {
  const content = useMemo(() => {
    const Content = props.content;
    if (!Content.timelines?.length) return Content;

    // Keep the imported MDX module intact for blog lists and other consumers.
    function TimelineContent(contentProps) {
      return <Content {...contentProps} />;
    }

    return Object.assign(TimelineContent, Content, {
      toc: [...(Content.toc ?? []), ...createTimelineTOC(Content.timelines)],
    });
  }, [props.content]);
  const {timelines} = content;
  if (!timelines?.length) return <BlogPostPage {...props} />;

  return (
    <TimelineProvider key={props.content.metadata.permalink} timelines={timelines}>
      <BlogPostPage {...props} content={content} />
    </TimelineProvider>
  );
}
