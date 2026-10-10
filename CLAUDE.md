# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Uses pnpm (version pinned in `package.json` `packageManager`) and the Node version in `.nvmrc`.

```bash
pnpm install         # also runs `nuxt prepare` (generates .nuxt/) and installs Husky hooks
pnpm dev             # dev server on localhost:3000
pnpm generate        # prerender the static site to .output/public (dist/ is a symlink to it)
pnpm preview         # serve the production build
pnpm lint            # eslint . — the only code check; there is no test suite or typecheck script
pnpm run audit       # dependency audit with audit-ci (see Dependency audit below)
pnpm test:functions  # call the deployed Lambda functions with live data (see Lambda functions below)
```

- `eslint.config.mjs` imports `./.nuxt/eslint.config.mjs`, so lint fails until `nuxt prepare` has run (`pnpm install` does it).
- Husky: `pre-commit` runs `pnpm lint`; `commit-msg` runs commitlint on each local commit message; `pre-push` runs `pnpm run audit`. PRs run the same checks in CI through the `Lint`, `Commitlint` and `Audit` workflows.
- Every Husky hook needs a matching GitHub Actions workflow. Hooks only run where they're installed, and `--no-verify` skips them, so CI is what enforces them. When you add or change a hook in `.husky/`, add or update a `pull_request` workflow in `.github/workflows/` that runs the same command (copy the setup steps from `lint.yml`), and update the hook and workflow lists here and in the README.
- `.prettierrc` says no semicolons, but Prettier isn't wired into any script and most files use semicolons. Match the file you're editing.

## Dependency audit

