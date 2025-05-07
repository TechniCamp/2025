# To use this Dockerfile, keep `output: 'standalone'` in next.config.mjs
# ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# ---------- deps ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm i -g corepack@latest
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ---------- builder ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ‹-- BUILD-TIME env that Next.js must see --›
ARG NEXT_PUBLIC_WHISHPER_API
ENV NEXT_PUBLIC_WHISHPER_API=$NEXT_PUBLIC_WHISHPER_API

RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ---------- runtime ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone         ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
