#!/usr/bin/env bash
# Build the upload-ready archive for HostGator/cPanel.
#   ./tools/pack.sh   ->  jollofliving-hostgator.zip in the repo root
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="jollofliving-hostgator.zip"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

node tools/build_php.mjs >/dev/null   # refresh assets/site.css + site.js
node tools/gen_pages.mjs  >/dev/null  # refresh the .php pages

cp -r public_html database "$TMP"/
cp DEPLOYMENT.md README.md "$TMP"/
# never ship local secrets or installer state
rm -f "$TMP/public_html/includes/config.php" "$TMP/public_html/install/installed.lock"
find "$TMP" -name '.DS_Store' -delete

rm -f "$OUT"
( cd "$TMP" && zip -qr - . ) > "$OUT"
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
