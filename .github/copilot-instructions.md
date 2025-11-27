# Portfolio - AI Coding Agent Instructions

## Project Overview

Next.js 16 portfolio application with Discord-based authentication and PostgreSQL database. Uses React 19 with React Compiler enabled, NextAuth.js v5 (beta), Prisma v7, and Biome for linting/formatting.

## Architecture & Key Patterns

### Authentication Flow (NextAuth.js v5)

- **Discord-only authentication** via `auth.config.ts` and `auth.ts`
- **Whitelist-based access**: Only users with `discordId` in database can sign in (see `auth.ts` signIn callback)
- **JWT strategy** with custom session data (`discordId`, username, avatar from Discord)
- **Protected routes**: `/admin/*` requires authentication via `middleware.ts` using NextAuth middleware
- Custom pages: `/auth/signin` and `/auth/error` (defined in `auth.config.ts`)

**Pattern**: When adding admin features, check `auth.ts` callbacks for how Discord profile data flows into session.

### Database Setup (Prisma v7)

- **Requires PostgreSQL adapter**: `lib/prisma.ts` uses `@prisma/adapter-pg` and `pg` Pool (v7 requirement)
- **Configuration**: Prisma v7 uses `prisma.config.ts` instead of env vars in schema
- **Single table**: `User` model with `discordId` unique constraint for authentication
- **Connection pooling**: Global singleton pattern in `lib/prisma.ts` prevents connection exhaustion in dev

**Pattern**: Always import `prisma` from `@/lib/prisma`, never instantiate directly.

### Path Aliases

- `@/*` maps to project root (see `tsconfig.json`)
- Use for imports: `@/auth`, `@/lib/prisma`, `@/types/next-auth`

## Development Workflow

### Essential Commands

```bash
bun dev                 # Start dev server (port 3000)
bun run lint            # Run Biome linting
bun run format          # Auto-format with Biome
bun run db:migrate      # Run Prisma migrations (requires .env)
bun run db:generate     # Generate Prisma Client
bun run db:studio       # Open Prisma Studio
```

**Runtime**: This project uses **Bun** (see scripts with `bun --env-file=.env`)

### Code Quality Tools

- **Biome** (not ESLint/Prettier): 4-space indentation, Next.js and React rules enabled
- Config: `biome.json` with Next.js domain linting and auto-import organization
- Run format before committing

## TypeScript Conventions

### Type Extensions

- NextAuth types extended in `types/next-auth.d.ts` to add `discordId` to Session and JWT
- **Pattern**: When accessing `session.user.discordId`, the type is already defined

### React Server Components

- All pages are Server Components by default (App Router)
- `app/admin/page.tsx` shows async component pattern with `auth()` call
- Server actions use `"use server"` directive (see sign-out form in admin page)

## Next.js 16 Specifics

### React Compiler Enabled

- `next.config.ts` has `reactCompiler: true`
- Automatic memoization - avoid manual `useMemo`/`useCallback` unless necessary

### Image Configuration

- Remote patterns configured for Discord CDN avatars (`cdn.discordapp.com/avatars/**`)
- Use Next.js `<Image>` component for Discord profile pictures

## Adding New Features

### Adding Protected Routes

1. Update `middleware.ts` config matcher if not under `/admin`
2. Use `auth()` in Server Component to check session
3. Redirect unauthorized users: `redirect("/api/auth/signin")`

### Adding Admin Users

1. Insert user with Discord ID into database:
   ```sql
   INSERT INTO "User" ("id", "discordId") VALUES (gen_random_uuid(), 'DISCORD_ID');
   ```
2. Or add database seed in `prisma/seed.ts`

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `bun run db:migrate` (creates migration + generates client)
3. Migrations stored in `prisma/migrations/`

## Common Gotchas

- **Prisma v7**: Must use adapter pattern in `lib/prisma.ts`, direct client instantiation won't work
- **NextAuth v5**: Still in beta, use `next-auth@^5.0.0-beta` packages
- **Discord auth**: Users must exist in DB before signing in (whitelist approach)
- **Environment**: `.env` file required for `DATABASE_URL` (not tracked in git)
- **Middleware**: Only runs on routes matching `config.matcher`, doesn't execute globally

## Testing Strategy

### Current State

- No test suite implemented yet
- Future testing should follow these principles:
  - **Unit tests**: Individual utility functions and helpers in `/lib`
  - **Integration tests**: Database operations and Prisma queries
  - **E2E tests**: Authentication flow and protected routes
  - Consider Vitest for unit/integration, Playwright for E2E

### When Adding Tests

- Test critical auth flows (whitelist check, JWT token creation)
- Test database operations (User creation, queries)
- Mock Discord OAuth responses in tests
- Ensure tests don't require actual database (use test DB or mocks)

## Code Quality Standards

### Biome Enforcement

- **ALWAYS run `bun run format` before committing** - Biome auto-formats to 4-space indentation
- **Run `bun run lint` to catch issues** - Biome checks Next.js and React best practices
- Biome auto-organizes imports - don't manually sort them
- If Biome flags an issue, fix it immediately rather than suppressing

### Clean Code Principles

- **Self-documenting code**: Write clear variable/function names that explain intent
- **NO excessive comments**: Code should be understandable without line-by-line explanations
- **Comments only for "why", not "what"**: Explain non-obvious decisions, not basic logic

  ```typescript
  // ❌ BAD: Increment counter by 1
  counter++;

  // ✅ GOOD: Force re-render to sync with Discord profile changes
  setRefreshKey((prev) => prev + 1);
  ```

- **Small, focused functions**: Each function does one thing well
- **Meaningful abstractions**: Extract reusable logic, but avoid premature optimization
- **Consistent patterns**: Follow existing code structure (see `lib/prisma.ts` singleton, `auth.ts` callbacks)

### Documentation Practices

- **DO NOT create markdown files for features** unless explicitly requested
- **DO NOT write feature documentation** in separate docs
- Code changes should speak for themselves through:
  - Clear function/variable names
  - Logical file organization
  - Consistent patterns with existing code
- Only document architectural decisions or complex "why" explanations in this file

### TypeScript Best Practices

- Use strict TypeScript - no `any` types without justification
- Leverage existing type extensions in `types/next-auth.d.ts`
- Define interfaces for complex data structures
- Use type inference where types are obvious

### Design & UX Style

- **Terminal/Tech/Geek aesthetic**: Portfolio should feel like a developer's workspace
- Prefer monospace fonts, command-line inspired interfaces, terminal-like color schemes
- Use tech-forward design elements: matrix-style effects, CLI prompts, code-like formatting
- Consider ASCII art, glitch effects, cyber aesthetics where appropriate
- UI should reflect the technical nature of the content (developer portfolio)
- Examples: Terminal-style navigation, code editor themes, hacker/dev culture references

## File Organization

- `/app` - Next.js App Router pages and API routes
- `/lib` - Shared utilities (Prisma client)
- `/prisma` - Schema, migrations, seed
- `/types` - TypeScript type extensions
- Root config files: `auth.config.ts` (NextAuth providers), `auth.ts` (NextAuth instance)