`pnpm run audit` runs [audit-ci](https://github.com/IBM/audit-ci) with `audit-ci.json` and fails on moderate or worse advisories. Husky runs it on `pre-push`. Use `pnpm run audit`, not `pnpm audit` (pnpm's built-in command).

When it fails, fix the advisory before allowlisting it:

1. Upgrade the direct dependency that pulls in the vulnerable package.
2. If no compatible upgrade exists, force the patched version with a pnpm override in `pnpm-workspace.yaml` (e.g. `d3-color@<3.1.0: ^3.1.0`), then run `pnpm install`.
3. Check the fix with `pnpm lint`, `pnpm generate` and `pnpm run audit`.

### Allowlisting

Allowlist an advisory in `audit-ci.json` only when no patched release exists, or when the fix breaks the build and the vulnerable code isn't reachable here.

- Key each entry by advisory ID and dependency path: `GHSA-xxxx-xxxx-xxxx|parent>child>package`. Copy it from the `Found vulnerable advisory paths` section of the audit output. Use `*` to match several paths, e.g. `nitropack>*>braces`.
- Never allowlist a bare package name or bare GHSA ID. That suppresses the advisory on every path, including new ones.
- Give each entry its own object. audit-ci only reads the first key of each object.
- Set `active: true`, an `expiry` about three months out (`YYYY-MM-DD`), and `notes` explaining why it's safe or blocked and what would unblock the fix.
- `audit-ci.json` is plain JSON, so it has no comments. The reasoning goes in `notes`.

```json
{
  "GHSA-xxxx-xxxx-xxxx|parent>child>package": {
    "active": true,
    "expiry": "YYYY-MM-DD",
    "notes": "Why it's safe or blocked, and what unblocks the fix"
  }
}
```

When an entry expires, the audit fails again. Check whether a fix has shipped and remove the entry if so. Otherwise, confirm the reasoning still holds and extend the expiry.

## Commits and pull requests

- Commit messages and PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`), using the rules in `commitlint.config.js`.
- PRs are squash-merged with the PR title as the commit title on `main`, so the title is checked by the `Commitlint` workflow, not the local `commit-msg` hook. Check a title before opening the PR with `printf '%s\n' "<title>" | pnpm exec commitlint`.
- When a branch is ready for a PR, clean up its history first: fold follow-up fixes into the commits they belong to so each commit is a self-contained Conventional Commit. Commit them with `git commit --fixup=<sha>`, then run `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash origin/main` (the env var makes the rebase non-interactive) and push with `git push --force-with-lease`.

## Architecture

Personal portfolio site: a Nuxt 4 app (source under `app/`) prerendered with `nuxt generate` and hosted statically on S3 + CloudFront, plus two standalone AWS Lambda functions under `functions/`.

### Nuxt app (`app/`)

- **Static output, but SSR runs at build time.** Every page is prerendered, so component code executes in Node during `generate`. Browser-only libraries are loaded inside `mounted()`: p5 via `await import('p5')` (`pages/blog/fourier-series.vue`), particles.js by injecting a classic `<script>` tag because it breaks in strict mode (`components/ParticlesJS.vue`).
- **Tear down animation loops in `beforeUnmount`.** p5 sketches, particles.js instances and similar keep running after navigation and pile up on revisits unless removed explicitly. Keep p5 instances off reactive `data` (assign them in `created()`), and guard async setup with an "unmounted" flag since the user may leave mid-load. See the two files above for the pattern.
- **Component registration:** only `components/UI` (the `App*` components) is auto-registered (`components: ['~/components/UI']` in `nuxt.config.ts`). Everything else, including `Layout/TheNavbar` and `Layout/TheFooter` and the section components under `components/Pages/<Page>/`, is imported explicitly.
- **Layouts:** `layouts/default.vue` (navbar, footer, back-to-top button) and `layouts/empty.vue`. Blog posts opt into `empty` via `definePageMeta({ layout: 'empty' })` and wrap their content in `app/layout/blog.vue` (note: singular `layout/`, a regular component imported as `Layout`, not a Nuxt layout). It renders the navbar/footer, cover image, title and date, sets the post's title/OG/Twitter meta, and styles the post body via `:slotted()`. Posts put their content in `<template #content>`.
- **Mixed API styles:** many pages and components use the Options API. Because `definePageMeta` needs `<script setup>`, those pages add a second `<script setup>` block containing only `definePageMeta`.
- **Images:** literal paths use `src="@/assets/images/…"`. Paths built at runtime (blog cover images, work previews) go through `imageUrl()` in `utils/images.js`, which eagerly globs only `assets/images/{blog,works}/**`. Images in other folders won't resolve through it unless you widen the glob.
- **Head/meta:** global meta, OG and Twitter tags are in `nuxt.config.ts`. The `"… | Raaed Kabir"` title template lives in `plugins/title-template.js` (not `app.vue`) so `error.vue` gets it too. Pages set their own title with `useHead`.
- **Styles:** global SCSS follows the 7-1 pattern from `assets/scss/main.scss`. `abstracts/_mixins.scss` is injected into every stylesheet and `<style>` block through Vite `additionalData`, so `@include respond(phone | tab-port | tab-land | big-desktop)` and `interpolate(...)` work anywhere without an import. The stylesheets still use `@import` (the deprecation warning is silenced on purpose).
- **PWA** (`@vite-pwa/nuxt`): precaches only hashed JS/CSS. Pages are network-first and `_nuxt` images cache-first at runtime. `navigateFallback` is null because there's no SPA shell. Analytics via `nuxt-gtag`.
- **Shared state:** `composables/useNav.js` holds the fullscreen-menu open state with `useState`, shared across navbar instances.

### Lambda functions (`functions/`)

Two independent Serverless Framework v4 services (`nodejs24.x`, `ca-central-1`, stage `dev`, CommonJS handlers). They are not part of the root pnpm workspace; each has its own `package.json`. See `functions/README.md` for `sls` commands (`sls invoke local -f <name>`, `sls deploy`, `sls logs`).

- `contact-lambda`: `POST /contact`, sends the contact-form email via SES. It has no runtime dependencies because AWS SDK v3 ships with the Lambda runtime; `@aws-sdk/client-ses` is a devDependency only so the handler runs under serverless offline.
- `stripe-lambda`: `POST /stripe`, creates a Stripe PaymentIntent (CAD). It reads `STRIPE_SECRET_KEY` from a git-ignored `functions/stripe-lambda/config.js` (`module.exports = { STRIPE_SECRET_KEY: '…' }`). `STRIPE_API_URL`, when set, points the client at another API (stripe-mock in tests).
- Each has its own lockfile and `nodeLinker: hoisted` because Serverless packages `node_modules` as-is (it leaves out devDependencies). Both list `serverless-offline` as a plugin, so `serverless deploy` needs the devDependencies installed.

The frontend calls these through hard-coded API Gateway URLs in `components/Pages/Home/Contact.vue` (axios) and `components/UI/AppStripe.vue` (fetch). A redeploy that changes an endpoint URL must be mirrored there.

`functions/test-endpoints.mjs [contact|stripe] [--url <endpoint>]` sends the same CORS preflight and POST body as the site to a function's endpoint, then checks the responses. If the request body a component sends changes, update the matching `body` in the script.

- With `--url`, it tests another endpoint. The deploy workflow uses this to test each function under serverless offline with mocks: aws-ses-v2-local for SES (via `AWS_ENDPOINT_URL_SES`) and stripe-mock for Stripe (via `STRIPE_API_URL`). See `functions/README.md` for running it locally.
- Without `--url` (`pnpm test:functions`), it reads the endpoint URLs from those two components and calls the deployed functions. Those requests are real: `contact` sends an email through SES and `stripe` creates an unconfirmed $1.00 CAD PaymentIntent, so only run it when asked to.

### Deployment

`.github/workflows/main.yml` runs on pushes to `main` (and on manual dispatch). It runs `pnpm generate`, syncs `.output/public` to S3 with `--delete`, and invalidates CloudFront. In parallel, the `test-functions` job tests each Lambda function under serverless offline with SES and Stripe mocks (it needs `SERVERLESS_ACCESS_KEY`, since Serverless v4 requires a login), and once both pass, `deploy-functions` deploys them with Serverless (the `stripe-lambda` job writes `config.js` from the `STRIPE_SECRET_KEY` secret). AWS access uses GitHub OIDC via `AWS_ROLE_ARN`; there are no long-lived keys. The build and deploy jobs only run on `main`, so dispatching the workflow on another branch runs just `test-functions`.
