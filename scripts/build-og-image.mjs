#!/usr/bin/env node
// Build public/og/default.jpg (1200×630) from a source photo + gradient + text overlay.
// Run: node scripts/build-og-image.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const SRC = "scripts/og-assets/og-source.jpg";
const OUT = "public/og/default.jpg";
const W = 1200;
const H = 630;

const TITLE = "многоместа.рф";
const SUBTITLE = "Маркетплейс модульных и префаб домов";

const svgOverlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000" stop-opacity="0"/>
      <stop offset="55%"  stop-color="#000" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.75"/>
    </linearGradient>
    <style>
      .t { font-family: 'Rubik', 'Helvetica Neue', Arial, sans-serif; fill: #ffffff; }
      .title { font-size: 88px; font-weight: 700; letter-spacing: -2px; }
      .sub   { font-size: 36px; font-weight: 400; opacity: 0.92; }
      .badge { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 600; fill: #ffffff; letter-spacing: 2px; }
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>

  <!-- top-left badge -->
  <rect x="48" y="44" width="78" height="40" rx="8" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
  <text x="87" y="72" class="badge" text-anchor="middle">РФ</text>

  <!-- bottom-centered title block -->
  <text x="${W / 2}" y="${H - 110}" class="t title" text-anchor="middle">${TITLE}</text>
  <text x="${W / 2}" y="${H - 60}"  class="t sub"   text-anchor="middle">${SUBTITLE}</text>
</svg>
`;

async function main() {
  await mkdir(dirname(OUT), { recursive: true });

  const base = await sharp(SRC)
    .resize(W, H, { fit: "cover", position: "centre" })
    .toBuffer();

  const overlay = Buffer.from(svgOverlay);

  await sharp(base)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`✓ ${OUT} — ${meta.width}×${meta.height}, ${(meta.size / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
