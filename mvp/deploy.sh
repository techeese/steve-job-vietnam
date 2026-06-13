#!/usr/bin/env bash
# Deploy ONLY the mvp/ folder from the dev branch onto main → live at /steve-job-vietnam/mvp/.
# Never carries the rest of the dev branch to main, so it can't collide with the other
# session's files. Run from a clean working tree.
set -e
cd "$(dirname "$0")/.."

DEV="$(git branch --show-current)"
if [ "$DEV" = "main" ]; then echo "Refusing to deploy from main; run on the dev branch."; exit 1; fi
if [ -n "$(git status --porcelain)" ]; then echo "Working tree dirty — commit on $DEV first."; exit 1; fi

echo "› Gating mvp/ before deploy…"
node mvp/gate-run.js

echo "› Syncing mvp/ from $DEV onto main…"
git fetch origin main -q
git checkout main
git pull --rebase origin main -q || true
git checkout "$DEV" -- mvp/
if git diff --cached --quiet && git diff --quiet; then
  echo "  nothing to deploy (main already current)."
else
  git add mvp/
  git commit -q -m "deploy: sync mvp/ from $DEV → /steve-job-vietnam/mvp/"
  for i in 1 2 3 4; do git push origin main && break; echo "  retry $i"; sleep $((2 ** i)); done
fi
git checkout "$DEV"
echo "✓ deployed. Live (after Pages rebuild): https://techeese.github.io/steve-job-vietnam/mvp/"
