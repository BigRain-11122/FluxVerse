// r702 compile gate: the shipped panel must parse before any DOM assertion runs.
// PS regex grabbing of the <script> block misreports on encoding, so this is the
// canonical check (runbook: node vm.Script, never a regex/clip check).
'use strict';
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('world-public/city-panel.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log('FAIL no inline script'); process.exit(1); }
try { new vm.Script(m[1]); } catch (e) { console.log('FAIL compile: ' + e.message); process.exit(1); }
const src = m[1];
const shotsConst = /const SHOTS = \{/.test(src);
const dataUris = (src.match(/data:image\/jpeg;base64,/g) || []).length;
console.log('COMPILE OK shots_const=' + shotsConst + ' data_uri=' + dataUris + ' bytes=' + html.length);
if (!shotsConst) process.exit(1);