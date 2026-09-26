This is a [Next.js](https://nextjs.org) project bootstrapped with https://www.tokenmaker.one

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open the local development URL shown in your terminal after starting the dev server.

## Google Analytics

Google Analytics has been wired into the shared app layouts.

- Analytics loads only in production builds.
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in your production environment to enable it.

## Contact Email

The contact form posts to `/api/contact` and sends email through the Resend Email API.

Set these environment variables in `.env.local` for development and in your production host:

```bash
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL="Token Maker <contact@yourdomain.com>"
CONTACT_TO_EMAIL="you@example.com"
CONTACT_SUBJECT_PREFIX="Token Maker contact"
```

`RESEND_FROM_EMAIL` should use a domain verified in Resend. `CONTACT_TO_EMAIL` is the inbox that receives user messages. The user's submitted email is sent as the reply-to address.

## Request Rate Limiting

The shared request limiter requires these environment variable names in development and production:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Share Dialog Storage

The download share dialog uploads the generated PNG token to Cloudflare R2 and returns a `/share/{id}` page URL. Configure these variables in `.env.local` for development and in production:

```bash
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=tokenmaker-shares
R2_PUBLIC_BASE_URL=https://r2.tokenmaker.one
NEXT_PUBLIC_SITE_URL=https://www.tokenmaker.one
```

R2 setup requirements:

- Create the `tokenmaker-shares` bucket.
- Bind the public custom domain `r2.tokenmaker.one`.
- Add a lifecycle rule that deletes `shares/*` objects after 30 days.
- The app stores generated share images at `shares/{id}.png` and serves them with a 30-day immutable cache header.

## Vinext / Cloudflare Workers release checks

`dev`, `build`, and `start` remain Next.js commands for local development. The
Cloudflare production build uses Vinext:

```bash
pnpm run check:vinext
pnpm run dev:vinext
pnpm run build:vinext
```

`pnpm run build:vinext` executes these gates sequentially and stops at the first
nonzero exit:

1. `pnpm lint` checks source and configuration, excluding generated `dist/` files.
2. `pnpm typecheck` runs `next typegen` followed by `tsc --noEmit`. This regenerates
   Next's route validators before checking all application and test TypeScript;
   it does not run `next build` or replace the Vinext production output.
3. `pnpm test` runs the complete Vitest suite.
4. `pnpm check:workers-types` checks the committed Worker binding declarations.
5. `vinext build` produces the Worker and client assets.
6. `pnpm check:workers-build` runs Wrangler's deploy dry-run using
   `dist/server/wrangler.json`. It validates packaging without uploading.

The Cloudflare Worker `token-maker-app` is connected to `wsir78933-rgb/token-maker`
on `main`. Its build command is `pnpm run build:vinext`; its subsequent deploy
command is `npx wrangler deploy --config dist/server/wrangler.json`, and its version
upload command is `npx wrangler versions upload --config dist/server/wrangler.json`.
The checks are therefore in the Cloudflare build command itself. A failure stops
that build before Cloudflare can run its subsequent deploy/version command.
GitHub CI passing alone does not establish that Cloudflare ran these checks.

`pnpm deploy:workers` and `pnpm upload:workers-preview` also run `build:vinext`
before their upload command. These commands write to Cloudflare; running the
build, dry-run, or local preview alone does not deploy anything.

### Worker binding types

Use the matching generation and freshness-check commands:

```bash
pnpm types:workers
pnpm check:workers-types
```

Both use `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false` and
`wrangler types --config wrangler.jsonc --include-runtime=false`; the check adds
`--check`. This keeps local `.env` files out of generated declarations. A local
`.dev.vars` file can still affect Wrangler's generated bindings; keep this gate
in a clean checkout without that file. Bare `wrangler types --check` does not
set these options and can fail when local `.env` files differ from CI.

`worker-configuration.d.ts` is generated only by Wrangler. The small
`cloudflare-bindings.d.ts` declaration imports the existing
`@cloudflare/workers-types` binding types and types the application's
`cloudflare:workers` `env` import. It avoids merging Worker runtime globals such
as HTMLRewriter's `Element` with browser DOM types. All source and test files
remain included in the application type check.

### Coverage and browser verification

GitHub's `quality.yml` runs the same `pnpm run build:vinext` chain, then the full
coverage check with the existing thresholds (branches 65%, functions/lines/
statements 75%). It installs Chromium and its system dependencies using the
existing Playwright CLI before running `pnpm test:e2e`.

Playwright starts `pnpm preview:workers`, which serves the just-built
`dist/server/wrangler.json` with Wrangler locally on `127.0.0.1:40001`, with remote
bindings disabled. It refuses to reuse an existing server, so an unrelated
Next.js server cannot satisfy this check. For local browser verification after
building, run `pnpm test:e2e` with Chromium installed, or use
`pnpm preview:workers` for manual browser checks; port 40001 must be free.

Cloudflare Builds does not run coverage or browser E2E in this configuration.
Its documented build image does not guarantee an installed browser, so no
automatic system-library installation or browser availability is assumed there.
Browser and coverage results remain GitHub/local checks, not Cloudflare deploy
gates. Dry-run success proves packaging, not production runtime behavior or
remote binding availability.

`vite.config.ts` retains the App Router Cloudflare integration.
`wrangler.jsonc` declares `SHARE_BUCKET` for `tokenmaker-shares`,
`SHARE_RATE_LIMITER` (20 calls per 60 seconds, namespace `1001`), and
`CONTACT_RATE_LIMITER` (5 calls per 60 seconds, namespace `1002`).

References: [Cloudflare build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/),
[build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/),
[Worker TypeScript](https://developers.cloudflare.com/workers/languages/typescript/),
and [Playwright CI setup](https://playwright.dev/docs/ci).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

This repository is source-available under the [Token Maker Personal
Non-Commercial License](./LICENSE).

Individuals may view, run, fork, modify, and share the original code only for
personal, non-commercial purposes, with attribution and under the same license.
Commercial, organizational, employer, client, paid hosting, advertising, and
subscription use are prohibited. Third-party materials remain subject to their
own licenses.

本仓库以《Token Maker 个人非商业许可证》公开源码。个人可以在保留署名、
附带相同许可证的前提下，为个人非商业用途查看、运行、Fork、修改和分享代码。
禁止商业用途、组织/公司用途、雇主或客户项目、付费托管、广告和订阅用途。
第三方字体、素材、商标等仍分别适用其原有许可证。

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
