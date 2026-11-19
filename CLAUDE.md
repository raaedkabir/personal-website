# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Uses pnpm (version pinned in `package.json` `packageManager`) and the Node version in `.nvmrc`.

```bash
pnpm install          # also runs `nuxt prepare` (generates .nuxt/) and installs Husky hooks
pnpm dev              # dev server on localhost:3000
pnpm generate         # prerender the static site to .output/public (dist/ is a symlink to it)
pnpm preview          # serve the production build
pnpm lint             # eslint . (there is no typecheck script)
pnpm storybook        # Storybook on localhost:6006 (see Storybook below)
pnpm build-storybook  # static Storybook in storybook-static/
pnpm test             # pnpm test:stories, then pnpm test:a11y
pnpm test:stories     # render every story in Chromium, run its play function and check it with axe
pnpm test:a11y        # prerender the site and scan every page with axe (see Accessibility tests below)
pnpm run audit        # dependency audit with audit-ci (see Dependency audit below)
```

- `eslint.config.mjs` imports `./.nuxt/eslint.config.mjs`, so lint fails until `nuxt prepare` has run (`pnpm install` does it). It also applies `eslint-plugin-storybook`'s recommended rules to the stories.
- Husky: `pre-commit` runs `pnpm lint`; `commit-msg` runs commitlint on each local commit message; `pre-push` runs `pnpm run audit`. PRs run the same checks in CI through the `Lint`, `Commitlint` and `Audit` workflows, plus `pnpm test:stories` and `pnpm test:a11y` through the `Accessibility` workflow, which has no hook because it's too slow for one.
- Every Husky hook needs a matching GitHub Actions workflow. Hooks only run where they're installed, and `--no-verify` skips them, so CI is what enforces them. When you add or change a hook in `.husky/`, add or update a `pull_request` workflow in `.github/workflows/` that runs the same command (copy the setup steps from `lint.yml`), and update the hook and workflow lists here and in the README.
- `.prettierrc` says no semicolons, but Prettier isn't wired into any script and most files use semicolons. Match the file you're editing.

## Dependency audit

