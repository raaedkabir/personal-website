## Personal Website

<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/made-with-vue.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)

[![Build Status](https://img.shields.io/github/actions/workflow/status/raaedkabir/personal-website/main.yml?branch=master&style=for-the-badge)](https://github.com/raaedkabir/personal-website/actions/workflows/main.yml)

</div>

---

**Local Development**

Requires the Node version in `.nvmrc` and [pnpm](https://pnpm.io/installation) (pinned via `packageManager` in `package.json`, so `corepack enable` will pick it up). On Linux and macOS, `./init.sh` sets both up and installs the dependencies; add `--functions` to also set up the Lambda functions and the Serverless Framework CLI.

```bash
./init.sh       # first-time setup: Node.js, pnpm and dependencies
pnpm install    # install dependencies
pnpm dev        # dev server on localhost:3000
pnpm generate   # static build to /dist
```

`pnpm install` also sets up [Husky](https://typicode.github.io/husky/) git hooks:

- `pre-commit` runs `pnpm lint`
- `commit-msg` runs [commitlint](https://commitlint.js.org/), so commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`)

---

**AWS Hosting**

- DNS setup with Route 53
- SSL Certificate from Certificate Manager
- Static hosting on S3
- Distribution with CloudFront

---

**CI/CD Build Pipeline using GitHub Actions**

1. Merge code to master branch
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
