import fs from 'node:fs';
import { test as base, expect, type Page, type Route } from '@playwright/test';
import type { SiteRoute } from './routes';

export { expect };

export const CONTACT_API = 'https://thkf162jn1.execute-api.ca-central-1.amazonaws.com/dev/contact';
export const STRIPE_API = 'https://d9lfm4l7tc.execute-api.ca-central-1.amazonaws.com/dev/stripe';

// the real data lives in a GitHub gist; a small synthetic copy keeps the charts fast and identical between runs
const videoGameSalesCsv = fs.readFileSync(new URL('../data/video-game-sales.csv', import.meta.url));

// enough of Stripe.js for the payment form to render, without loading the real thing
const stripeStub = `
window.Stripe = () => ({
  elements: () => ({
    create: () => ({
      mount(selector) { document.querySelector(selector).textContent = 'Card details (Stripe is stubbed in tests)'; },
      on() {},
    }),
  }),
  confirmCardPayment: () => Promise.resolve({ error: { message: 'Stripe is stubbed in tests' } }),
});
`;

const emptyScript = { status: 200, contentType: 'application/javascript', body: '' };

/**
 * Third-party hosts the site talks to and what the tests answer instead. Tests never reach analytics, the
 * contact and payment backends or any other outside service, so they can't send emails or skew page views.
 * Google Fonts is the exception: it is loaded for real so the screenshots show the real typography.
 */
const thirdPartyStubs: Record<string, Parameters<Route['fulfill']>[0] | 'network'> = {
  'fonts.googleapis.com': 'network',
  'fonts.gstatic.com': 'network',
  'www.googletagmanager.com': emptyScript,
  'www.google-analytics.com': { status: 204 },
  'region1.google-analytics.com': { status: 204 },
  'js.stripe.com': { status: 200, contentType: 'application/javascript', body: stripeStub },
  'www.credly.com': { status: 200, contentType: 'text/html', body: '<!doctype html><title>Credly badge</title>' },
  'cpwebassets.codepen.io': emptyScript,
  'platform.twitter.com': emptyScript,
  'gist.githubusercontent.com': { status: 200, contentType: 'text/plain', body: videoGameSalesCsv },
};

type Fixtures = {
  /**
   * Problems seen while the test ran: uncaught exceptions, console errors, same-origin responses with an
   * error status and requests to hosts that aren't stubbed above. Any of them fails the test.
   */
  pageIssues: string[];
  /** Matches the page issues a test expects, e.g. the 404 response on the error page. */
  expectedIssues: RegExp | undefined;
};

export const test = base.extend<Fixtures>({
  expectedIssues: [undefined, { option: true }],

  // eslint-disable-next-line no-empty-pattern
  pageIssues: async ({}, use) => {
    await use([]);
  },

  context: async ({ context, baseURL }, use) => {
    const siteHost = new URL(baseURL!).host;

    await context.route(
      (url) => url.host !== siteHost,
      async (route, request) => {
        const host = new URL(request.url()).hostname;
        const stub = thirdPartyStubs[host];
        if (stub === 'network') return route.fallback();
        if (host === 'gist.githubusercontent.com') {
          // The charts lay out their legends by measuring the label text as soon as the data arrives. Answering
          // before the site's web fonts have loaded would measure the fallback font instead, so wait for them.
          await request
            .frame()
            .evaluate(() => Promise.all(['1em Montserrat', '1em Roboto'].map((font) => document.fonts.load(font))))
            .catch(() => {});
        }
        if (stub) return route.fulfill(stub);
        // the page fixture reports this as a page issue
        return route.abort('blockedbyclient');
      },
    );

    await use(context);
  },

  page: async ({ page, baseURL, pageIssues, expectedIssues }, use) => {
    const siteOrigin = new URL(baseURL!).origin;

    page.on('pageerror', (error) => pageIssues.push(`Uncaught ${error.name}: ${error.message}`));
    page.on('console', (message) => {
      // failed requests are reported below with their URL, which says more than the console message
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
        pageIssues.push(`console.error: ${message.text()}`);
      }
    });
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin === siteOrigin && response.status() >= 400) {
        pageIssues.push(`HTTP ${response.status()} for ${url.pathname}`);
      }
    });
    page.on('requestfailed', (request) => {
      if (request.failure()?.errorText === 'net::ERR_BLOCKED_BY_CLIENT') {
        pageIssues.push(`Request to an unexpected host, stub it in tests/e2e/support/test.ts: ${request.url()}`);
      }
    });

    await use(page);

    const unexpected = pageIssues.filter((issue) => !expectedIssues?.test(issue));
    expect(unexpected, 'errors or unexpected requests while the test ran').toEqual([]);
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Answers one of the site's Lambda endpoints (CONTACT_API, STRIPE_API) the way API Gateway would, CORS
 * preflight included. `respond` gets the parsed request body.
 */
export function mockApi(page: Page, url: string, respond: (body: unknown) => { status?: number; json: unknown }) {
  return page.route(url, (route) => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: corsHeaders });

    const { status = 200, json } = respond(route.request().postDataJSON());
    return route.fulfill({ status, headers: corsHeaders, json });
  });
}

const FROZEN_TIME = new Date('2026-01-01T12:00:00Z');

/**
 * Makes the page render the same pixels on every run: Math.random is replaced by a seeded generator and the
 * clock is stopped, so animations, particles and the generative art only move when settle() advances time.
 * Call it before navigating.
 */
export async function freeze(page: Page) {
  await page.addInitScript(() => {
    // mulberry32
    let seed = 1;
    Math.random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  await page.clock.install({ time: FROZEN_TIME });
  await page.clock.pauseAt(FROZEN_TIME);
}

/** Waits for everything the page loads, then runs the frozen clock forward so entrance animations finish. */
export async function settle(page: Page, ms = 3000) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(ms);
  await page.waitForLoadState('networkidle');
}

/** Opens a route with a frozen clock and waits until it is fully drawn and its animations have finished. */
export async function openSettled(page: Page, route: SiteRoute) {
  await freeze(page);
  await page.goto(route.path);
  for (const selector of route.ready ?? []) {
    await expect(page.locator(selector).first()).toBeAttached();
  }
  await settle(page, route.settleMs);
}
