# Portfolio - Copilot Instructions

## Project Overview

This is Nathan Bonnell's personal portfolio built with **Next.js 15 (App Router)**, featuring a multi-purpose site with:

- Portfolio homepage with projects, timeline, and contact form
- Twitch integration tools (chat, overlays, admin panels)
- Utility tools (QR code generator, PDF assembler, vCard generator)
- Dedicated sections for various projects (Hope Pictures, SABS, Eve, etc.)

## Architecture & Tech Stack

### Core Technologies

- **Next.js 15.5** with App Router and Turbopack for dev server
- **React 19** with TypeScript (strict mode enabled)
- **TailwindCSS 4** for styling
- **GSAP** for animations and scroll effects
- **Three.js + OGL** for WebGL effects
- **Framer Motion** for advanced animations
- **Yarn** as package manager (v1.22.22)

### Key Dependencies

- `nodemailer` - Email sending for contact form
- `ws` - WebSocket for Twitch chat integration
- `pdf-lib` + `pdfjs-dist` - PDF manipulation
- `qrcode-with-logos` - QR code generation
- `react-google-recaptcha-v3` - Bot protection
- `swr` - Data fetching
- `markdown-to-jsx` - Markdown rendering

## Project Structure Patterns

### File Organization

```
src/
  app/               # Next.js App Router pages
    api/v1/         # API routes (versioned)
    [feature]/      # Feature-specific page groups
  components/
    HomePage/       # Landing page components
    twitch/         # Twitch overlay components
    UI/             # Reusable WebGL/animation components
  hooks/            # Custom React hooks
  lib/              # Utility libraries and managers
```

### Path Aliases

- `@/*` → `./src/*` - All source files
- `@public/*` → `./public/*` - Public assets (images, files)

**Always use these aliases** for imports. Example:

```typescript
import { Project } from '@/types';
import Logo from '@public/img/projects/logo.png';
```

## Component Conventions

### Client vs Server Components

- **Most components are client-side** (`'use client'` directive)
- Use `'use server'` only for server actions (e.g., `src/captcha.ts`)
- API routes are server-side by default
- Layouts can be server components unless they need client state

### Animation Patterns

All animated components follow this pattern:

1. Use `useRef` for DOM references
2. Set initial invisible state with `gsap.set()` in first `useEffect`
3. Use `IntersectionObserver` to trigger animations on scroll
4. Create `gsap.timeline()` for sequenced animations
5. Cleanup observers on unmount

Example from `Projects.tsx`:

```typescript
const titleRef = useRef<HTMLDivElement>(null);
const [isVisible, setIsVisible] = useState(false);

// Initial state
useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0, y: 30 });
}, []);

// Intersection observer
useEffect(() => {
    const observer = new IntersectionObserver(/* ... */);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
}, [isVisible]);
```

### Styling Conventions

- Use **TailwindCSS utility classes** exclusively
- Custom CSS limited to `globals.css` and feature-specific `.css` files
- Gradient patterns: `from-slate-900 via-blue-900/20 to-purple-900/30`
- Glassmorphism: `bg-white/10 backdrop-blur-md border border-white/20`
- Spacing: Use GSAP for complex animations, Tailwind for simple transitions

## TypeScript Patterns

### Type Definitions

All shared types live in `src/types.ts`:

```typescript
export enum ProjectType {
    School = 'École',
    Personal = 'Personnel',
    Professional = 'Professionnel',
}

export interface Project {
    title: string;
    description: string;
    type: ProjectType;
    url?: string;
    repoUrl?: string;
    image: string;
    tags: string[];
}
```

### Configuration

- `target: ES2017` for broad compatibility
- Strict mode enabled
- Module resolution: `bundler` (Next.js optimized)

## API & Integration Patterns

### API Route Structure

Routes are versioned under `/api/v1/`:

- `contact/route.ts` - Contact form submission via nodemailer
- `twitch/auth/route.ts` - Twitch OAuth flow
- `twitch/chat/route.ts` - Twitch chat WebSocket proxy
- `hope/pictures/find/route.ts` - Feature-specific APIs

### Twitch Integration

