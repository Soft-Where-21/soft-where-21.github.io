import BlogLayout from '@theme-init/BlogLayout';

export default function BlogLayoutWrapper(props) {
  return <BlogLayout {...props} toc={props.toc} />;
}
