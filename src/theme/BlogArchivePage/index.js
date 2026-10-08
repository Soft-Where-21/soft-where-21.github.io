import React from 'react';
import BlogArchivePageOriginal from '@theme-original/BlogArchivePage';

export default function BlogArchivePage(props) {
  const postsByYear = new Map();
  for (const post of props.archive.blogPosts) {
    const year = post.metadata.date.split('-')[0];
    const posts = postsByYear.get(year) ?? [];
    posts.push(post);
    postsByYear.set(year, posts);
  }

  // Posts already arrive newest first. The original archive reverses each year,
  // so reverse each group here to preserve that order and the existing year groups.
  const blogPosts = Array.from(postsByYear.values()).flatMap((posts) =>
    posts.reverse(),
  );

  return (
    <BlogArchivePageOriginal
      {...props}
      archive={{...props.archive, blogPosts}}
    />
  );
}
