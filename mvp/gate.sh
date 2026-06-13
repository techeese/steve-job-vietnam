#!/usr/bin/env bash
# Headless gates for the mvp/ build of Học viện Steve (jsdom; no Chrome in cloud).
set -e
cd "$(dirname "$0")/.."
node mvp/gate-run.js
