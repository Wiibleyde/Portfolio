# NextAuth with Discord & Prisma Setup

## Setup Instructions

### 1. Configure Environment Variables

Fill in your `.env` file with the required values:

```bash
# Generate a NextAuth secret
openssl rand -base64 32
```

### 2. Create Discord OAuth Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "OAuth2" section
4. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
5. Copy your Client ID and Client Secret to `.env`
6. Get Discord User IDs to allow:
   - Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
   - Right-click on users and select "Copy User ID"
   - Add comma-separated IDs to `ALLOWED_DISCORD_IDS` in `.env`

### 3. Run Database Migrations

```bash
bunx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
bunx prisma generate
```

### 5. Start Development Server

```bash
bun dev
```

## Usage in Components

### Server Components

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome {session.user?.name}!</div>;
}
```

### Client Components

```tsx
"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <button onClick={() => signIn("discord")}>Sign in with Discord</button>
  );
}
```

## Features

- ✅ NextAuth v5 (beta) with Discord OAuth
- ✅ Prisma database adapter
- ✅ User allowlist by Discord ID
- ✅ Session management with database storage
- ✅ TypeScript support

## Database Schema

The setup includes:

- `User`: User accounts
- `Account`: OAuth provider accounts
- `Session`: Active user sessions
- `VerificationToken`: Email verification tokens
