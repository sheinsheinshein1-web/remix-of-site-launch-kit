#!/bin/sh
set -eu

echo "[startup] serving /srv on 0.0.0.0:8080"

/usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
caddy_pid=$!

stop_caddy() {
	kill -TERM "$caddy_pid" 2>/dev/null || true
	wait "$caddy_pid" 2>/dev/null || true
}

trap stop_caddy TERM INT

# Prove in the runtime logs that the exact endpoint used by Timeweb is
# reachable after the real container starts, not only during image build.
attempt=0
until wget -q -O - http://127.0.0.1:8080/health | grep -qx ok; do
	attempt=$((attempt + 1))
	if [ "$attempt" -ge 30 ]; then
		echo "[startup] runtime health self-check failed" >&2
		stop_caddy
		exit 1
	fi
	sleep 1
done

echo "[startup] runtime health self-check passed"
wait "$caddy_pid"
