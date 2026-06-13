#!/usr/bin/env bash
# Cache-bust: rewrite ?v=<n> on the script tags to a fresh value so every push is visible
# immediately (no hard-refresh). Run before every commit/push.
cd "$(dirname "$0")"
node -e 'const fs=require("fs");let h=fs.readFileSync("index.html","utf8");h=h.replace(/\?v=\d+/g,"?v="+Date.now());fs.writeFileSync("index.html",h);'
echo "cache-bust → $(grep -o "ui.js?v=[0-9]*" index.html)"
