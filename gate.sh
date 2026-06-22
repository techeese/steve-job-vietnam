#!/usr/bin/env bash
# Học viện Steve — gate runner. Exit 0 only if all engine gates are green.
set -e
cd "$(dirname "$0")"
OUT="$(node gate.js)"
echo "$OUT"
echo "$OUT" | grep -q "ALL GATES GREEN" || { echo "GATES RED"; exit 1; }
# Phase 0 (EDUCATION epic): realization-baseline snapshot — catches silent rate regressions gate.js (determinism-only) can't.
BL="$(node baseline.js)"
echo "$BL"
echo "$BL" | grep -q "BASELINE GREEN" || { echo "BASELINE RED"; exit 1; }
