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

FROM caddy:2-alpine AS caddy-runtime

# Use a clean Alpine runtime instead of the Caddy image as the final stage.
# The Caddy image exposes 80, 443, 443/udp and 2019; together with our 8080
# Timeweb discovers five ports and cannot reliably select the application port.
FROM alpine:3.22 AS runtime

RUN apk add --no-cache ca-certificates wget

COPY --from=caddy-runtime /usr/bin/caddy /usr/bin/caddy

COPY deploy/Caddyfile.container /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 8080

# Fail the image build before deployment if Caddy cannot load the production
# config or if Timeweb's health endpoint is shadowed by another route.
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile \
    && caddy start --config /etc/caddy/Caddyfile --adapter caddyfile \
    && wget -q -O - http://127.0.0.1:8080/health | grep -qx ok \
    && caddy stop

ENTRYPOINT ["caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
