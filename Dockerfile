FROM node:20-bookworm-slim AS build

WORKDIR /app

ENV CI=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN corepack enable \
    && corepack prepare pnpm@10.15.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile \
    && pnpm exec playwright install --with-deps chromium

COPY . .

RUN pnpm build

FROM caddy:2-alpine AS runtime

COPY deploy/Caddyfile.container /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=12 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
