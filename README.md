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
pnpm test:a11y  # static build, then scan every page for accessibility issues
```

`pnpm install` also sets up [Husky](https://typicode.github.io/husky/) git hooks:

- `pre-commit` runs `pnpm lint`
- `commit-msg` runs [commitlint](https://commitlint.js.org/), so commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`)
- `pre-push` runs `pnpm run audit`, which uses [audit-ci](https://github.com/IBM/audit-ci) to fail on moderate or worse advisories. Configure the threshold and allowlist in `audit-ci.json` (use `pnpm run audit`, since `pnpm audit` is pnpm's built-in command)

Pull requests run the same checks in CI: the `Lint` workflow runs `pnpm lint`, the `Commitlint` workflow checks every commit in the PR plus the PR title, which becomes the commit message when the PR is squash-merged, and the `Audit` workflow runs `pnpm run audit`.

---

**Accessibility Tests**

`pnpm test:a11y` prerenders the site and scans every page, the 404 page and the open navigation menu with [axe-core](https://github.com/dequelabs/axe-core) in [Playwright](https://playwright.dev/), at a desktop and a phone viewport. It fails on any WCAG 2.2 A/AA or axe best-practice violation. Run `pnpm exec playwright install chromium` once before the first run, and `pnpm exec playwright test` to rescan an existing build.

Pull requests run it in the `Accessibility` workflow, which uploads the Playwright report with the full axe results for each page.

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
