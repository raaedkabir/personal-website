// The axe rules both accessibility suites check: the page scans in tests/a11y.spec.ts and the
// Storybook stories, whose Accessibility addon is set up in .storybook/preview.ts.
// WCAG 2.2 A and AA, plus axe's best practices
export const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
