#!/usr/bin/env bash
# Builds one zip per skill in dist/, ready to upload in the Claude app (Settings → Skills).
# Pass --drafts to also build the skills in drafts/ (for testing; not published).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist && mkdir -p dist
roots=(skills)
[ "${1:-}" = "--drafts" ] && roots+=(drafts)
for root in "${roots[@]}"; do
  for dir in "$root"/*/; do
    name=$(basename "$dir")
    [ -f "$dir/SKILL.md" ] || continue
    (cd "$root" && zip -qr "../dist/$name.zip" "$name" -x '*.DS_Store')
    echo "dist/$name.zip"
  done
done
