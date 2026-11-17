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
pnpm storybook  # Storybook on localhost:6006
pnpm test       # check every story and page for accessibility issues
```

`pnpm install` also sets up [Husky](https://typicode.github.io/husky/) git hooks:

- `pre-commit` runs `pnpm lint`
- `commit-msg` runs [commitlint](https://commitlint.js.org/), so commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`)
- `pre-push` runs `pnpm run audit`, which uses [audit-ci](https://github.com/IBM/audit-ci) to fail on moderate or worse advisories. Configure the threshold and allowlist in `audit-ci.json` (use `pnpm run audit`, since `pnpm audit` is pnpm's built-in command)

Pull requests run the same checks in CI: the `Lint` workflow runs `pnpm lint`, the `Commitlint` workflow checks every commit in the PR plus the PR title, which becomes the commit message when the PR is squash-merged, and the `Audit` workflow runs `pnpm run audit`.

---

**Storybook**

`pnpm storybook` starts [Storybook](https://storybook.js.org/) with a docs page and stories for each of the `App*` UI components, built with the site's own Nuxt config and styles. Stories live next to their components (`*.stories.ts`). The [Accessibility addon](https://storybook.js.org/docs/writing-tests/accessibility-testing)'s panel checks the open story with axe, and the [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)'s test widget in the sidebar runs every story as a test. `pnpm build-storybook` builds a static copy into `storybook-static/`.

---

**Accessibility Tests**

`pnpm test` checks the site with [axe-core](https://github.com/dequelabs/axe-core) and fails on any WCAG 2.2 A/AA or axe best-practice violation. It runs two suites, which check the same rules (`tests/axe.ts`):

- `pnpm test:stories` renders every Storybook story in Chromium with [Vitest](https://vitest.dev/), runs its play function and checks it with the Accessibility addon. Stories reach states that pages don't show when they load, like an open modal.
- `pnpm test:a11y` prerenders the site and scans every page, the 404 page and the open navigation menu in [Playwright](https://playwright.dev/), at a desktop and a phone viewport. Run `pnpm exec playwright test` to rescan an existing build.

Run `pnpm exec playwright install chromium` once before the first run. Pull requests run both suites in the `Accessibility` workflow, which uploads the Playwright report with the full axe results for each page.

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