`pnpm run audit` runs [audit-ci](https://github.com/IBM/audit-ci) with `audit-ci.json` and fails on moderate or worse advisories. Husky runs it on `pre-push`. Use `pnpm run audit`, not `pnpm audit` (pnpm's built-in command).

When it fails, fix the advisory before allowlisting it:

1. Upgrade the direct dependency that pulls in the vulnerable package. If the ranges already allow a patched version, `pnpm update <vulnerable-package>` updates just the lockfile.
2. If no compatible upgrade exists, force the patched version with a pnpm override (see Overrides below), then run `pnpm install`.
3. Check the fix with `pnpm lint`, `pnpm generate` and `pnpm run audit`.
4. Check that every existing override and allowlist entry is still needed, and remove the ones that aren't (see below).

### Overrides

Overrides go under `overrides:` in `pnpm-workspace.yaml`. Use one only when the latest release of the package that depends on the vulnerable version still pins it, and the fix wasn't backported to that range.

- Scope the selector to the advisory's vulnerable range and point it at the first patched release, e.g. `glob@>=9.0.0 <14.0.2: ^14.0.2`. It then rewrites only vulnerable versions, and stops matching once every parent is on a patched release.
- If that crosses a major version, check that the package pinning the old version only uses APIs the new major keeps.
- Put a comment above each override with the advisory ID, the package that pins the vulnerable version, why the forced version is safe for it, and what would make the override unnecessary. The existing overrides show the format.

Overrides don't expire, so nothing fails when one stops being needed. Re-check them whenever you work on the audit or upgrade dependencies: remove each one in turn and run `pnpm install` and `pnpm run audit`. If the audit passes, delete the override and its comment. If it fails, put the override back, run `pnpm install` again, and update the comment if the reason changed (e.g. some of the packages it covered have since moved to a patched version).

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

An entry can also stop matching before it expires, e.g. when an upgrade removes the path or the advisory is withdrawn. The audit still passes, but audit-ci prints `Consider not allowlisting path(s): …`. Remove those entries.

## Storybook

Storybook 10 with the [`@storybook-vue/nuxt`](https://storybook.nuxtjs.org) framework and the Docs, Accessibility and Vitest addons, configured in `.storybook/`.

- **Stories sit next to their components** as `*.stories.ts` and are titled by folder (`UI/AppButton`). `.storybook/main.ts` loads `app/components/**/*.stories.ts`, and Nuxt's component scan doesn't register them.
- **Docs pages:** every component gets one (`tags: ['autodocs']`), with props, events and slots from the default docgen, `vue-docgen-api`. Storybook warns that it's deprecated, but leave it until Storybook 11 changes the default: `features.experimentalDocgenServer` finds no props with this framework, and the `vue-component-meta` docgen option's Vite plugin raises an error overlay whenever a story file changes.
- **Stories are built with the Vite config from `nuxt.config.ts`**: auto-imports, the global SCSS and mixins, Nuxt plugins, and a stand-in `NuxtLink`. `nuxt.config.ts` turns off `nuxt-gtag` and the PWA when `STORYBOOK` or `VITEST` is set, so Storybook and the story tests send no analytics hits and register no service worker.
- **`viteFinal` in `.storybook/main.ts` works around two things the framework does.** It builds Nuxt's config as for production, so `viteFinal` defines `process.env.NODE_ENV` as `development` in `storybook dev` to keep Vue's hot reload runtime. It turns off Vite's dependency discovery, so CommonJS packages that a component in a story imports have to be listed in `optimizeDeps.include` there, as `prismjs` is for `AppPrism`. Otherwise the story fails to load with "does not provide an export named …".
- **Slots:** an arg named after a slot fills it, because docgen marks it as one (`default` in `AppButton.stories.ts`). For richer slot content, write a `render` template, and list the components it uses in its `components`: runtime-compiled templates don't get Nuxt's auto-imports.
- **Backgrounds:** `.storybook/preview.ts` draws stories on the site's dark background, which the docs pages otherwise replace with white. Keep React-based imports such as `storybook/theming` out of `preview.ts`: the framework doesn't pre-bundle React, so the story tests would fail to load.
- **No stories** for `AppStripe` (it creates a live Stripe PaymentIntent on mount), `ParticlesJS`, or the layout and page section components, which the page scans cover.
- A cold run of the story tests prints a `NUXT_B7002` warning about `react` entries in `optimizeDeps.include`. `@storybook-vue/nuxt` adds them, and the warning is harmless.

## Accessibility tests

Two suites check the site with axe-core against the same rules, WCAG 2.2 A and AA plus axe's best practices (`axeTags` in `tests/axe.ts`), and fail on any violation. `pnpm test` runs both, and so does the `Accessibility` workflow on pull requests, as two steps so a failing story doesn't hide failing pages. Both run in Playwright's Chromium: run `pnpm exec playwright install chromium` once before the first local run.

- Fix violations in the markup or styles. Don't disable rules or exclude elements unless axe is demonstrably wrong, and explain why in a comment.
- axe can't judge contrast over background images, gradients or pseudo-element backgrounds. It reports those as `incomplete` rather than as violations (the home hero and the navigation menu, for example), so check them by hand.

### Stories (`pnpm test:stories`)

The Vitest addon (`vitest.config.ts`) turns every story into a test that renders it in Chromium, runs its play function, then runs the Accessibility addon's axe check (`parameters.a11y` in `.storybook/preview.ts`).

- Stories reach states the page scans can't, such as an open modal or a filled-in field: the coffee modal's text failed contrast, and only its story caught it. Add a story, with a play function if it takes interaction, for each state worth checking.
- `parameters.a11y.test: 'error'` fails the test on any violation. Don't lower it to `'todo'` or `'off'` to get a story through.
- Stories are checked at Storybook's 1280px wide `desktop` viewport (pinned through `initialGlobals` in `vitest.config.ts`); the default, 1200px, is in the site's tablet breakpoint. axe checks `document.body`, so page-level rules such as landmarks and a level-one heading are left to the page scans, and the addon turns off `region`.
- A failure prints each violation with the element and, for contrast, the measured ratio. In Storybook, the Accessibility panel checks the open story, and the test widget at the bottom of the sidebar runs the story tests (tick Accessibility to include the axe checks).

### Pages (`pnpm test:a11y`)

`tests/a11y.spec.ts` uses Playwright and [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) to scan the prerendered site at a desktop and a phone viewport.

- It scans every `index.html` page in `.output/public`, so new pages are covered without changes, plus `/404.html` and the open navigation menu.
- `pnpm test:a11y` runs `nuxt generate` first. To rescan the existing build, run `pnpm exec playwright test` (add `--project=desktop` or a title filter to narrow it). `playwright.config.ts` serves `.output/public` with sirv on port 4173.
- Requests to other origins are aborted, so test runs never send analytics hits, create Stripe PaymentIntents (the About page does on load) or load embeds. Third-party content isn't scanned.
- `tests/modal.spec.ts` covers behaviour axe can't see, on the About page's coffee dialog (`AppModal`): focus moves in when it opens, Tab and Shift+Tab wrap inside it, Escape closes it and focus returns to its button, and its mask covers the whole page, header included.
- Pages whose content fades in are listed in `introDurations` with the length of the intro. The test fast-forwards Playwright's fake clock by that much so axe sees the settled page. Add an entry when a page gets an intro animation.
- The three.js demos (`isWebGLDemo`) run with `requestAnimationFrame` stubbed out. Chromium renders WebGL on the CPU in these tests (SwiftShader), and their render loops otherwise take so much of it that page loads and scans time out. axe doesn't look inside a canvas, so nothing goes unscanned. Don't pause `page.clock` for this instead: axe schedules its work with `setTimeout` and would never finish.
- A failure lists each rule with the selectors that break it. The HTML report (`playwright-report/`, uploaded as an artifact in CI) has the full axe results for each page, including `failureSummary` with measured contrast ratios.

## Commits and pull requests

- Commit messages and PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add contact form`, `fix(blog): correct styles`), using the rules in `commitlint.config.js`.
- PRs are squash-merged with the PR title as the commit title on `main`, so the title is checked by the `Commitlint` workflow, not the local `commit-msg` hook. Check a title before opening the PR with `printf '%s\n' "<title>" | pnpm exec commitlint`.
- When a branch is ready for a PR, clean up its history first: fold follow-up fixes into the commits they belong to so each commit is a self-contained Conventional Commit. Commit them with `git commit --fixup=<sha>`, then run `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash origin/main` (the env var makes the rebase non-interactive) and push with `git push --force-with-lease`.
- Don't name or link issues or pull requests in other repositories (`owner/repo#123` or their URLs) in commit messages, PR titles and descriptions, or comments. GitHub adds a public "mentioned this" entry to that issue's timeline, and it stays there even after the text is edited. Describe what you found in words instead.

## Architecture

Personal portfolio site: a Nuxt 4 app (source under `app/`) prerendered with `nuxt generate` and hosted statically on S3 + CloudFront, plus two standalone AWS Lambda functions under `functions/`.

### Nuxt app (`app/`)

- **Static output, but SSR runs at build time.** Every page is prerendered, so component code executes in Node during `generate`. Browser-only libraries are loaded inside `mounted()`: p5 via `await import('p5')` (`pages/blog/fourier-series.vue`), particles.js by injecting a classic `<script>` tag because it breaks in strict mode (`components/ParticlesJS.vue`).
- **Tear down animation loops in `beforeUnmount`.** p5 sketches, particles.js instances and similar keep running after navigation and pile up on revisits unless removed explicitly. Keep p5 instances off reactive `data` (assign them in `created()`), and guard async setup with an "unmounted" flag since the user may leave mid-load. See the two files above for the pattern.
- **three.js demos** (`pages/works/threejs/`): each demo page renders `components/Pages/ThreeJs/ThreeDemo.vue` (navbar, full-viewport canvas, info panel) with a `load` prop that dynamically imports a scene module from `utils/three/`. A scene module exports `create({ container, guiContainer, isCancelled })`, which loads its assets, returns `null` if the page was left meanwhile, then builds the scene synchronously and resolves to `{ dispose }`. `dispose` goes through `disposeDemo()` in `utils/three/common.js`, which frees geometries, materials and textures and calls `renderer.forceContextLoss()`, since browsers drop the oldest WebGL contexts once about 16 are alive. Demo assets live in `assets/three/` and are imported, with `.hdr` and `.gltf` registered as assets through `vite.assetsInclude` in `nuxt.config.ts`, never loaded by relative URL. That includes Water2's normal maps, which it otherwise loads from `textures/water/…` relative to the page.
- **Component registration:** only `components/UI` (the `App*` components) is auto-registered (`components: ['~/components/UI']` in `nuxt.config.ts`). Everything else, including `Layout/TheNavbar` and `Layout/TheFooter` and the section components under `components/Pages/<Page>/`, is imported explicitly.
- **Modals:** `components/UI/AppModal.vue` is a `div` with `role="dialog"` and `aria-modal="true"`. It moves focus in when it opens, wraps Tab inside, emits `close` on Escape and returns focus when it closes; the parent owns `open` and sets it to false on `close`. Don't make it a native `<dialog>` opened with `showModal()`: the coffee dialog holds `AppStripe`, and the 3D Secure check that Stripe's `confirmCardPayment()` appends to `<body>` would open behind a top-layer dialog and be inert.
- **Layouts:** `layouts/default.vue` (navbar, footer, back-to-top button) and `layouts/empty.vue`. Blog posts opt into `empty` via `definePageMeta({ layout: 'empty' })` and wrap their content in `app/layout/blog.vue` (note: singular `layout/`, a regular component imported as `Layout`, not a Nuxt layout). It renders the navbar/footer, cover image, title and date, sets the post's title/OG/Twitter meta, and styles the post body via `:slotted()`. Posts put their content in `<template #content>`.
- **Mixed API styles:** many pages and components use the Options API. Because `definePageMeta` needs `<script setup>`, those pages add a second `<script setup>` block containing only `definePageMeta`.
- **Images:** literal paths use `src="@/assets/images/…"`. Paths built at runtime (blog cover images, work previews) go through `imageUrl()` in `utils/images.js`, which eagerly globs only `assets/images/{blog,works}/**`. Images in other folders won't resolve through it unless you widen the glob.
- **Head/meta:** global meta, OG and Twitter tags are in `nuxt.config.ts`. The `"… | Raaed Kabir"` title template lives in `plugins/title-template.js` (not `app.vue`) so `error.vue` gets it too. Pages set their own title with `useHead`.
- **Styles:** global SCSS follows the 7-1 pattern from `assets/scss/main.scss`. `abstracts/_mixins.scss` is injected into every stylesheet and `<style>` block through Vite `additionalData`, so `@include respond(phone | tab-port | tab-land | big-desktop)` and `interpolate(...)` work anywhere without an import. The stylesheets still use `@import` (the deprecation warning is silenced on purpose).
- **PWA** (`@vite-pwa/nuxt`): precaches only hashed JS/CSS. Pages are network-first and `_nuxt` images cache-first at runtime. `navigateFallback` is null because there's no SPA shell. Analytics via `nuxt-gtag`, turned off when a build runs with `DISABLE_ANALYTICS=true`, as pull request previews do.
- **Shared state:** `composables/useNav.js` holds the fullscreen-menu open state with `useState`, shared across navbar instances.

### Lambda functions (`functions/`)

Two independent Serverless Framework v4 services (`nodejs24.x`, `ca-central-1`, stage `dev`, CommonJS handlers). They are not part of the root pnpm workspace; each has its own `package.json`. See `functions/README.md` for `sls` commands (`sls invoke local -f <name>`, `sls deploy`, `sls logs`).

- `contact-lambda`: `POST /contact`, sends the contact-form email via SES. It has no dependencies because AWS SDK v3 ships with the Lambda runtime.
- `stripe-lambda`: `POST /stripe`, creates a Stripe PaymentIntent (CAD). It reads `STRIPE_SECRET_KEY` from a git-ignored `functions/stripe-lambda/config.js` (`module.exports = { STRIPE_SECRET_KEY: '…' }`). It has its own lockfile and `nodeLinker: hoisted` because Serverless packages `node_modules` as-is.

The frontend calls these through hard-coded API Gateway URLs in `components/Pages/Home/Contact.vue` (axios) and `components/UI/AppStripe.vue` (fetch). A redeploy that changes an endpoint URL must be mirrored there.

### Deployment

`.github/workflows/main.yml` runs on pushes to `main` (and on manual dispatch). It runs `pnpm generate`, syncs `.output/public` to S3 with `--delete`, and invalidates CloudFront. In parallel it deploys both Lambda functions with Serverless (the `stripe-lambda` job writes `config.js` from the `STRIPE_SECRET_KEY` secret). AWS access uses GitHub OIDC via `AWS_ROLE_ARN`; there are no long-lived keys.

`.github/workflows/preview.yml` deploys each same-repo pull request to `https://pr-<number>.preview.raaedkabir.com` and deletes it when the PR closes. It builds with `DISABLE_ANALYTICS=true`, syncs the build to the `pr-<number>/` folder of a shared preview bucket and uploads `infra/preview/not-found.html` to the bucket root as `404.html`. Its jobs are skipped until the `PREVIEW_BUCKET` and `PREVIEW_AWS_ROLE_ARN` repository variables are set (setup steps in the README).

- `infra/preview/template.yml` is the CloudFormation stack (us-east-1) behind it: a private bucket, a CloudFront distribution with a `*.preview.raaedkabir.com` certificate and DNS records, and a deploy role that only trusts this repo's pull request runs and can only write to that bucket. Production's S3/CloudFront setup isn't in the repo.
- The distribution's viewer-request CloudFront Function (inline in the template) maps `pr-<number>.` hosts to their folder and extension-less paths to `<path>/index.html`. It doesn't cache (Managed-CachingDisabled), so deploys need no invalidation.
- CloudFront fetches custom error pages without running that function, so a missing path in any preview gets the bucket-root `404.html`, which redirects to the PR's own `/404.html`. If that's missing too, the preview doesn't exist and the page says so.
- Previews call the production Lambda endpoints; changes under `functions/` aren't previewed.

### External services

The README's **Dashboards & Consoles** section covers every external service the site, the functions and the deploy pipeline use, in two forms: a table grouped by provider, and a Mermaid diagram of the same services below it. Each row and each diagram node links to the service's console.

- **Keep both in step with the code.** When a change adds or removes a service, update the table and the diagram in the same change. That covers, for example, an AWS service a `serverless.yml` or workflow starts using, or a third-party script or SDK for payments, analytics or email. Do the same when a service moves or is renamed (a region, stage, function or stack name), because the console links and notes name them.
- **Adding a service:** add a table row under its provider, or a new provider group, with the console link and what lives there. In the diagram, add a node in the provider's subgraph, a `click <id> href "<console URL>" _blank` line, and edges that show how a visit reaches it. **Removing one:** delete its row, node, edges and `click` line.
- **GitHub draws the diagram with Mermaid 12's ELK layout**, not Mermaid's default layout. To keep it readable there:
  - Style every subgraph `fill:none,stroke:#8b949e`. Grey fills wash out the text and arrows in dark mode.
  - Don't add an edge that skips past a node in its row (A → C alongside A → B → C). ELK runs it along B's border, where B hides it. Point both sources at the shared target instead, the way CloudFormation and API Gateway both point at Lambda.
  - Split labels longer than about 15 characters with `<br>`. The diagram is already wider than the README column, so GitHub scales it down.
- Check a change by rendering the diagram with `mermaid@12` and `@mermaid-js/layout-elk@1` (`layout: 'elk'`, `theme: 'dark'`) in Playwright's Chromium. That matched GitHub's rendering when the diagram was added.
