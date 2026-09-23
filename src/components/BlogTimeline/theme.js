// Keep the timeline's Docusaurus integration inside the component package.
// Wrappers use @theme-init because @theme-original resolves to this local theme.
export default function blogTimelineTheme() {
  return {
    name: 'soft-where-blog-timeline',
    getThemePath() {
      return './theme';
    },
  };
}
