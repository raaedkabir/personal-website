## Personal Website

<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/made-with-vue.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)

[![Build Status](https://img.shields.io/github/actions/workflow/status/raaedkabir/personal-website/main.yml?branch=main&style=for-the-badge)](https://github.com/raaedkabir/personal-website/actions/workflows/main.yml)

</div>

---

**Local Development**

Requires the Node version in `.nvmrc` and [pnpm](https://pnpm.io/installation) (pinned via `packageManager` in `package.json`, so `corepack enable` will pick it up).

```bash
pnpm install    # install dependencies
pnpm dev        # dev server on localhost:3000
pnpm generate   # static build to /dist
pnpm test:e2e   # static build, then run the Playwright tests (see Testing below)
```

`pnpm install` also sets up [Husky](https://typicode.github.io/husky/) git hooks:

- `pre-commit` runs `pnpm lint`
- `commit-msg` runs [commitlint](https://commitlint.js.org/), so commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`)
- `pre-push` runs `pnpm run audit`, which uses [audit-ci](https://github.com/IBM/audit-ci) to fail on moderate or worse advisories. Configure the threshold and allowlist in `audit-ci.json` (use `pnpm run audit`, since `pnpm audit` is pnpm's built-in command)

Pull requests run the same checks in CI: the `Lint` workflow runs `pnpm lint`, the `Commitlint` workflow checks every commit in the PR plus the PR title, which becomes the commit message when the PR is squash-merged, and the `Audit` workflow runs `pnpm run audit`. The `Test` workflow runs the Playwright tests, which have no hook because they're too slow for one.

---

**Testing**

End-to-end tests use [Playwright](https://playwright.dev/). They run against the production build (`pnpm generate`, served as static files with sirv) in Chromium, at a desktop size and a phone size (Pixel 7). Run `pnpm exec playwright install chromium` once before the first local run (Claude Code cloud sessions already have it).

```bash
pnpm test:e2e                            # build the site, then run every test
pnpm test:e2e:update                     # same, but rewrite the screenshots that changed
pnpm test:a11y                           # build the site, then run only the accessibility scan
pnpm test:e2e:report                     # open the HTML report of the last run
pnpm exec playwright test e2e/smoke      # rerun some tests against the last build
```

| Spec (`tests/`)                                                  | Checks                                                                                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `e2e/smoke.spec.ts`                                              | every page loads with its title and heading, with no console errors, broken images or sideways scrolling; the 404 page |
| `e2e/navigation.spec.ts`, `e2e/contact.spec.ts`, `e2e/about.spec.ts` | the menu (mouse and keyboard), links, back-to-top button, contact form and the buy-me-a-coffee dialog              |
| `e2e/visual.spec.ts`                                             | full-page screenshots, compared with the ones in `tests/e2e/__snapshots__/visual.spec.ts/`                              |
| `a11y.spec.ts`                                                   | every page, the 404 page and the open navigation menu scanned with [axe-core](https://github.com/dequelabs/axe-core); fails on any WCAG 2.2 A/AA or axe best-practice violation |

The tests never reach outside services. In the `e2e/` specs, analytics, the Lambda functions, Stripe, the embeds and the data gist are stubbed in `tests/e2e/support/test.ts`, and a request to any other outside host fails the test; the accessibility scan aborts every outside request. For the screenshots to come out identical on every run, the clock is frozen and `Math.random` is seeded; the few regions that still move are masked (see `tests/e2e/support/routes.ts`, where new pages should be added too).

The screenshots also have to match between machines, such as a Claude Code cloud session and a GitHub runner. So the browser gets its own font configuration (`tests/e2e/fonts/`, with the Liberation fonts as the only system fonts). It also runs as the full Chromium build with `--disable-skia-runtime-opts`, so it draws with the same code whatever the CPU (see `playwright.config.ts`).

When a change is meant to look different, run `pnpm test:e2e:update`, check the new images and commit them. The pull request then shows the before and after. Screenshots are recorded on Linux, matching CI, so the visual tests are skipped on other systems.

Pull requests run the whole suite and a type-check of the tests in the [Test workflow](.github/workflows/test.yml). Its HTML report (with each page's full axe results), plus the actual, expected and diff images of any failed screenshots, are attached to the run as artifacts.

---

**AWS Hosting**

- DNS setup with Route 53
- SSL Certificate from Certificate Manager
- Static hosting on S3
- Distribution with CloudFront

---

**CI/CD Build Pipeline using GitHub Actions**

1. Merge code to main branch
2. Run build
3. Assume the deploy IAM role via GitHub OIDC (no long-lived AWS keys)
4. Upload /dist to S3
5. Invalidate CloudFront's cache
6. Deploy the Lambda functions in `functions/` with Serverless Framework (in parallel with steps 2–5)

Repository secrets: `AWS_ROLE_ARN`, `BUCKET_ID`, `CLOUDFRONT_ID`, `SERVERLESS_ACCESS_KEY` and `STRIPE_SECRET_KEY`.

---

**Problems with Configuring Client-Side Routing (for SPAs)**

- Setting the Error Document in S3 makes potential valid URLs treated as 404s
- Customizing the Error Response in CloudFront treats invalid URLs as 200s
- Adding a Lamda@Edge Viewer Request Interceptor to check the route against known routes will correctly serve 200s and 404s respectively but will require extra work of updating the list of known routes

This webapp was using the third option but has instead now migrated to Nuxt. But for reference the Lamda@Edge code is still here:

```js
// array of known routes
const pages = [...known_routes]

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request

  // replace URI if route is valid
  if (pages.indexOf(request.uri.slice(1)) > -1) {
    request.uri = '/index.html'
  }

  // pass route back to request
  callback(null, request)
}
```
