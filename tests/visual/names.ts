// Screenshot file names, which capture.spec.ts writes and compare.ts turns back into labels for the PR comment.
// A name is the page's route with its slashes swapped for ~ ("/" is "index"), and for a page in a given state,
// "@" and the state ("works@menu-open" is /works with the menu open).

export function screenshotName(route: string, state?: string): string {
  const page = route === '/' ? 'index' : route.slice(1).replaceAll('/', '~');
  return state ? `${page}@${state}` : page;
}

export function describeScreenshot(name: string): { route: string; state?: string } {
  const [page, state] = name.split('@');
  return {
    route: page === 'index' ? '/' : `/${page.replaceAll('~', '/')}`,
    state: state?.replaceAll('-', ' '),
  };
}
