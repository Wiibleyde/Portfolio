# Portfolio

Portfolio de Nathan Bonnell — Next.js, React, TailwindCSS, TypeScript. Gestionnaire de paquets et runtime : [Bun](https://bun.sh).

```bash
bun install
bun dev          # http://localhost:3000
bun run build
bun run lint     # biome check
```

## Variables d'environnement

- `DISCORD_WEBHOOK_URL` — webhook recevant les messages du formulaire de contact

## Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
```
