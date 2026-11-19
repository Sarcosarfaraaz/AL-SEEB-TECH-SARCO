/* ================= SARCO ADMIN (Sarfaraaz Khan) ================= */
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n0 = n => Number(n || 0).toLocaleString('en-US');
const LS = { get(k, d) { try { const v = localStorage.getItem('sarcoadm.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('sarcoadm.' + k, JSON.stringify(v)); } catch (e) { } } };
function toast(msg, err) { const b = $('#toasts'); const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = msg; b.appendChild(t); setTimeout(() => t.remove(), err ? 7000 : 3500); }

const A = { unlocked: false, best: null, bq: '', gh: { owner: '', repo: '', branch: 'main', token: '' }, live: null, liveSha: null, sheets: null, fileName: null, result: null, overrides: {}, acks: {}, offerImport: { include: true, start: '', end: '' }, offers: null, dealersText: null, pq: '', busy: null, history: null, tab: 'upload' };
const DEFAULT_DEALERS = [{"code": "CL005761", "name": "ABRAJ SOHAR"}, {"code": "CL007826", "name": "ABU MAYAN (AL ADEL MODERN)"}, {"code": "CL005958", "name": "AL AMEEN ELECTRONICS"}, {"code": "CL007339", "name": "BARARI AL RUSTAQ TRADING"}, {"code": "CL003408", "name": "DAWOOD AL AJMI TRADING L.L.C."}, {"code": "CL007438", "name": "OVERALL LUZON"}, {"code": "CL005840", "name": "JANOOB AL MADEENA"}, {"code": "CL001000", "name": "MOHD NOOR SHEZAWI"}, {"code": "CL001751", "name": "MOHD RASHID AL FAZARI TRADING"}, {"code": "CL007532", "name": "MURTAFAT AIRPORT NATIONAL (RUSTAQ)"}, {"code": "CL007130", "name": "SOOR AL MULADHA TRADING"}, {"code": "CL004966", "name": "AL KAHOOF AL GHUBAIRA TRD LLC"}, {"code": "CL007700", "name": "ABDULLAH IBRAHIM AL AJMI"}, {"code": "CL007644", "name": "ESSAM AL RUBAIY TRADING"}, {"code": "CL007575", "name": "HAMED SAEED HUMAID"}, {"code": "CL007584", "name": "MASHARE SUFOOH AHAN TRADING"}, {"code": "CL007606", "name": "NEW STAR"}, {"code": "CL007583", "name": "KITCHEN IDEA (SAHAL AL SUYAHAT TRD)"}, {"code": "TEST", "name": "SARFARAAZ KHAN - TEST DEALER"}];
const TODAY = muscatToday();

/* ---------- password lock (key stays encrypted on this laptop) ---------- */
function autoRepo() { const h = location.hostname; if (!/\.github\.io$/i.test(h)) return { owner: '', repo: '' }; return { owner: h.split('.')[0], repo: (location.pathname.split('/').filter(Boolean)[0] || '') }; }
async function deriveKey(pw, salt) { const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']); return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); }
const toB64 = u => btoa(String.fromCharCode.apply(null, u)), fromB64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function lockVault(gh, pw) { const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)); const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(pw, salt), new TextEncoder().encode(JSON.stringify(gh)))); LS.set('vault', { salt: toB64(salt), iv: toB64(iv), ct: toB64(ct) }); }
async function openVault(pw) { const v = LS.get('vault', null); if (!v) return null; try { const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(v.iv) }, await deriveKey(pw, fromB64(v.salt)), fromB64(v.ct)); return JSON.parse(new TextDecoder().decode(pt)); } catch (e) { return null; } }
function gateView() {
  const hasVault = !!LS.get('vault', null); const ar = autoRepo(); const g = A.setup || (A.setup = { owner: ar.owner, repo: ar.repo, branch: 'main', token: '', pw: '' });
  let h = '<header class="top"><div class="wrap"><a class="brand logo" href="./"><img src="logo.jpg" alt="SARCO"></a></div></header><main><div class="wrap" style="max-width:560px"><section class="section">';
  if (hasVault) h += '<div class="panel stack" style="text-align:center"><h2 style="margin:0">🔒 Enter password</h2><p class="muted small" style="margin:0">Type your password to upload stock.</p><input class="inp" type="password" id="pw" placeholder="Password" autocomplete="current-password" style="text-align:center;font-size:18px"><button class="btn pri big block" data-act="unlock">Open upload page</button><a href="#" class="small muted" data-act="reset-vault">Forgot password? Set up again</a></div>';
  else h += '<div class="panel stack"><h2 style="margin:0">One-time setup</h2><p class="small" style="margin:0">Paste your GitHub key once. It is locked on this laptop with your password, and after this you only type the password.</p><div class="form">' +
    '<label class="f">GitHub user name<input class="inp" data-input="gs" data-k="owner" value="' + esc(g.owner) + '"></label><label class="f">Repository name<input class="inp" data-input="gs" data-k="repo" value="' + esc(g.repo) + '"></label>' +
    '<label class="f" style="grid-column:1/-1">GitHub key (starts with github_pat_)<input class="inp" type="password" data-input="gs" data-k="token" value="' + esc(g.token) + '" autocomplete="off"></label>' +
    '<label class="f" style="grid-column:1/-1">Choose your password<input class="inp" type="password" data-input="gs" data-k="pw" value="' + esc(g.pw) + '" autocomplete="new-password"></label></div><button class="btn pri big block" data-act="setup-save">Save and connect</button></div>';
  return h + '</section></div></main><div class="toasts" id="toasts"></div>';
}

/* ---------- price lock: full prices are published encrypted with the app admin password ---------- */
const APP_ADMIN_HASH = 'd0d94ce020f00c48cc86b5d247537b32468e21567905156cb649fd2ab976e343';
async function sha256hex(t) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join(''); }
async function priceKey(pw, salt, usage) { const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']); return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, [usage]); }
async function sealPrices(map, pw) { const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)); const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await priceKey(pw, salt, 'encrypt'), new TextEncoder().encode(JSON.stringify(map)))); return { salt: toB64(salt), iv: toB64(iv), ct: toB64(ct) }; }
async function openPrices(v, pw) { try { return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(v.iv) }, await priceKey(pw, fromB64(v.salt), 'decrypt'), fromB64(v.ct)))); } catch (e) { return null; } }
async function adminPw() {
  if (A.adminPw && await sha256hex(A.adminPw) === APP_ADMIN_HASH) return A.adminPw;
  const p = prompt('Enter your app admin password (your admin password used with E32114) to lock the price list:');
  if (p && await sha256hex(p) === APP_ADMIN_HASH) { A.adminPw = p; return p; }
  throw new Error('Wrong app admin password. The price list was not published.');
}
/* hide prices from dealers: keep a price only for items with an offer, put the full list in the locked vault */
async function lockStockPrices(stock, offers) {
  /* v50: open the saved price vault first, so a re-publish never loses the normal prices (needed for the WAS price) */
  if (!A.priceMap && A.live && A.live.priceVault) { try { A.priceMap = await openPrices(A.live.priceVault, await adminPw()); } catch (e) { } }
  const full = {}; stock.items.forEach(i => { if (i.rrp > 0) full[i.code] = i.rrp; else if (A.priceMap && A.priceMap[i.code]) full[i.code] = A.priceMap[i.code]; });
  const today = muscatToday(); const withOffer = new Set(offers.filter(o => o.end && o.end >= today).map(o => o.code));
  const items = stock.items.map(i => Object.assign({}, i, { rrp: withOffer.has(i.code) ? (full[i.code] || 0) : 0 })); /* RRP is public only for models with a running/upcoming offer; the full list stays in the locked vault */
  /* v50: every offer carries its own WAS price (normal price excl. VAT) so dealers see Was / Now */
  const outOffers = offers.map(o => { const was = full[o.code] > o.priceEx ? full[o.code] : (o.wasEx > o.priceEx ? o.wasEx : 0); return Object.assign({}, o, { wasEx: was }); });
  const noWas = outOffers.filter(o => !o.wasEx).length;
  if (noWas) setTimeout(() => toast(noWas + ' offer item(s) have no normal price (RRP) in the sheet – they show the NOW price only, without a WAS price.', true), 400);
  return { stock: Object.assign({}, stock, { items }), priceVault: await sealPrices(full, await adminPw()), offers: outOffers };
}

