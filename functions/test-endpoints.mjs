// Tests the Lambda functions' endpoints: sends the requests the site sends, then checks the responses.
//
//   node functions/test-endpoints.mjs [contact] [stripe] [--url <endpoint>]
//
// By default it calls the deployed endpoints, reading each URL from the component that calls it, so it tests the URLs
// the site uses. Those requests are real: `contact` sends an email through SES, and `stripe` creates a real $1.00 CAD
// PaymentIntent. The PaymentIntent is never confirmed, so nothing is charged; it shows as Incomplete in Stripe.
//
// Pass --url with a single function to test another endpoint instead. The deploy workflow uses it to test each
// function under `serverless offline` against SES and Stripe mocks (see functions/README.md).

import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const SITE_ORIGIN = 'https://www.raaedkabir.com';

const functions = {
  contact: {
    component: 'app/components/Pages/Home/Contact.vue',
    // the fields Contact.vue posts
    body: {
      firstName: 'Live',
      lastName: 'Test',
      email: 'test@example.com',
      subject: 'Live test',
      message: `Sent by functions/test-endpoints.mjs at ${new Date().toISOString()}.`,
    },
    check: ({ message }) => {
      if (!message?.MessageId) throw new Error('response has no SES MessageId');
      return `SES MessageId ${message.MessageId}`;
    },
  },
  stripe: {
    component: 'app/components/UI/AppStripe.vue',
    // AppStripe.vue posts the amount in cents as the whole body; $1.00 is the smallest amount the site offers
    body: 100,
    check: ({ clientSecret }) => {
      if (!/^pi_\w+_secret_\w+$/.test(clientSecret ?? '')) throw new Error('response has no PaymentIntent client secret');
      return `PaymentIntent ${clientSecret.split('_secret_')[0]}`;
    },
  },
};

async function endpointFor(name) {
  const { component } = functions[name];
  const source = await readFile(new URL(`../${component}`, import.meta.url), 'utf8');
  const urls = source.match(/https:\/\/[\w.-]+\.execute-api\.[\w.-]+\.amazonaws\.com\/[^'"`\s]+/g) ?? [];
  if (urls.length !== 1) throw new Error(`expected one API Gateway URL in ${component}, found ${urls.length}`);
  return urls[0];
}

function request(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(30_000) });
}

function allowsSiteOrigin(response) {
  return ['*', SITE_ORIGIN].includes(response.headers.get('access-control-allow-origin'));
}

async function test(name, url) {
  // the site posts JSON cross-origin, so browsers send a CORS preflight first
  const preflight = await request(url, {
    method: 'OPTIONS',
    headers: {
      Origin: SITE_ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  const allowedHeaders = (preflight.headers.get('access-control-allow-headers') ?? '').toLowerCase().split(/\s*,\s*/);
  if (!preflight.ok) throw new Error(`CORS preflight returned ${preflight.status}`);
  if (!allowsSiteOrigin(preflight)) throw new Error(`CORS preflight doesn't allow origin ${SITE_ORIGIN}`);
  if (!allowedHeaders.some((header) => ['*', 'content-type'].includes(header))) {
    throw new Error("CORS preflight doesn't allow the Content-Type header");
  }

  const response = await request(url, {
    method: 'POST',
    headers: { Origin: SITE_ORIGIN, 'Content-Type': 'application/json' },
    body: JSON.stringify(functions[name].body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`POST returned ${response.status}: ${text}`);
  if (!allowsSiteOrigin(response)) throw new Error(`POST response doesn't allow origin ${SITE_ORIGIN}`);

  return functions[name].check(JSON.parse(text));
}

const usage = `Usage: node functions/test-endpoints.mjs [${Object.keys(functions).join('] [')}] [--url <endpoint>]`;

let args;
try {
  args = parseArgs({ options: { url: { type: 'string' } }, allowPositionals: true });
} catch (err) {
  console.error(`${err.message}\n${usage}`);
  process.exit(1);
}

const names = args.positionals.length ? args.positionals : Object.keys(functions);
const unknown = names.filter((name) => !Object.hasOwn(functions, name));
if (unknown.length) {
  console.error(`Unknown function: ${unknown.join(', ')}\n${usage}`);
  process.exit(1);
}
if (args.values.url && names.length !== 1) {
  console.error(`--url needs exactly one function\n${usage}`);
  process.exit(1);
}

for (const name of names) {
  let url;
  try {
    url = args.values.url ?? (await endpointFor(name));
    console.log(`✓ ${name}: ${await test(name, url)} (${url})`);
  } catch (err) {
    // fetch rejects with a generic "fetch failed"; the cause says why
    const reason = err.cause ? `${err.message}: ${err.cause.message}` : err.message;
    console.error(`✗ ${name}: ${reason}${url ? ` (${url})` : ''}`);
    process.exitCode = 1;
  }
}
