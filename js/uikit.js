/* ============================================================================
   Học viện Steve — js/uikit.js
   The pure UI PRIMITIVES (DOM + HTML builders), split from ui.js (iter 145
   STRUCTURE). No closure state, no game logic — just $/el/esc and the small
   HTML-string/element helpers everything else builds on. Globals, loaded BEFORE
   ui.js (which is one big IIFE that uses them). Headless harnesses (gate/sweep)
   don't load this — they touch no DOM. This is the shared-toolkit foundation:
   future ui.js cluster extractions (e.g. the epilogue screen) can reuse these
   globals instead of the old closure-private copies.
   ========================================================================== */

var $ = function (id) { return document.getElementById(id); };
var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function ibar(l, v, c) { return "<div class='ib'>" + esc(l) + " " + Math.round(v) + "<div class='bar2'><b style='width:" + Math.max(0, Math.min(100, v)) + "%;background:" + c + "'></b></div></div>"; }
function statBar(label, v, color) { return "<i title='" + label + "'><b style='width:" + Math.max(0, Math.min(100, v)) + "%;background:" + color + "'></b></i>"; }
function chip(cls, ic, v) { var c = el("div", "chip " + cls); c.innerHTML = ic + " <span class='v'>" + v + "</span>"; return c; }
function fundRow(l, v, col) { var r = el("div", "row"); r.innerHTML = "<div class='grow muted'>" + l + "</div><div style='font-weight:700;color:" + col + "'>" + v + "</div>"; return r; }