/* ---------- GitHub ---------- */
function ghReady() { const g = A.gh; return g.owner && g.repo && g.branch && g.token; }
async function gh(path, opts) {
  const g = A.gh;
  const r = await fetch('https://api.github.com/repos/' + encodeURIComponent(g.owner) + '/' + encodeURIComponent(g.repo) + path, Object.assign({ headers: { Authorization: 'Bearer ' + g.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } }, opts || {}));
  if (r.status === 404) return null;
  if (!r.ok) { let m = ''; try { m = (await r.json()).message; } catch (e) { } throw new Error('GitHub ' + r.status + (m ? ': ' + m : '') + (r.status === 401 ? ' – check the token.' : r.status === 403 ? ' – the token needs Contents: Read and write permission.' : '')); }
  return r.json();
}
function b64encode(str) { const bytes = new TextEncoder().encode(str); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); }
function b64decode(b64) { const bin = atob(b64.replace(/\n/g, '')); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
async function ghGetFile(path) {
  const j = await gh('/contents/' + path + '?ref=' + encodeURIComponent(A.gh.branch));
  if (!j) return null;
  let text = j.content ? b64decode(j.content) : null;
  if (!text && j.git_url) { const blob = await gh('/git/blobs/' + j.sha); text = b64decode(blob.content); }
  return { sha: j.sha, text };
}
async function ghPutB64(path, b64, message) {
  const cur = await gh('/contents/' + path + '?ref=' + encodeURIComponent(A.gh.branch));
  const body = { message, content: b64, branch: A.gh.branch }; if (cur && cur.sha) body.sha = cur.sha;
  return gh('/contents/' + path, { method: 'PUT', body: JSON.stringify(body), headers: { Authorization: 'Bearer ' + A.gh.token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' } });
}
async function ghPutFile(path, text, message, sha) {
  const body = { message, content: b64encode(text), branch: A.gh.branch }; if (sha) body.sha = sha;
  return gh('/contents/' + path, { method: 'PUT', body: JSON.stringify(body), headers: { Authorization: 'Bearer ' + A.gh.token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' } });
}
async function loadLive() {
  try {
    if (ghReady()) { const f = await ghGetFile('stock.json'); if (f) { A.live = JSON.parse(f.text); A.liveSha = f.sha; } else { A.live = { offers: [], dealers: [] }; A.liveSha = null; } }
    else { const r = await fetch('stock.json?v=' + Date.now(), { cache: 'no-store' }); A.live = r.ok ? await r.json() : { offers: [], dealers: [] }; }
  } catch (e) { toast(e.message, true); A.live = A.live || { offers: [], dealers: [] }; }
  if (A.offers == null) A.offers = (A.live.offers || []).slice();
  if (A.best == null) A.best = new Set(A.live.bestsellers || []);
  if (A.passwords == null) A.passwords = Object.assign({}, A.live.passwords || {});
  if (A.signatures == null) A.signatures = Object.assign({}, A.live.signatures || {});
  const rh = (location.hash.match(/^#reset-([A-Z0-9]+)$/i) || [])[1];
  if (rh) { A.passwords = A.passwords || {}; A.passwords[rh.toUpperCase()] = 'RESET-' + Date.now(); A.tab = 'dealers'; history.replaceState(null, '', 'admin.html'); setTimeout(() => toast('Password for ' + rh.toUpperCase() + ' will be reset to sarco@123. Press PUBLISH to apply it.'), 300); }
  if (A.live.priceVault && A.adminPw && await sha256hex(A.adminPw) === APP_ADMIN_HASH) { A.priceMap = await openPrices(A.live.priceVault, A.adminPw); if (A.priceMap && A.live.stock) A.live.stock.items.forEach(i => { if (A.priceMap[i.code]) i.rrp = A.priceMap[i.code]; }); }
  if (A.dealersText == null) A.dealersText = ((A.live.dealers && A.live.dealers.length) ? A.live.dealers : DEFAULT_DEALERS).map(d => d.code + ' | ' + d.name).join('\n');
  render();
}

/* ---------- views ---------- */
function render() {
  if (!A.unlocked) { const keepPw = document.activeElement && document.activeElement.id === 'pw'; $('#root').innerHTML = gateView(); const p = $('#pw'); if (p && (keepPw || true)) p.focus(); return; }
  const live = A.live && A.live.stock;
  let h = '<header class="top"><div class="wrap"><a class="brand logo" href="#"><img src="logo.jpg" alt="SARCO"></a><span style="color:#9fb;font-weight:700;margin-left:10px">Upload page</span><nav class="topnav" style="display:flex"><a href="./">Open dealer website</a></nav></div></header><main><div class="wrap"><section class="section">';
  h += '<nav class="adm-tabs">' + [['upload', '1. Upload stock'], ['offers', '2. Offers'], ['best', '3. ★ Bestsellers'], ['dealers', '4. Dealers'], ['history', 'History'], ['settings', 'Settings']].map(t => '<a href="#" class="' + (A.tab === t[0] ? 'on' : '') + '" data-act="tab" data-v="' + t[0] + '">' + t[1] + '</a>').join('') + '</nav>';
  h += '<p class="sub">Live on the website: ' + (live ? esc(fmtDateTime(live.publishedAt)) + ', ' + n0(live.items.length) + ' products, version ' + esc(live.version) : 'nothing yet') + '</p>';
  if (A.busy) h += '<div class="note info" style="margin-bottom:14px">' + esc(A.busy) + '</div>';
  const missSign = parseDealers(A.dealersText).list.filter(d => !(A.signatures || {})[d.code]);
  if (A.live && missSign.length) h += '<div class="note warn" style="margin-bottom:14px"><div><b>✍️ ' + missSign.length + ' dealer(s) have no signed sales order sheet:</b> ' + missSign.map(d => esc(d.name)).join(', ') + '. <a href="#" data-act="tab" data-v="dealers">Add them in the Dealers tab</a>, then press PUBLISH.</div></div>';
  h += ({ upload: uploadView, offers: offersView, best: bestView, dealers: dealersView, history: historyView, settings: settingsView }[A.tab])();
  h += '</section></div></main><div id="modal"></div><div class="toasts" id="toasts"></div>';
  const keep = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.input : null;
  $('#root').innerHTML = h;
  if (A.tab === 'upload' && A.result) renderPreview();
  if (keep === 'pq') { const n = $('[data-input="pq"]'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }
}
function publishBar(label) {
  return '<div class="panel row" style="margin-top:16px"><div><b>Publish to the dealer website</b><div class="small muted">Publishes stock, offers and the dealer list together. Dealers see the update within about 1–2 minutes.</div></div><span class="spacer"></span><button class="btn pri big" data-act="publish" ' + (canPublish() ? '' : 'disabled') + '>' + esc(label || 'PUBLISH') + '</button></div>';
}
function canPublish() { if (!ghReady() || A.busy) return false; if (A.result) return !A.result.errors.length && A.result.reviews.every((_, i) => A.acks[i]); return !!(A.live && A.live.stock); }
function settingsView() {
  return '<div class="panel stack"><h3>Settings</h3><dl class="kv" style="max-width:520px"><dt>GitHub user</dt><dd>' + esc(A.gh.owner) + '</dd><dt>Repository</dt><dd>' + esc(A.gh.repo) + '</dd><dt>Branch</dt><dd>' + esc(A.gh.branch) + '</dd></dl><div class="row"><button class="btn" data-act="lock">🔒 Lock now</button><button class="btn danger" data-act="reset-vault">Remove key from this laptop</button></div><p class="small muted">To change the password or the key, remove the key and set up again.</p></div>';
}
function oldSettingsView() {
  const g = A.gh;
  return '<div class="panel"><h3>GitHub publishing (one-time setup on this computer)</h3><p class="small muted">The token is stored only in this browser on this computer. Never share it.</p><div class="form">' +
    '<label class="f">GitHub user name<input class="inp" data-input="gh" data-k="owner" value="' + esc(g.owner) + '"></label><label class="f">Repository name<input class="inp" data-input="gh" data-k="repo" value="' + esc(g.repo) + '"></label>' +
    '<label class="f">Branch<input class="inp" data-input="gh" data-k="branch" value="' + esc(g.branch) + '"></label><label class="f">Access token<input class="inp" type="password" data-input="gh" data-k="token" value="' + esc(g.token) + '" autocomplete="off"></label></div>' +
    '<div class="row" style="margin-top:14px"><button class="btn pri" data-act="gh-save">Save and test connection</button><button class="btn danger" data-act="gh-forget">Remove token from this computer</button></div></div>';
}
function uploadView() {
  let h = '<label class="drop" id="drop">' + '<svg class="i" viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-3"/></svg><div style="font-weight:800;font-size:16px;margin-top:6px">' + (A.fileName ? esc(A.fileName) : 'Choose your stock workbook (DEALER_APP.xlsx)') + '</div><div class="small muted">Update the RAW sheets in Excel, let the MAIN SHEET recalculate, press Save, then choose the file here. The website reads the MAIN SHEET.</div><span class="choose">📂 CHOOSE EXCEL FILE</span><div class="small muted" style="margin-top:8px">or drag the file into this box</div><input type="file" class="hide" accept=".xlsx,.xls,.xlsm,.csv" data-input="upl"></label>';
  if (!A.result) return h + publishBar('PUBLISH (offers / dealers only)');
  const R = A.result, st = R.stats;
  h += '<div class="stack" style="margin-top:18px"><div class="panel"><h3>Sheets found</h3><div class="scroll"><table class="tbl"><tr><th>Sheet</th><th>Used as</th><th class="n">Rows</th><th>Status</th><th></th></tr>' + R.detected.map(d => '<tr><td><b>' + esc(d.name) + '</b></td><td>' + ({ main: '<b>MAIN SHEET – source</b>', source: 'Feeds the MAIN SHEET (not read)', stock: 'Stock', rrp: 'RRP price list', offer: 'Offers', summary: 'Ignored (summary)', unknown: 'Not used', ignore: 'Ignored' }[d.kind] || d.kind) + '</td><td class="n">' + n0(d.rows) + '</td><td>' + (d.missing.length ? '<span class="pill err">Missing ' + d.missing.map(f => FIELD_DEFS[f].label).join(', ') + '</span>' : ['stock', 'rrp', 'offer'].includes(d.kind) ? '<span class="pill ok">OK</span>' : '') + '</td><td><button class="btn sm" data-act="map" data-sheet="' + esc(d.name) + '">Map columns</button></td></tr>').join('') + '</table></div></div>';
  if (R.errors.length) h += '<div class="note err"><div><b>Cannot publish – fix the file:</b><ul>' + R.errors.map(e => '<li>' + esc(e) + '</li>').join('') + '</ul></div></div>';
  if (R.reviews.length) h += '<div class="note warn"><div><b>Check and tick before publishing:</b><ul style="list-style:none;padding:0">' + R.reviews.map((e, i) => '<li style="margin-top:6px"><label class="row" style="align-items:flex-start;flex-wrap:nowrap"><input type="checkbox" data-act="ack" data-i="' + i + '" ' + (A.acks[i] ? 'checked' : '') + '> <span>' + esc(e) + '</span></label></li>').join('') + '</ul></div></div>';
  if (R.warnings.length) h += '<div class="note info"><div><b>Notes:</b><ul>' + R.warnings.map(e => '<li>' + esc(e) + '</li>').join('') + '</ul></div></div>';
  h += '<div class="tiles"><div class="tile"><small>Products</small><b>' + n0(st.products) + '</b></div><div class="tile"><small>Sohar (401)</small><b>' + n0(st.sohar) + '</b></div><div class="tile"><small>Khazaan (SAR01)</small><b>' + n0(st.khazaan) + '</b></div><div class="tile"><small>Total units</small><b>' + n0(st.total) + '</b><div class="small muted">' + (st.source === 'main' ? 'CONFIRMED columns of the MAIN SHEET' + (st.stockDate ? ', stock date ' + fmtDate(st.stockDate) : '') : 'confirmed − reserved − pending issues') + '</div></div></div>';
  h += '<div class="two"><div class="panel"><h3>Checks</h3><ul class="checks">' + R.checks.map(c => '<li><span class="' + (c.ok ? 'ok' : 'bad') + '">' + (c.ok ? '✓' : '✗') + '</span><span>' + esc(c.label) + (c.info ? ' <span class="muted">(' + esc(c.info) + ')</span>' : '') + '</span></li>').join('') + '</ul></div>' +
    '<div class="panel"><h3>Left out</h3><dl class="kv"><dt>Other brands (rows)</dt><dd>' + n0(st.excludedBrandRows) + '</dd><dt>Other warehouses (rows)</dt><dd>' + n0(Object.values(st.excludedLocations).reduce((a, b) => a + b, 0)) + '</dd><dt>of which Ghala (14)</dt><dd>' + n0(st.ghalaRows) + '</dd><dt>No RRP (products)</dt><dd>' + n0(st.noRrp) + '</dd><dt>Zero stock (products)</dt><dd>' + n0(st.zeroStock) + '</dd></dl>' + (st.noRrp ? '<details style="margin-top:8px"><summary class="small" style="cursor:pointer;font-weight:700">Items without RRP</summary><p class="small muted">' + st.noRrpCodes.map(esc).join(', ') + '</p></details>' : '') + '</div></div>';
  if (R.diff) h += '<div class="panel"><h3>Change from the live website</h3><dl class="kv" style="max-width:480px"><dt>New products</dt><dd>' + R.diff.added.length + '</dd><dt>Removed products</dt><dd>' + R.diff.removed.length + '</dd><dt>Quantity changes</dt><dd>' + R.diff.changed + '</dd><dt>RRP changes</dt><dd>' + R.diff.priceChanged + '</dd></dl></div>';
  if (R.offerRows.length) {
    const oi = A.offerImport;
    h += '<div class="panel"><h3>Offers in this file (' + R.offerRows.length + ')</h3><p class="small">Price basis: ' + esc(R.offerRows[0].basis) + '. Offers without a start and expiry date are never published.</p><div class="form" style="max-width:600px"><label class="f">Offer start date<input type="date" class="inp" data-input="oi" data-k="start" value="' + esc(oi.start) + '"></label><label class="f">Offer expiry date<input type="date" class="inp" data-input="oi" data-k="end" value="' + esc(oi.end) + '"></label></div><label class="row small" style="margin-top:10px;font-weight:700"><input type="checkbox" data-act="oi-inc" ' + (oi.include ? 'checked' : '') + '> Add these offers when publishing</label><p class="small" id="oisum">' + offerImportSummary() + '</p></div>';
  }
  if (R.offerReport) h += offerCheckPanel(R);
  h += '<div class="panel"><div class="row"><h3 style="margin:0">Preview</h3><span class="spacer"></span><input class="inp" style="max-width:260px" placeholder="Filter preview" data-input="pq" value="' + esc(A.pq) + '"></div><div id="ptable" style="margin-top:12px"></div></div>';
  return h + '</div>' + publishBar('PUBLISH STOCK');
}
function offerCheckPanel(R) {
  const rp = R.offerReport, sk = rp.skipped || [];
  let h = '<div class="panel"><h3>Offer check</h3><p class="small"><b>' + R.offerRows.length + '</b> offer item(s) ready to publish: ' + rp.fromMain + ' from the MAIN SHEET offer column' + (rp.fromSheet ? ', <b>' + rp.fromSheet + '</b> taken from the offer sheet because the MAIN SHEET cell was empty' : '') + '.' + (rp.sheets.length ? ' Offer sheet read: ' + rp.sheets.map(esc).join(', ') + ' (' + rp.sheetRows + ' priced rows).' : ' No separate offer sheet was recognised in this file.') + '</p>';
  if (rp.noRrp.length) h += '<p class="small">⚠️ ' + rp.noRrp.length + ' offer item(s) have no RRP – they show the NOW price only (no WAS price): ' + rp.noRrp.map(esc).join(', ') + '</p>';
  if (rp.hiddenMobile.length) h += '<p class="small">📵 ' + rp.hiddenMobile.length + ' offer item(s) are mobile phones – phones are switched off in the dealer app, so dealers will not see them: ' + rp.hiddenMobile.map(esc).join(', ') + '</p>';
  if (rp.differ.length) h += '<p class="small">⚠️ ' + rp.differ.length + ' item(s) have a different price in the MAIN SHEET and the offer sheet – the MAIN SHEET price is used: ' + rp.differ.map(x => esc(x.code) + ' (' + fmtOMR(x.main) + ' vs ' + fmtOMR(x.sheet) + ')').join(', ') + '</p>';
  const mr = rp.market;
  if (mr && mr.sheets.length) {
    h += '<p class="small" style="margin-top:10px"><b>🏪 Market prices</b> (' + mr.sheets.map(esc).join(', ') + '): ' + mr.matched + ' offer item(s) compared' + (mr.ignored ? ', ' + mr.ignored + ' row(s) ignored because the item has no offer in this file' : '') + '.</p>';
    if (mr.cheaper.length) h += '<p class="small" style="color:#B45309">⚠️ <b>' + mr.cheaper.length + ' offer(s) are cheaper in the market – they will be HIDDEN from dealers</b> (you still see them): ' + mr.cheaper.map(x => esc(x.code) + ' – ' + esc(x.store) + ' ' + fmtOMR(x.market) + ' vs ours ' + fmtOMR(x.ours)).join('; ') + '</p>';
    else if (mr.matched) h += '<p class="small">✓ Our offer price is the lowest for every compared item.</p>';
  } else h += '<p class="small" style="margin-top:10px">🏪 No MARKET PRICES sheet in this file' + ' – published market prices (if any) are kept for running offers.</p>';
  if (sk.length) h += '<p class="small" style="margin-top:10px"><b>' + sk.length + ' offer row(s) NOT published:</b></p><div style="max-height:320px;overflow:auto"><table class="tbl"><thead><tr><th>Item code</th><th>Reason</th></tr></thead><tbody>' + sk.map(x => '<tr><td>' + esc(x.code) + '</td><td>' + esc(x.reason) + '</td></tr>').join('') + '</tbody></table></div>';
  else h += '<p class="small">✓ Every offer row in this file can be published.</p>';
  return h + '</div>';
}
function offerImportSummary() {
  const R = A.result, oi = A.offerImport; const items = new Map(R.items.map(i => [i.code, i])); const c = { active: 0, upcoming: 0, expired: 0, invalid: 0, 'no-stock': 0 };
  R.offerRows.forEach(r => { c[offerState({ code: r.code, priceEx: r.priceEx, start: oi.start, end: oi.end }, items.get(r.code), TODAY)]++; });
  return 'With these dates, as of today (' + fmtDate(TODAY) + '): ' + c.active + ' active, ' + c.upcoming + ' upcoming, ' + c.expired + ' already expired (not published), ' + c.invalid + ' invalid, ' + c['no-stock'] + ' for items not in stock.';
}
function renderPreview() {
  const box = $('#ptable'); if (!box) return; const R = A.result;
  const idx = A.pq.trim() ? searchItems(buildSearchIndex(R.items), R.items, A.pq) : R.items.map((_, i) => i);
  box.innerHTML = '<p class="count">' + idx.length + ' products</p><div class="scroll tall"><table class="tbl"><tr><th>Item code</th><th>Item name</th><th>Type</th><th class="n">RRP ex VAT</th><th class="n">VAT</th><th class="n">RRP incl.</th><th class="n">Sohar</th><th class="n">Khazaan</th><th class="n">Total</th></tr>' +
    idx.slice(0, 500).map(i => { const it = R.items[i]; return '<tr><td><b>' + esc(it.code) + '</b></td><td>' + esc(it.name) + '</td><td>' + esc(it.type) + '</td><td class="n">' + fmtOMR(it.rrp, false) + '</td><td class="n">' + fmtOMR(vatOf(it.rrp), false) + '</td><td class="n">' + fmtOMR(it.rrp + vatOf(it.rrp), false) + '</td><td class="n">' + it.sohar + '</td><td class="n">' + it.khazaan + '</td><td class="n"><b>' + (it.sohar + it.khazaan) + '</b></td></tr>'; }).join('') + '</table></div>';
}
function offersView() {
  const items = new Map(((A.result ? A.result.items : A.live && A.live.stock && A.live.stock.items) || []).map(i => [i.code, i]));
  const list = (A.offers || []).map(o => ({ o, it: items.get(o.code), st: offerState(o, items.get(o.code), TODAY) }));
  const e = A.offEdit || { basis: 'ex', start: TODAY, end: '', code: '', price: '' };
  return '<div class="panel"><h3>Add an offer</h3><div class="form"><label class="f">Item code<input class="inp" list="codes" data-input="oe" data-k="code" value="' + esc(e.code) + '"><datalist id="codes">' + [...items.values()].map(i => '<option value="' + esc(i.code) + '">' + esc(i.name) + '</option>').join('') + '</datalist></label>' +
    '<label class="f">Price basis<select class="sel" data-input="oe" data-k="basis"><option value="ex"' + (e.basis === 'ex' ? ' selected' : '') + '>Offer price excluding VAT</option><option value="inc"' + (e.basis === 'inc' ? ' selected' : '') + '>Offer price including VAT</option></select></label>' +
    '<label class="f">Offer price (OMR)<input class="inp" inputmode="decimal" data-input="oe" data-k="price" value="' + esc(e.price) + '"></label><span></span><label class="f">Start date<input type="date" class="inp" data-input="oe" data-k="start" value="' + esc(e.start) + '"></label><label class="f">Expiry date<input type="date" class="inp" data-input="oe" data-k="end" value="' + esc(e.end) + '"></label></div><div class="row" style="margin-top:12px"><button class="btn pri" data-act="off-add">Add offer</button></div></div>' +
    '<div class="panel scroll" style="margin-top:14px"><h3>Offers (' + list.length + ')</h3>' + (list.length ? '<table class="tbl"><tr><th>Item code</th><th class="n">RRP ex</th><th class="n">Offer ex</th><th class="n">Offer incl.</th><th class="n">Disc %</th><th>Start</th><th>Expiry</th><th>Status</th><th></th></tr>' +
      list.map(r => '<tr><td><b>' + esc(r.o.code) + '</b><br><span class="small muted">' + esc(r.it ? r.it.name : 'not in stock') + '</span></td><td class="n">' + (r.it ? fmtOMR(r.it.rrp, false) : '—') + '</td><td class="n">' + fmtOMR(r.o.priceEx, false) + '</td><td class="n">' + fmtOMR(r.o.priceEx + vatOf(r.o.priceEx), false) + '</td><td class="n">' + (r.it ? discountPct(r.it.rrp, r.o.priceEx).toFixed(2) : '—') + '</td><td>' + fmtDate(r.o.start) + '</td><td>' + fmtDate(r.o.end) + '</td><td><span class="pill ' + ({ active: 'ok', upcoming: '', expired: 'grey', invalid: 'err', 'no-stock': 'warn' }[r.st]) + '">' + r.st + '</span></td><td><button class="btn sm danger" data-act="off-del" data-id="' + esc(r.o.id) + '">Delete</button></td></tr>').join('') + '</table>' : '<div class="empty">No offers.</div>') + '</div>' +
    '<p class="small muted">Expired offers disappear from the dealer website automatically on the day after the expiry date (Oman time) and are removed from the file at the next publish.</p>' + publishBar('PUBLISH');
}
function bestView() {
  const items = ((A.result ? A.result.items : A.live && A.live.stock && A.live.stock.items) || []); const by = new Map(items.map(i => [i.code, i]));
  const best = A.best || new Set(); const q = A.bq.trim();
  const res = q ? searchItems(buildSearchIndex(items), items, q).slice(0, 25).map(i => items[i]) : [];
  return '<div class="panel"><h3>Choose bestsellers</h3><p class="small muted">Add the products your dealers ask for most. Search a product and tap ★ Add. They appear at the top of the dealer home page with a ★ badge.</p><input class="inp" placeholder="Search item code or name" data-input="bq" value="' + esc(A.bq) + '"><div id="bres" style="margin-top:10px">' + bestResults(res, best) + '</div></div>' +
    '<div class="panel" style="margin-top:14px"><h3>★ Bestsellers (' + best.size + ')</h3>' + (best.size ? '<table class="tbl">' + [...best].map(c => '<tr><td><b>' + esc(c) + '</b><br><span class="small muted">' + esc(by.get(c) ? by.get(c).name : 'not in stock now') + '</span></td><td style="text-align:right"><button class="btn sm danger" data-act="best-rm" data-c="' + esc(c) + '">Remove</button></td></tr>').join('') + '</table>' : '<div class="empty">No bestsellers yet.</div>') + '</div>' + publishBar('PUBLISH');
}
function bestResults(res, best) { return res.map(it => '<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="flex:1;min-width:0"><b>' + esc(it.code) + '</b><br><span class="small muted">' + esc(it.name) + '</span></div>' + (best.has(it.code) ? '<span class="pill ok">★ Added</span>' : '<button class="btn sm pri" data-act="best-add" data-c="' + esc(it.code) + '">★ Add</button>') + '</div>').join(''); }
function parseDealers(text) {
  const out = [], errs = [], seen = new Set();
  String(text || '').split(/\r?\n/).forEach((line, i) => {
    if (!line.trim()) return;
    const m = line.split('|'); if (m.length < 2) { errs.push('Line ' + (i + 1) + ': use CODE | NAME'); return; }
    const code = m[0].trim().toUpperCase(), name = m.slice(1).join('|').trim().toUpperCase();
    if (!code || !name) { errs.push('Line ' + (i + 1) + ': code or name missing'); return; }
    if (seen.has(code)) { errs.push('Line ' + (i + 1) + ': duplicate code ' + code); return; }
    seen.add(code); out.push({ code, name });
  });
  return { list: out, errs };
}
function signPanel(list) {
  const sg = A.signatures || {};
  return '<div class="panel" style="margin-bottom:14px"><h3>✍️ Signed sales order sheets</h3><p class="small muted">Each dealer\'s signature and stamp is added automatically to their order sheet. Upload a photo or PDF of a signed sheet, then drag a box around the <b>ORDER CONFIRMED BY DEALER</b> area (name, signature and stamp).</p>' +
    '<table class="tbl">' + list.map(d => '<tr><td><b>' + esc(d.code) + '</b> ' + esc(d.name) + '</td><td>' + (sg[d.code] ? '<span class="pill ok">✓ Saved</span> <a href="' + esc(sg[d.code]) + '" target="_blank" class="small">view</a>' : '<span class="pill err">Missing</span>') + '</td><td style="text-align:right"><label class="btn sm' + (sg[d.code] ? '' : ' pri') + '">' + (sg[d.code] ? 'Replace' : 'Add signed sheet') + '<input type="file" class="hide" accept="image/*,application/pdf" data-input="signfile" data-c="' + esc(d.code) + '"></label></td></tr>').join('') + '</table></div>';
}
function dealersView() {
  const p = parseDealers(A.dealersText); const pw = A.passwords || {};
  const custom = Object.keys(pw);
  return signPanel(p.list) + '<div class="panel"><h3>🔐 Dealer logins</h3><p class="small muted">Each dealer signs in with their <b>dealer code</b> as the username. The first password for every dealer is <b>sarco@123</b>. Dealers can change it in the app; they then send you a <b>Password update request</b> on WhatsApp.</p>' +
    '<textarea class="inp" style="min-height:90px" placeholder="Paste the dealer\'s Password update request message here" data-input="pwreq"></textarea><div class="row" style="margin-top:8px"><button class="btn pri" data-act="pw-apply">Apply password update</button></div>' +
    (custom.length ? '<table class="tbl" style="margin-top:12px"><tr><th>Dealer</th><th>Password</th><th></th></tr>' + custom.map(c => '<tr><td><b>' + esc(c) + '</b> ' + esc((p.list.find(d => d.code === c) || {}).name || '') + '</td><td>' + (String(pw[c]).startsWith('RESET') ? 'Reset to sarco@123' : 'Changed by dealer') + '</td><td style="text-align:right"><button class="btn sm danger" data-act="pw-reset" data-c="' + esc(c) + '">Reset to sarco@123</button></td></tr>').join('') + '</table>' : '') +
    '<div class="row" style="margin-top:10px"><select class="sel" style="max-width:340px" data-input="pwsel"><option value="">Reset a dealer password…</option>' + p.list.map(d => '<option value="' + esc(d.code) + '">' + esc(d.code + ' – ' + d.name) + '</option>').join('') + '</select><button class="btn sm danger" data-act="pw-reset-sel">Reset to sarco@123</button></div><p class="small muted">Changes take effect after you press PUBLISH.</p></div>' +
    '<div class="panel" style="margin-top:14px"><h3>Dealer list (' + p.list.length + ')</h3><p class="small muted">One dealer per line: <b>CODE | NAME</b>. Dealers choose their name from this list when ordering.</p><textarea class="inp" style="min-height:420px;font-family:inherit" data-input="dealers">' + esc(A.dealersText || '') + '</textarea>' + (p.errs.length ? '<div class="note err" style="margin-top:10px">' + p.errs.map(esc).join('<br>') + '</div>' : '') + '</div>' + publishBar('PUBLISH');
}
function historyView() {
  if (!ghReady()) return '<div class="panel empty">Set up GitHub in Settings to see the history.</div>';
  if (A.history == null) { loadHistory(); return '<div class="panel empty">Loading …</div>'; }
  return '<div class="panel scroll"><h3>Published versions</h3>' + (A.history.length ? '<table class="tbl"><tr><th>Version</th><th></th></tr>' + A.history.map(f => '<tr><td><b>' + esc(f.name.replace('.json', '')) + '</b>' + (A.live && A.live.stock && f.name === A.live.stock.version + '.json' ? ' <span class="pill ok">Live</span>' : '') + '</td><td style="text-align:right;white-space:nowrap"><button class="btn sm" data-act="h-dl" data-p="' + esc(f.path) + '">Download Excel</button> <button class="btn sm" data-act="h-restore" data-p="' + esc(f.path) + '">Restore this stock</button></td></tr>').join('') + '</table>' : '<div class="empty">No versions yet.</div>') + '</div>';
}
async function loadHistory() {
  try { const j = await gh('/contents/history?ref=' + encodeURIComponent(A.gh.branch)); A.history = (j || []).filter(f => f.name.endsWith('.json')).sort((a, b) => b.name.localeCompare(a.name)); } catch (e) { A.history = []; toast(e.message, true); }
  render();
}

/* ---------- signature crop tool ---------- */
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', PDFJS_W = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
async function fileToCanvas(file) {
  const c = document.createElement('canvas');
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    if (!window.pdfjsLib) await new Promise((res, rej) => { const s2 = document.createElement('script'); s2.src = PDFJS; s2.onload = res; s2.onerror = () => rej(new Error('Could not load the PDF reader.')); document.head.appendChild(s2); });
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_W;
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; const page = await pdf.getPage(1); const vp = page.getViewport({ scale: 2.2 });
    c.width = vp.width; c.height = vp.height; await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise; return c;
  }
  const url = URL.createObjectURL(file); const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not open the image.')); i.src = url; });
  c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); return c;
}
async function openCrop(file, code) {
  try { A.busy = 'Opening ' + file.name + ' …'; render(); const c = await fileToCanvas(file); A.busy = null; render(); A.crop = { code, canvas: c, sel: null }; cropModal(); }
  catch (e) { A.busy = null; render(); toast(e.message || String(e), true); }
}
function cropModal() {
  const C = A.crop; const d = parseDealers(A.dealersText).list.find(x => x.code === C.code) || { name: '' };
  $('#modal').innerHTML = '<div class="modal-bg"><div class="modal wide"><h2 style="margin:0 0 4px">Signed sheet: ' + esc(C.code + ' – ' + d.name) + '</h2><p class="small muted">Drag a box around the <b>ORDER CONFIRMED BY DEALER</b> area (name, signature and stamp).</p><div class="cropwrap"><canvas id="cropc"></canvas></div><div class="row" style="margin-top:12px"><button class="btn pri" data-act="crop-save">Save signature</button><button class="btn" data-act="crop-cancel">Cancel</button></div></div></div>';
  const v = $('#cropc'); const maxW = Math.min(860, window.innerWidth - 60), maxH = Math.max(320, window.innerHeight * 0.64); const k = Math.min(maxW / C.canvas.width, maxH / C.canvas.height); v.width = Math.round(C.canvas.width * k); v.height = Math.round(C.canvas.height * k); C.k = k;
  const draw = () => { const g = v.getContext('2d'); g.drawImage(C.canvas, 0, 0, v.width, v.height); if (C.sel) { const s2 = C.sel; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, v.width, v.height); g.drawImage(C.canvas, s2.x / k, s2.y / k, s2.w / k, s2.h / k, s2.x, s2.y, s2.w, s2.h); g.strokeStyle = '#FFB300'; g.lineWidth = 3; g.strokeRect(s2.x, s2.y, s2.w, s2.h); } };
  let start = null; const pos = e => { const r = v.getBoundingClientRect(); return { x: (e.clientX - r.left) * v.width / r.width, y: (e.clientY - r.top) * v.height / r.height }; };
  v.onpointerdown = e => { e.preventDefault(); start = pos(e); v.setPointerCapture(e.pointerId); };
  v.onpointermove = e => { if (!start) return; const p2 = pos(e); C.sel = { x: Math.min(start.x, p2.x), y: Math.min(start.y, p2.y), w: Math.abs(p2.x - start.x), h: Math.abs(p2.y - start.y) }; draw(); };
  v.onpointerup = () => { start = null; };
  draw();
}
async function saveCrop() {
  const C = A.crop; if (!C || !C.sel || C.sel.w < 20 || C.sel.h < 20) { toast('Drag a box around the dealer area first.', true); return; }
  const sx = C.sel.x / C.k, sy = C.sel.y / C.k, sw = C.sel.w / C.k, sh = C.sel.h / C.k; const scale = Math.min(1, 700 / sw);
  const out = document.createElement('canvas'); out.width = Math.round(sw * scale); out.height = Math.round(sh * scale); const g = out.getContext('2d'); g.drawImage(C.canvas, sx, sy, sw, sh, 0, 0, out.width, out.height);
  const im = g.getImageData(0, 0, out.width, out.height), px = im.data;
  for (let i = 0; i < px.length; i += 4) { const r = px[i], gg = px[i + 1], b = px[i + 2]; const L = 0.3 * r + 0.59 * gg + 0.11 * b; if (L > 185 && Math.max(r, gg, b) - Math.min(r, gg, b) < 40) { px[i] = px[i + 1] = px[i + 2] = 255; } }
  g.putImageData(im, 0, 0);
  const b64 = out.toDataURL('image/jpeg', 0.88).split(',')[1]; const name = 'sign-' + C.code + '.jpg';
  try { A.busy = 'Saving signature …'; $('#modal').innerHTML = ''; render(); await ghPutB64(name, b64, 'Signed sheet ' + C.code); A.signatures = A.signatures || {}; A.signatures[C.code] = name + '?v=' + Date.now(); A.crop = null; A.busy = null; render(); toast('Signature saved for ' + C.code + '. Press PUBLISH to use it.'); }
  catch (e) { A.busy = null; render(); toast(e.message || String(e), true); }
}

/* ---------- processing ---------- */
async function getXLSX() { if (!window.XLSX) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = XLSX_URL; s.onload = res; s.onerror = () => rej(new Error('Could not load the Excel reader. Check the internet connection.')); document.head.appendChild(s); }); return window.XLSX; }
async function handleUpload(file) {
  A.busy = 'Reading ' + file.name + ' …'; A.fileName = file.name; A.result = null; A.acks = {}; A.overrides = {}; render();
  try { const X = await getXLSX(); const wb = X.read(await file.arrayBuffer(), { type: 'array', cellDates: true }); A.sheets = wb.SheetNames.map(n => ({ name: n, rows: X.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: null, blankrows: true }) })); processNow(); }
  catch (e) { toast('Could not read the file: ' + (e.message || e), true); }
  A.busy = null; render();
}
function processNow() {
  const prev = A.live && A.live.stock ? A.live.stock.items : [];
  A.result = processWorkbook(A.sheets, { overrides: A.overrides, prevItems: prev, prevVersion: A.live && A.live.stock && A.live.stock.version });
  const r0 = A.result.offerRows[0];
  A.offerImport = { include: A.offerImport.include !== false, start: A.offerImport.start || (r0 && r0.start) || '', end: (r0 && r0.end) || A.offerImport.end || '' };
}
function mapModal(sheet) {
  const sh = A.sheets.find(s => s.name === sheet); const d = A.result.detected.find(x => x.name === sheet);
  const md = A.mapDraft && A.mapDraft.sheet === sheet ? A.mapDraft : (A.mapDraft = { sheet, kind: d.kind, headerRow: d.headerRow || 0, cols: Object.assign({}, d.cols) });
  const headers = (sh.rows[md.headerRow] || []).map(cleanText); const def = KIND_FIELDS[md.kind];
  $('#modal').innerHTML = '<div class="modal-bg"><div class="modal wide"><h2 style="margin:0 0 4px">Map columns: ' + esc(sheet) + '</h2><p class="small muted">Use when the raw file layout changes. * = required.</p><div class="form"><label class="f">Use this sheet as<select class="sel" data-input="mk"><option value="main"' + (md.kind === 'main' ? ' selected' : '') + '>MAIN SHEET (source)</option><option value="stock"' + (md.kind === 'stock' ? ' selected' : '') + '>Raw stock</option><option value="rrp"' + (md.kind === 'rrp' ? ' selected' : '') + '>RRP price list</option><option value="offer"' + (md.kind === 'offer' ? ' selected' : '') + '>Offers</option><option value="ignore"' + (!def ? ' selected' : '') + '>Ignore</option></select></label><label class="f">Header row number<input type="number" min="1" class="inp" data-input="mh" value="' + (md.headerRow + 1) + '"></label></div>' +
    (def ? '<div class="form" style="margin-top:14px">' + [...def.required, ...def.optional].map(f => '<label class="f">' + FIELD_DEFS[f].label + (def.required.includes(f) ? ' *' : '') + '<select class="sel" data-input="mc" data-f="' + f + '"><option value="">— not in file —</option>' + headers.map((hh, i) => '<option value="' + i + '"' + (md.cols[f] === i ? ' selected' : '') + '>' + esc(hh || 'Column ' + (i + 1)) + '</option>').join('') + '</select></label>').join('') + '</div>' : '') +
    '<div class="row" style="margin-top:16px"><button class="btn pri" data-act="map-apply">Apply</button><button class="btn" data-act="map-auto">Automatic detection</button><button class="btn" data-act="map-close">Cancel</button></div></div></div>';
}

/* ---------- publish ---------- */
function versionId() { const p = muscatParts(new Date()); return 'V' + p.year.slice(2) + p.month + p.day + '-' + p.hour + p.minute + p.second; }
async function publish() {
  const dp = parseDealers(A.dealersText);
  if (dp.errs.length) { toast('Fix the dealer list first.', true); A.tab = 'dealers'; render(); return; }
  if (!dp.list.length) { toast('The dealer list is empty.', true); return; }
  A.busy = 'Publishing …'; render();
  try {
    const cur = await ghGetFile('stock.json');
    let stock = cur ? JSON.parse(cur.text).stock : null;
    let offers = (A.offers || []).slice(); let imported = 0;
    if (A.result) {
      const R = A.result; const id = versionId();
      stock = { version: id, publishedAt: new Date().toISOString(), stockDate: R.stats.stockDate || null, fileName: A.fileName, stats: { products: R.stats.products, sohar: R.stats.sohar, khazaan: R.stats.khazaan, total: R.stats.total }, items: R.items.map(it => ({ code: it.code, model: it.model, brand: it.brand || '', name: it.name, type: it.type, division: it.division, department: it.department, cat: it.cat, rrp: it.rrp, sohar: it.sohar, khazaan: it.khazaan, fs: it.fs == null ? null : it.fs, fk: it.fk == null ? null : it.fk })) };
      if (A.offerImport.include && R.offerRows.length) {
        for (const r of R.offerRows) {
          const o = { id: 'O' + randomId(8), code: r.code, priceEx: r.priceEx, wasEx: r.sheetRrp > r.priceEx ? r.sheetRrp : 0, start: A.offerImport.start, end: A.offerImport.end, source: A.fileName };
          if (offerProblems(o, null).length || o.end < TODAY) continue;
          offers = offers.filter(x => !(x.code === o.code && !(x.end < o.start || x.start > o.end)));
          offers.push(o); imported++;
        }
      }
    }
    if (!stock) throw new Error('There is no stock to publish yet. Upload the Excel file first.');
    offers = offers.filter(o => isValidIsoDate(o.end) && o.end >= TODAY && !offerProblems(o, null).length);
    const locked = await lockStockPrices(stock, offers);
    /* market prices: new ones from this file, else keep the published ones; only for offers still running or upcoming */
    const prevMarket = cur ? (JSON.parse(cur.text).market || null) : null;
    const mSrc = (A.result && A.result.market && Object.keys(A.result.market.prices).length) ? A.result.market : prevMarket;
    const offerSet = new Set(locked.offers.map(o => o.code)); let market = null;
    if (mSrc && mSrc.prices) { const pr = {}; Object.keys(mSrc.prices).forEach(c => { if (offerSet.has(c)) pr[c] = mSrc.prices[c]; }); if (Object.keys(pr).length) market = { date: mSrc.date || null, prices: pr }; }
    const data = { schema: 1, stock: locked.stock, priceVault: locked.priceVault, offers: locked.offers, market, dealers: dp.list, bestsellers: [...(A.best || [])], passwords: A.passwords || {}, signatures: A.signatures || {}, settings: { whatsapp: '96872416506' } };
    const text = JSON.stringify(data); stock = locked.stock;
    await ghPutFile('stock.json', text, 'Publish ' + stock.version + ' (' + stock.items.length + ' products)', cur ? cur.sha : undefined);
    if (A.result) { try { await ghPutFile('history/' + stock.version + '.json', JSON.stringify({ stock, priceVault: data.priceVault }), 'Backup ' + stock.version); } catch (e) { toast('Published, but the backup copy failed: ' + e.message, true); } }
    A.live = data; A.live.stock = JSON.parse(JSON.stringify(data.stock)); if (A.priceMap || data.priceVault) { A.priceMap = await openPrices(data.priceVault, A.adminPw); if (A.priceMap) A.live.stock.items.forEach(i => { if (A.priceMap[i.code]) i.rrp = A.priceMap[i.code]; }); } A.offers = offers.slice(); A.result = null; A.sheets = null; A.fileName = null; A.history = null;
    A.busy = null; toast('Published' + (imported ? ' with ' + imported + ' offer(s)' : '') + '. The dealer website updates within about 1–2 minutes.'); render();
  } catch (e) { A.busy = null; toast(e.message || String(e), true); render(); }
}
async function restore(path) {
  if (!confirm('Restore this stock version to the dealer website? Current offers and dealers are kept.')) return;
  A.busy = 'Restoring …'; render();
  try { const f = await ghGetFile(path); const hist = JSON.parse(f.text); const old = hist.stock; const cur = await ghGetFile('stock.json'); const data = JSON.parse(cur.text); data.stock = Object.assign({}, old, { restoredAt: new Date().toISOString() }); if (hist.priceVault) data.priceVault = hist.priceVault; await ghPutFile('stock.json', JSON.stringify(data), 'Restore ' + old.version, cur.sha); A.live = data; A.busy = null; toast('Version ' + old.version + ' restored.'); render(); }
  catch (e) { A.busy = null; toast(e.message, true); render(); }
}
async function downloadVersion(path) {
  try { const X = await getXLSX(); const f = await ghGetFile(path); const st = JSON.parse(f.text).stock; const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, X.utils.json_to_sheet(st.items.map(i => ({ 'Item Code': i.code, 'Item Name': i.name, 'Division': i.division, 'Department': i.department, 'Type': i.type, 'RRP Without VAT': i.rrp / 1000, 'VAT 5%': vatOf(i.rrp) / 1000, 'RRP Incl VAT': (i.rrp + vatOf(i.rrp)) / 1000, 'Sohar 401': i.sohar, 'Khazaan SAR01': i.khazaan, 'Total': i.sohar + i.khazaan }))), 'STOCK');
    X.writeFile(wb, 'SARCO_' + st.version + '.xlsx'); } catch (e) { toast(e.message, true); }
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (!a) return; const k = a.dataset.act;
  if (a.type !== 'checkbox') e.preventDefault();
  if (k === 'tab') { A.tab = a.dataset.v; render(); }
  else if (k === 'setup-save') setupSave();
  else if (k === 'unlock') unlock();
  else if (k === 'reset-vault') { if (confirm('Remove the saved key from this laptop? You will need to paste the GitHub key again.')) { localStorage.removeItem('sarcoadm.vault'); sessionStorage.removeItem('sarcoadm.s'); A.unlocked = false; A.setup = null; render(); } }
  else if (k === 'lock') { sessionStorage.removeItem('sarcoadm.s'); A.unlocked = false; render(); }
  else if (k === 'crop-save') saveCrop();
  else if (k === 'crop-cancel') { A.crop = null; $('#modal').innerHTML = ''; }
  else if (k === 'pw-apply') {
    const txt = A.pwreq || ''; const m = txt.match(/\((CL\d+)\)[\s\S]*?Key:\s*([a-f0-9]{64})/i);
    if (!m) { toast('No password update found in the message. Paste the whole WhatsApp message.', true); return; }
    A.passwords = A.passwords || {}; A.passwords[m[1].toUpperCase()] = m[2].toLowerCase(); A.pwreq = ''; render(); toast('Password update for ' + m[1].toUpperCase() + ' added. Press PUBLISH.');
  }
  else if (k === 'pw-reset') { A.passwords[a.dataset.c] = 'RESET-' + Date.now(); render(); toast('Password for ' + a.dataset.c + ' will be sarco@123 after PUBLISH.'); }
  else if (k === 'pw-reset-sel') { const c = A.pwsel; if (!c) return; A.passwords = A.passwords || {}; A.passwords[c] = 'RESET-' + Date.now(); A.pwsel = ''; render(); toast('Password for ' + c + ' will be sarco@123 after PUBLISH.'); }
  else if (k === 'best-add') { A.best.add(a.dataset.c); render(); toast('★ Added. Press PUBLISH to show it to dealers.'); }
  else if (k === 'best-rm') { A.best.delete(a.dataset.c); render(); }
  else if (k === 'ack') { A.acks[+a.dataset.i] = a.checked; render(); }
  else if (k === 'oi-inc') { A.offerImport.include = a.checked; }
  else if (k === 'publish') { if (confirm('Publish to the dealer website now?')) publish(); }
  else if (k === 'map') { A.mapDraft = null; mapModal(a.dataset.sheet); }
  else if (k === 'map-apply') { const m = A.mapDraft; A.overrides[m.sheet] = { kind: m.kind, headerRow: m.headerRow, cols: m.cols }; A.mapDraft = null; $('#modal').innerHTML = ''; A.acks = {}; processNow(); render(); }
  else if (k === 'map-auto') { delete A.overrides[A.mapDraft.sheet]; A.mapDraft = null; $('#modal').innerHTML = ''; A.acks = {}; processNow(); render(); }
  else if (k === 'map-close') { A.mapDraft = null; $('#modal').innerHTML = ''; }
  else if (k === 'off-add') {
    const e2 = A.offEdit || {}; const items = new Map(((A.result ? A.result.items : A.live && A.live.stock && A.live.stock.items) || []).map(i => [i.code, i]));
    const code = normCode(e2.code); const pb = toBaisa(e2.price); if (!code || !isFinite(pb) || pb <= 0) { toast('Enter the item code and a price.', true); return; }
    const o = { id: 'O' + randomId(8), code, priceEx: e2.basis === 'inc' ? Math.round(pb * 100 / 105) : pb, start: e2.start, end: e2.end, source: 'Manual' };
    const pr = offerProblems(o, items.get(code)); if (pr.length) { toast(pr.join('; '), true); return; }
    if (!items.get(code)) toast('Note: ' + code + ' is not in stock; dealers will not see this offer until it is.');
    A.offers = (A.offers || []).filter(x => !(x.code === code && !(x.end < o.start || x.start > o.end))); A.offers.push(o); A.offEdit = null; render(); toast('Offer added. Press PUBLISH to send it to the website.');
  }
  else if (k === 'off-del') { A.offers = A.offers.filter(o => o.id !== a.dataset.id); render(); }
  else if (k === 'gh-save') { LS.set('gh', A.gh); gh('').then(j => { if (!j) throw new Error('Repository not found. Check the user name and repository name.'); toast('Connected to ' + j.full_name + '.'); A.live = null; A.offers = null; A.dealersText = null; loadLive(); }).catch(err => toast(err.message, true)); }
  else if (k === 'gh-forget') { A.gh.token = ''; LS.set('gh', A.gh); render(); toast('Token removed from this computer.'); }
  else if (k === 'h-restore') restore(a.dataset.p);
  else if (k === 'h-dl') downloadVersion(a.dataset.p);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-input]'); if (!el) return; const k = el.dataset.input;
  if (k === 'gh') A.gh[el.dataset.k] = el.value.trim();
  else if (k === 'gs') A.setup[el.dataset.k] = el.dataset.k === 'pw' ? el.value : el.value.trim();
  else if (k === 'bq') { A.bq = el.value; const items = ((A.result ? A.result.items : A.live && A.live.stock && A.live.stock.items) || []); const b = $('#bres'); if (b) b.innerHTML = bestResults(A.bq.trim() ? searchItems(buildSearchIndex(items), items, A.bq).slice(0, 25).map(i => items[i]) : [], A.best); }
  else if (k === 'pq') { A.pq = el.value; renderPreview(); }
  else if (k === 'oi') { A.offerImport[el.dataset.k] = el.value; const s = $('#oisum'); if (s) s.textContent = offerImportSummary(); }
  else if (k === 'oe') { A.offEdit = A.offEdit || { basis: 'ex', start: TODAY, end: '', code: '', price: '' }; A.offEdit[el.dataset.k] = el.value; }
  else if (k === 'dealers') A.dealersText = el.value;
  else if (k === 'pwreq') A.pwreq = el.value;
  else if (k === 'pwsel') A.pwsel = el.value;
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-input]'); if (!el) return; const k = el.dataset.input;
  if (k === 'upl' && el.files[0]) handleUpload(el.files[0]);
  else if (k === 'signfile' && el.files[0]) openCrop(el.files[0], el.dataset.c);
  else if (k === 'dealers') render();
  else if (k === 'mk') { A.mapDraft.kind = el.value; mapModal(A.mapDraft.sheet); }
  else if (k === 'mh') { const v = Math.max(1, parseInt(el.value, 10) || 1) - 1; const sh = A.sheets.find(s => s.name === A.mapDraft.sheet); A.mapDraft.headerRow = v; A.mapDraft.cols = mapHeaderRow(sh.rows[v] || []); mapModal(A.mapDraft.sheet); }
  else if (k === 'mc') { if (el.value === '') delete A.mapDraft.cols[el.dataset.f]; else A.mapDraft.cols[el.dataset.f] = parseInt(el.value, 10); }
});
document.addEventListener('dragover', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('hover'); } });
document.addEventListener('drop', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); } });
async function setupSave() {
  const g = A.setup; if (!g.owner || !g.repo || !g.token) { toast('Fill in the user name, repository and GitHub key.', true); return; }
  if ((g.pw || '').length < 4) { toast('Choose a password (at least 4 characters).', true); return; }
  A.gh = { owner: g.owner, repo: g.repo, branch: 'main', token: g.token.trim() };
  try { const j = await gh(''); if (!j) throw new Error('Repository not found. Check the user name and repository name.'); if (j.permissions && !j.permissions.push) throw new Error('This key cannot write to the repository. Give it Contents: Read and write.'); }
  catch (e) { A.gh.token = ''; toast(e.message, true); return; }
  A.adminPw = g.pw; await lockVault(A.gh, g.pw); sessionStorage.setItem('sarcoadm.s', JSON.stringify(A.gh)); A.setup = null; A.unlocked = true; toast('Connected. Next time just type your password.'); A.live = null; loadLive(); render();
}
async function unlock() {
  const pw = ($('#pw') || {}).value || ''; const g = await openVault(pw);
  if (!g) { toast('Wrong password.', true); return; }
  A.gh = g; A.adminPw = pw; sessionStorage.setItem('sarcoadm.s', JSON.stringify(g)); A.unlocked = true; A.tab = 'upload'; A.live = null; A.offers = null; A.dealersText = null; A.best = null; render(); loadLive();
}
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'pw') unlock(); });
try { const s = JSON.parse(sessionStorage.getItem('sarcoadm.s') || 'null'); if (s && s.token) { A.gh = s; A.unlocked = true; } } catch (e) { }
render(); loadLive();
