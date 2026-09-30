#!/bin/sh
# Exercise the initial HTTP response, without JavaScript. Run against Caddy,
# not the Vite dev server. Also runs inside every production image build.
set -eu

base_url=${1:-http://127.0.0.1:8080}
headers=$(mktemp)
trap 'rm -f "$headers"' EXIT HUP INT TERM

request() {
  if command -v curl >/dev/null 2>&1; then
    curl -sS --max-time 15 -D "$headers" -o /dev/null "$base_url$1" || true
  else
    wget -T 15 -t 1 -S -O /dev/null "$base_url$1" 2>"$headers" || true
  fi
}

check() {
  path=$1
  expected_status=$2
  expected_robots=$3
  request "$path"
  status=$(awk '/^[[:space:]]*HTTP\// { code=$2 } END { print code }' "$headers")
  robots=$(awk 'tolower($1)=="x-robots-tag:" { $1=""; sub(/^[[:space:]]+/, ""); sub(/\r$/, ""); print }' "$headers")
  if [ "$status" != "$expected_status" ] || [ "$robots" != "$expected_robots" ]; then
    printf 'FAIL %s: status=%s robots="%s"; expected %s "%s"\n' "$path" "$status" "$robots" "$expected_status" "$expected_robots" >&2
    exit 1
  fi
  printf 'PASS %s (%s; robots="%s")\n' "$path" "$status" "$robots"
}

check_redirect() {
  request "$1"
  status=$(awk '/^[[:space:]]*HTTP\// { print $2; exit }' "$headers")
  location=$(awk 'tolower($1)=="location:" { $1=""; sub(/^[[:space:]]+/, ""); sub(/\r$/, ""); print; exit }' "$headers")
  if [ "$status" != '301' ] || [ "$location" != "$2" ]; then
    printf 'FAIL redirect %s: %s to %s; expected 301 to %s\n' "$1" "$status" "$location" "$2" >&2
    exit 1
  fi
  printf 'PASS redirect %s -> %s\n' "$1" "$location"
}

check /health 200 ''
check / 200 ''
check /modulnye-doma/ 200 ''
check /modulnye-doma/do-3-mln/ 200 ''
check /modulnye-doma/50-80-m2/ 200 ''
check /modulnye-doma/ekaterinburg/ 200 ''
check /modulnye-bani/ 200 ''
check /proizvoditeli/platforma/ 200 ''
check /modulnye-doma/proekty/platforma-bear-house-86-69-m2-36/ 200 ''
check /modulnye-doma/proekty/platforma-wide-house-46-m2-32/ 200 ''
check_redirect /modulnye-doma/proekty/platforma-wide-house-57-m2-32/ /modulnye-doma/proekty/platforma-wide-house-46-m2-32/
check_redirect '/project/32?utm_source=test' '/modulnye-doma/proekty/platforma-wide-house-46-m2-32/?utm_source=test'
check '/modulnye-doma/proekty/platforma-bear-house-86-69-m2-36/?utm_source=test' 200 ''
check '/modulnye-doma/?maxPrice=3000000' 200 'noindex, follow'
check '/modulnye-doma/?minArea=50&maxArea=80' 200 'noindex, follow'
check '/modulnye-doma/?q=house' 200 'noindex, follow'
check '/modulnye-doma/do-3-mln/?beds=2' 200 'noindex, follow'
check '/modulnye-doma/ekaterinburg/?maxPrice=3000000' 200 'noindex, follow'
check '/modulnye-bani/?minArea=20' 200 'noindex, follow'
# Existing client policy noindexes all query states, including tracking tags.
check '/modulnye-doma/?utm_source=test' 200 'noindex, follow'
check /messages 200 'noindex, nofollow'
check /messages/ 200 'noindex, nofollow'
check /favorites 200 'noindex, nofollow'
check /profile 200 'noindex, nofollow'
check /requests 200 'noindex, nofollow'
check /operator 200 'noindex, nofollow'
check /lab 200 'noindex, nofollow'
check /robots.txt 200 ''
check /sitemap.xml 200 ''
check /placeholder.svg 200 ''
check /seo-regression-missing-route/ 404 ''
