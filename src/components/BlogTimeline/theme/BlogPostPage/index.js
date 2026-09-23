import React from 'react';
import BlogPostPage from '@theme-init/BlogPostPage';
import {TimelineProvider} from '../../context';

export default function BlogPostPageWrapper(props) {
  const {timelines} = props.content;
  if (!timelines?.length) return <BlogPostPage {...props} />;

  return (
    <TimelineProvider key={props.content.metadata.permalink} timelines={timelines}>
      <BlogPostPage {...props} />
    </TimelineProvider>
  );
}
