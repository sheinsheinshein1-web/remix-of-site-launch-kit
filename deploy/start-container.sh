#!/bin/sh
set -eu

echo "[startup] serving /srv on 0.0.0.0:8080"
exec /usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
