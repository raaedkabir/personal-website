import { readdirSync } from 'node:fs';
import { sep } from 'node:path';

// The pages the Playwright suites visit: every page nuxt generate prerendered into siteDir (about/index.html
// is served at /about), plus the 404 page. New pages are picked up without changes to the tests.
export function prerenderedRoutes(siteDir: string): string[] {
  return [
    ...readdirSync(siteDir, { recursive: true, encoding: 'utf8' })
      .filter((file) => file.split(sep).at(-1) === 'index.html')
      .map((file) => `/${file.split(sep).slice(0, -1).join('/')}`)
      .sort(),
    '/404.html',
  ];
}

// pages whose WebGL render loop, rendered on the CPU in these tests, starves everything else on the page.
// The suites stub out their animation frames.
export const isWebGLDemo = (route: string) => route.startsWith('/works/threejs/');
