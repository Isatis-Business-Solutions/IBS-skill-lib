#!/usr/bin/env bash
# Builds one zip per skill in dist/, ready to upload in the Claude app (Settings → Skills).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist && mkdir -p dist
for dir in skills/*/; do
  name=$(basename "$dir")
  [ -f "$dir/SKILL.md" ] || continue
  (cd skills && zip -qr "../dist/$name.zip" "$name" -x '*.DS_Store')
  echo "dist/$name.zip"
done
