import React from 'react';
import BlogLayout from '@theme-init/BlogLayout';
import {useTimeline} from '../../context';
import TimelineNavigation from '../../TimelineNavigation';

export default function BlogLayoutWrapper(props) {
  const timeline = useTimeline();
  return <BlogLayout {...props} toc={timeline ? <TimelineNavigation /> : props.toc} />;
}
