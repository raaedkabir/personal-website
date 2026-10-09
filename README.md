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
```

`pnpm install` also sets up [Husky](https://typicode.github.io/husky/) git hooks:

- `pre-commit` runs `pnpm lint`
- `commit-msg` runs [commitlint](https://commitlint.js.org/), so commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`)
- `pre-push` runs `pnpm run audit`, which uses [audit-ci](https://github.com/IBM/audit-ci) to fail on moderate or worse advisories. Configure the threshold and allowlist in `audit-ci.json` (use `pnpm run audit`, since `pnpm audit` is pnpm's built-in command)

Pull requests run the same checks in CI: the `Lint` workflow runs `pnpm lint`, the `Commitlint` workflow checks every commit in the PR plus the PR title, which becomes the commit message when the PR is squash-merged, and the `Audit` workflow runs `pnpm run audit`.

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

**Dashboards & Consoles**

Live site: [www.raaedkabir.com](https://www.raaedkabir.com/)

| Service | Notes |
| --- | --- |
| [Route 53](https://console.aws.amazon.com/route53/v2/hostedzones) | DNS hosted zone |
| [Certificate Manager](https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/list) | SSL certificate (`us-east-1`, as CloudFront requires) |
| [S3](https://console.aws.amazon.com/s3/buckets) | Site bucket (`BUCKET_ID`); resume, demo video and email images are in [`raaedkabir-assets`](https://console.aws.amazon.com/s3/buckets/raaedkabir-assets) |
| [CloudFront](https://console.aws.amazon.com/cloudfront/v4/home#/distributions) | Site distribution (`CLOUDFRONT_ID`) |
| [IAM roles](https://console.aws.amazon.com/iam/home#/roles) / [identity providers](https://console.aws.amazon.com/iam/home#/identity_providers) | Deploy role (`AWS_ROLE_ARN`) and the GitHub OIDC provider it trusts |
| [Serverless Dashboard](https://app.serverless.com/raaedkabir) | Org `raaedkabir`, app `personal-website`: function deploys, and the access key for `SERVERLESS_ACCESS_KEY` |
| [Lambda](https://ca-central-1.console.aws.amazon.com/lambda/home?region=ca-central-1#/functions) | `contact-lambda-dev-contact` and `stripe-lambda-dev-stripe` (`ca-central-1`) |
| [API Gateway](https://ca-central-1.console.aws.amazon.com/apigateway/main/apis?region=ca-central-1) | `POST /dev/contact` and `POST /dev/stripe` endpoints |
| [CloudFormation](https://ca-central-1.console.aws.amazon.com/cloudformation/home?region=ca-central-1#/stacks) | Serverless stacks `contact-lambda-dev` and `stripe-lambda-dev` |
| [CloudWatch Logs](https://ca-central-1.console.aws.amazon.com/cloudwatch/home?region=ca-central-1#logsV2:log-groups) | Function logs under `/aws/lambda/` |
| [SES](https://ca-central-1.console.aws.amazon.com/ses/home?region=ca-central-1#/identities) | Verified sender identity for the contact form |
| [Stripe](https://dashboard.stripe.com/payments) | Payments; keys under [API keys](https://dashboard.stripe.com/apikeys) (`STRIPE_SECRET_KEY`) |
| [Google Analytics](https://analytics.google.com/) | Measurement ID `G-HWHNZXBHTF` |

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
