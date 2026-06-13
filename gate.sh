#!/usr/bin/env bash
# Học viện Steve — gate runner. Exit 0 only if all engine gates are green.
set -e
cd "$(dirname "$0")"
OUT="$(node gate.js)"
echo "$OUT"
echo "$OUT" | grep -q "ALL GATES GREEN" || { echo "GATES RED"; exit 1; }