- **Token Manager** (`src/lib/twitchTokenManager.ts`) - Singleton pattern for OAuth token refresh
- Stores tokens in `.twitch-token.json` (gitignored)
- Validates and auto-refreshes tokens before expiry
- Custom hook `useTwitchChatClient` for IRC WebSocket connections

### Environment Variables

Critical variables (example from code):

- `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` - OAuth
- `TWITCH_USER_TOKEN`, `TWITCH_REFRESH_TOKEN` - User auth
- `RECAPTCHA_SECRET_KEY` - Server-side captcha validation
- `BURNER_PASSWORD`, `NEXT_PUBLIC_BURNER_USERNAME` - Email config
- `IS_DOCKER=true` - Enables standalone build mode

## Development Workflow

### Commands

```bash
yarn dev          # Start dev server with Turbopack
yarn build        # Production build
yarn start        # Run production server
yarn lint         # ESLint check
yarn format       # Prettier format all TS/TSX files
```

### Docker Build & Deployment

- Dockerfile uses multi-stage build (deps → builder → runner)
- Sets `IS_DOCKER=true` env var to enable standalone output
- Runs as non-root user `nextjs:nodejs` (UID/GID 1001)
- Exposes port 3000

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/docker.yml`) automatically:

1. **Triggers** on push to `main` branch
2. **Builds** Docker image with timestamp tag and `latest` tag
3. **Publishes** to GitHub Container Registry (`ghcr.io`)
4. **Tags format**: `ghcr.io/wiibleyde/portfolio:latest` and `ghcr.io/wiibleyde/portfolio:<timestamp>`
5. Uses `GITHUB_TOKEN` for authentication (automatic, no manual setup needed)

**Note**: Pull requests to `main` do NOT trigger builds (commented out in workflow)

### Image Optimization

Next.js image component configured for:

- `static-cdn.jtvnw.net` (Twitch)
- `cdn.frankerfacez.com`, `cdn.betterttv.net` (Emotes)
- `nathan.bonnell.fr`, `media.discordapp.net` (Custom assets)

## Special Features

### WebGL Components

`src/components/UI/` contains custom WebGL shaders:

- `Iridescence.tsx` - Animated rainbow effect using OGL
- `Hyperspeed.tsx` - Postprocessing effects
- All use canvas refs, handle resize events, cleanup on unmount

### Twitch Chat Parser

`useTwitchChatClient` hook parses raw IRC messages:

- Extracts badges (subscriber, moderator, etc.)
- Parses emote positions for rendering
- Detects subscriptions and gift subs
- Stores last subscriber in localStorage + syncs to API

### Contact Form Flow

1. Frontend validates with reCAPTCHA v3 (`react-google-recaptcha-v3`)
2. Server action `verifyCaptchaAction` validates score > 0.5
3. API route `/api/v1/contact` sends email via nodemailer (OVH SMTP)
4. Password stored with `||` replaced by `$` in env var

## Common Pitfalls & Solutions

### Animation State Management

- Always check `isAnimating` flag before triggering new animations
- Use separate `displayedFilter` vs `activeFilter` states for smooth transitions
- Call `gsap.set()` in separate `useEffect` from `IntersectionObserver`

### Import Resolution

- Use `@/` prefix for source files, `@public/` for assets
- Never use relative paths like `../../components/`
- Image imports get `.src` property (Next.js optimized images)

### Server vs Client Boundaries

- Server actions must be in separate files with `'use server'`
- Don't call server actions directly from client components without proper error handling
- API routes handle their own error responses (return `NextResponse.json`)

### Twitch Token Management

- Always call `getValidToken()` before Twitch API requests
- Token manager handles refresh automatically if within 5min of expiry
- Fallback to env vars if `.twitch-token.json` doesn't exist

## Metadata & SEO

- Server components in `layout.tsx` define metadata
- Uses OpenGraph and Twitter cards
- French content by default (`description` in French)
- Google Analytics + Tag Manager in `ClientLayout` (client-side only)

## Testing & Debugging

- No test framework currently configured
- Use browser DevTools for GSAP animation debugging
- Check terminal for API route errors (nodemailer, Twitch API)
- Verify token refresh logs in console when Twitch features are used
