<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio — Nathan Bonnell

Personal portfolio (French content) with a few client-side tools. Next.js App Router, React 19, TypeScript (strict), Tailwind CSS 4, GSAP. Package manager and production runtime: **Bun**.

## Commands

```bash
bun install
bun dev            # dev server (Turbopack)
bun run build      # production build
bun run lint       # biome check (lint + format), must pass
bun run check      # biome check --write (auto-fix)
```

There is no test framework; verify UI changes in a browser (desktop and ~375px mobile).

## Layout

```
src/
  app/
    page.tsx              # home: Hero, Presentation, Timeline, Projects, Contact, Footer
    api/contact/route.ts  # contact form → Discord webhook
    tools/                # qrcode, vcard, pdfAssembler (100% client-side)
    not-found.tsx         # real 404 page
    eve/, lyp/, legal-mentions/
  components/
    HomePage/             # home sections, SectionHeading, ProjectCard
    tools/                # ToolPageLayout + tool UI pieces
    reactbits/            # vendored React Bits components, see their README
  hooks/  lib/  types.ts
```

Imports use the aliases `@/*` (src) and `@public/*` (public assets), not long relative paths.

## Design system

- Dark, neutral and restrained: `zinc` palette, one accent color (`--color-accent` in `src/app/globals.css`), 1px borders, Geist / Geist Mono.
- Shared utilities in `globals.css`: `card`, `btn` + `btn-primary` / `btn-secondary`, `input`, `tag`, `eyebrow`. Reuse them instead of re-styling.
- Avoid generic "AI-generated" patterns: purple/blue gradients, glassmorphism, glow on everything, numbered "01 —" section labels, pulsing badges, fade-up on every element, filler copy, placeholder names like "John Doe".
- Motion must have a purpose (project filter FLIP transitions, scroll-linked timeline) and respect `prefers-reduced-motion`.
- Pages must not scroll horizontally on mobile (check 320px and 375px).

## React Bits components

`src/components/reactbits/` is third-party code from reactbits.dev, kept as-is so it can be re-synced; it is excluded from Biome. Local patches are listed in that folder's README.

## Contact form

- The client validates fields and sends a hidden honeypot field (`website`).
- `/api/contact` silently drops honeypot hits, rate-limits per IP (5 per 10 min, in memory, single instance), validates input against Discord embed limits and posts to `DISCORD_WEBHOOK_URL`.
- No Google services (no reCAPTCHA, Analytics or Tag Manager). Analytics: self-hosted Umami via `next/script` in `src/app/layout.tsx`.

## Environment

- `DISCORD_WEBHOOK_URL`: required for the contact form.
- `IS_DOCKER=true`: enables `output: 'standalone'` (set in the Dockerfile).

## Deployment

The multi-stage Dockerfile builds with Bun and runs `bun server.js` (standalone output) as a non-root user on port 3000. `.github/workflows/docker.yml` builds on every push to `main` and pushes to `ghcr.io` with `latest` and timestamp tags.

## Git

Don't add AI attribution (e.g. `Co-Authored-By`) to commits or PRs.
