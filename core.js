/* ================= CORE ENGINE (shared by admin and dealer views) ================= */
const TZ = 'Asia/Muscat';
const VAT_PERCENT = 5;
const WAREHOUSES = [
  { code: '401', key: 'sohar', name: 'Sohar', label: 'Sohar (401)' },
  { code: 'SAR01', key: 'khazaan', name: 'Khazaan', label: 'Khazaan (SAR01)' }
];
const WH_BY_CODE = { '401': WAREHOUSES[0], 'SAR01': WAREHOUSES[1], 'ALL': { code: 'ALL', key: 'all', name: 'total stock', label: '' } };
const BRAND_FILTER = 'SAMSUNG';
const CATS = [
  { key: 'ha', label: 'Home Appliances' },
  { key: 'tv', label: 'Television' },
  { key: 'ac', label: 'Air Conditioning' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'av', label: 'Audio & Video' },
  { key: 'candy', label: 'Candy Built-in' },
  { key: 'acc', label: 'Accessories & Services' },
  { key: 'other', label: 'Other' }
];
const CAT_LABEL = Object.fromEntries(CATS.map(c => [c.key, c.label]));
const STATUSES = ['Draft', 'Awaiting Signed Order', 'Submitted', 'Awaiting SARCO Confirmation', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];

/* ---------- dates (Oman time) ---------- */
function muscatParts(d) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const o = {};
  for (const p of f.formatToParts(d)) o[p.type] = p.value;
  return o;
}
function muscatToday(d) { const p = muscatParts(d || new Date()); return p.year + '-' + p.month + '-' + p.day; }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '—';
  const [y, m, d] = iso.split('-');
  return parseInt(d, 10) + ' ' + MONTHS[parseInt(m, 10) - 1] + ' ' + y;
}
function fmtDateTime(ts) {
  if (!ts) return '—';
  const p = muscatParts(new Date(ts));
  return parseInt(p.day, 10) + ' ' + MONTHS[parseInt(p.month, 10) - 1] + ' ' + p.year + ', ' + p.hour + ':' + p.minute;
}
function isValidIsoDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
/* Accepts Date, Excel serial, 'YYYY-MM-DD', 'DD-MMM-YYYY', 'DD/MM/YYYY' -> 'YYYY-MM-DD' or null */
function toIsoDate(v) {
  if (v == null || v === '') return null;
  const pad = n => String(n).padStart(2, '0');
  if (v instanceof Date && !isNaN(v)) {
    // SheetJS dates are local-midnight; use local components to avoid timezone shift
    return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
  }
  if (typeof v === 'number' && v > 20000 && v < 80000) {
    const ms = Math.round((v - 25569) * 86400000);
    const d = new Date(ms);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) { const r = m[1] + '-' + pad(m[2]) + '-' + pad(m[3]); return isValidIsoDate(r) ? r : null; }
  m = s.match(/^(\d{1,2})[-\s\/.]([A-Za-z]{3,9})[-\s\/.,]*(\d{2,4})$/);
  if (m) {
    const mi = MONTHS.findIndex(x => m[2].toLowerCase().startsWith(x.toLowerCase()));
    if (mi < 0) return null;
    let y = parseInt(m[3], 10); if (y < 100) y += 2000;
    const r = y + '-' + pad(mi + 1) + '-' + pad(m[1]);
    return isValidIsoDate(r) ? r : null;
  }
  m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if (m) { const r = m[3] + '-' + pad(m[2]) + '-' + pad(m[1]); return isValidIsoDate(r) ? r : null; }
  return null;
}

/* ---------- money in integer baisa (1 OMR = 1000 baisa) ---------- */
function toBaisa(n) { const x = Number(n); return isFinite(x) ? Math.round(x * 1000) : NaN; }
function vatOf(b) { return Math.round(b * VAT_PERCENT / 100); }
function fmtOMR(b, withCur) {
  if (b == null || !isFinite(b)) return '—';
  const neg = b < 0; const a = Math.abs(Math.round(b));
  const ip = Math.floor(a / 1000), fp = String(a % 1000).padStart(3, '0');
  const s = (neg ? '-' : '') + String(ip).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + fp;
  return withCur === false ? s : 'OMR ' + s;
}
function discountPct(rrp, offer) { return rrp > 0 ? (rrp - offer) / rrp * 100 : 0; }

/* ---------- text helpers ---------- */
function normHeader(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
function normCode(v) { return v == null ? '' : String(v).trim().replace(/\s+/g, ' ').toUpperCase(); }
function normLoc(v) {
  if (v == null) return '';
  if (typeof v === 'number') return String(Math.round(v));
  return String(v).trim().toUpperCase();
}
function cleanText(v) { return v == null ? '' : String(v).replace(/\s+/g, ' ').trim(); }
function parseQty(v) {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return isFinite(v) ? v : NaN;
  const s = String(v).replace(/,/g, '').trim();
  if (s === '' || s === '-') return 0;
  const n = Number(s);
  return isFinite(n) ? n : NaN;
}
function parseMoney(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return isFinite(n) && String(v).trim() !== '' ? n : null;
}

/* ---------- column mapping ---------- */
const FIELD_DEFS = {
  code: { label: 'Item Code', syn: ['itemcode', 'itemno', 'itemnumber', 'modelno', 'model', 'modelnumber', 'sku', 'productcode', 'item'] },
  name: { label: 'Item Name', syn: ['itemname', 'itemdescription', 'description', 'productname', 'productdescription'] },
  brand: { label: 'Brand', syn: ['brand', 'brandname'] },
  type: { label: 'Product Type', syn: ['type', 'producttype', 'itemtype'] },
  division: { label: 'Division Name', syn: ['divisionname', 'division'] },
  department: { label: 'Department Name', syn: ['departmentname', 'department'] },
  loc: { label: 'Location Code', syn: ['locationcode', 'loccode', 'warehousecode', 'whcode', 'storecode', 'location'] },
  locName: { label: 'Location Name', syn: ['locationname', 'warehousename', 'warehouse', 'storename'] },
  confirmed: { label: 'Confirmed Stock', syn: ['confirmedstockquntity', 'confirmedstockquantity', 'confirmedstock', 'confirmedqty', 'confirmedquantity'] },
  reserved: { label: 'Reserved Quantity', syn: ['reservedquantity', 'reservedqty', 'reserved', 'reservedstock'] },
  unconfIss: { label: 'Unconfirmed Issuances', syn: ['unconfimedissuances', 'unconfirmedissuances', 'unconfirmedissuance', 'unconfimedissuance', 'pendingissues'] },
  blocked: { label: 'Blocked Quantity', syn: ['blockedquantity', 'blockedqty', 'blocked', 'blockedstock'] },
  unconfRec: { label: 'Unconfirmed Receipt', syn: ['unconfirmedreceipt', 'unconfirmedreceipts'] },
  free: { label: 'Free Stock', syn: ['freestock', 'freeqty', 'freequantity'] },
  rrp: { label: 'RRP Without VAT', syn: ['rrpwithoutvat', 'rrpexclvat', 'rrpexvat', 'rrpwithoutvatomr', 'rrp', 'mrp', 'retailprice'] },
  discount: { label: 'Discount (excl. VAT)', syn: ['discount', 'discountamount', 'discountexclvat'] },
  offerPrice: { label: 'Offer Price (excl. VAT)', syn: ['offerprice', 'offerpriceexclvat', 'promoprice', 'offerpricewithoutvat'] },
  offerPriceInc: { label: 'Offer Price (incl. VAT)', syn: ['offerpriceinclvat', 'offerpriceinclvatomr', 'offerpricewithvat', 'promopriceinclvat', 'invoicepricenetdpwithvat', 'invoicepricenetdpinclvat', 'invoicepricewithvat', 'invoicepriceinclvat', 'netdpwithvat', 'netdpinclvat'] },
  offerStart: { label: 'Offer Start Date', syn: ['offerstartdate', 'startdate', 'validfrom', 'promostart', 'offerstart'] },
  offerEnd: { label: 'Offer Expiry Date', syn: ['offerexpirydate', 'offerenddate', 'enddate', 'validtill', 'validto', 'offervalidtill', 'expirydate', 'promotill'] },
  mLulu: { label: "Lulu", syn: ["lulu", "luluomr", "luluprice", "lulupriceomr", "luluinclvat", "lulupriceinclvat", "lulushelfprice", "luluhypermarket", "luluhypermarketomr", "luluhypermarketprice", "luluhypermarketpriceomr", "luluhypermarketinclvat", "luluhypermarketpriceinclvat", "luluhypermarketshelfprice"] },
  mNesto: { label: "Nesto", syn: ["nesto", "nestoomr", "nestoprice", "nestopriceomr", "nestoinclvat", "nestopriceinclvat", "nestoshelfprice", "nestohypermarket", "nestohypermarketomr", "nestohypermarketprice", "nestohypermarketpriceomr", "nestohypermarketinclvat", "nestohypermarketpriceinclvat", "nestohypermarketshelfprice"] },
  mSharaf: { label: "Sharaf DG", syn: ["sharafdg", "sharafdgomr", "sharafdgprice", "sharafdgpriceomr", "sharafdginclvat", "sharafdgpriceinclvat", "sharafdgshelfprice", "sharaf", "sharafomr", "sharafprice", "sharafpriceomr", "sharafinclvat", "sharafpriceinclvat", "sharafshelfprice"] },
  mExtra: { label: "Extra", syn: ["extra", "extraomr", "extraprice", "extrapriceomr", "extrainclvat", "extrapriceinclvat", "extrashelfprice", "extrastores", "extrastoresomr", "extrastoresprice", "extrastorespriceomr", "extrastoresinclvat", "extrastorespriceinclvat", "extrastoresshelfprice"] },
  mHypermax: { label: "Hypermax", syn: ["hypermax", "hypermaxomr", "hypermaxprice", "hypermaxpriceomr", "hypermaxinclvat", "hypermaxpriceinclvat", "hypermaxshelfprice"] },
  mCarrefour: { label: "Carrefour", syn: ["carrefour", "carrefouromr", "carrefourprice", "carrefourpriceomr", "carrefourinclvat", "carrefourpriceinclvat", "carrefourshelfprice"] },
  mDate: { label: "Market price date", syn: ["datechecked", "checkedon", "checkdate", "pricedate", "marketdate", "marketpricedate", "datecheckedon"] },
  sohar: { label: 'Confirmed Stock Sohar 401', syn: ['confirmedstocksohar401', 'confirmedsohar401', 'sohar401', 'confirmedstocksohar', 'soharstock'] },
  freeS: { label: 'Free Stock Sohar 401', syn: ['freestocksohar401', 'freesohar401'] },
  freeK: { label: 'Free Stock Khazaan SAR01', syn: ['freestockkhazeansar01', 'freestockkhazaansar01', 'freekhazeansar01'] },
  khazaan: { label: 'Confirmed Stock Khazaan SAR01', syn: ['confirmedstockkhazeansar01', 'confirmedstockkhazaansar01', 'confirmedstockkhazansar01', 'khazeansar01', 'khazaansar01', 'confirmedstockkhazean', 'confirmedstockkhazaan', 'khazaanstock'] }
};
const KIND_FIELDS = {
  main: { required: ['code', 'rrp', 'sohar', 'khazaan'], optional: ['name', 'brand', 'type', 'department', 'division', 'offerPriceInc', 'offerEnd', 'freeS', 'freeK'] },
  stock: { required: ['code', 'loc', 'confirmed'], optional: ['name', 'brand', 'type', 'division', 'department', 'locName', 'reserved', 'unconfIss', 'blocked', 'unconfRec', 'free'] },
  rrp: { required: ['code', 'rrp'], optional: ['name', 'division', 'department', 'type'] },
  offer: { required: ['code'], optional: ['rrp', 'discount', 'offerPrice', 'offerPriceInc', 'offerStart', 'offerEnd'] },
  market: { required: ['code'], optional: ['mLulu', 'mNesto', 'mSharaf', 'mExtra', 'mHypermax', 'mCarrefour', 'mDate'] }
};

/* market price columns: [field, display name] – prices are shelf prices incl. VAT (OMR) */
const MARKET_STORES = [['mLulu', 'Lulu'], ['mNesto', 'Nesto'], ['mSharaf', 'Sharaf DG'], ['mExtra', 'Extra'], ['mHypermax', 'Hypermax'], ['mCarrefour', 'Carrefour']];
function mapHeaderRow(row) {
  const cols = {}; const used = new Set();
  const normed = (row || []).map(normHeader);
  for (const f of Object.keys(FIELD_DEFS)) {
    for (const syn of FIELD_DEFS[f].syn) {
      const idx = normed.findIndex((h, i) => h === syn && !used.has(i));
      if (idx >= 0) { cols[f] = idx; used.add(idx); break; }
    }
  }
  return cols;
}

function detectSheet(name, rows) {
  let best = null;
  const lim = Math.min(rows.length, 15);
  for (let r = 0; r < lim; r++) {
    const cols = mapHeaderRow(rows[r]);
    const n = Object.keys(cols).length;
    if (cols.code != null && n >= 2 && (!best || n > best.n)) best = { r, cols, n };
  }
  const res = { name, rows: rows.length, kind: 'unknown', headerRow: null, cols: {}, headers: [], note: '' };
  if (!best) { res.note = 'No recognisable header row (Item Code not found).'; return res; }
  res.headerRow = best.r; res.cols = best.cols; res.headers = (rows[best.r] || []).map(h => cleanText(h));
  const hn = res.headers.map(normHeader);
  const c = best.cols;
  if (c.sohar != null && c.khazaan != null) { res.kind = 'main'; res.note = 'MAIN SHEET – used as the stock and price source.'; }
  else if (c.loc != null) res.kind = 'stock';
  else if (hn.some(h => h.includes('confirmed') || h.includes('freestock'))) { res.kind = 'summary'; res.note = 'Summary/derived sheet – ignored (stock is read from raw location-wise sheets only).'; }
  else if (MARKET_STORES.some(m => c[m[0]] != null)) { res.kind = 'market'; res.note = 'MARKET PRICES – shelf prices in Oman, compared with running offers only.'; }
  else if (c.discount != null || c.offerPrice != null || c.offerPriceInc != null) res.kind = 'offer';
  else if (c.rrp != null) res.kind = 'rrp';
  if (res.kind === 'offer') {
    const top = rows.slice(0, best.r).map(r => (r || []).map(cleanText).join(' ')).join(' ');
    const till = top.match(/(?:till|until|to|expiry|expires)\s*[:\-]?\s*(\d{1,2}[-\s\/.][A-Za-z]{3,9}[-\s\/.]\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
    const from = top.match(/(?:from|start(?:s|ing)?)\s*[:\-]?\s*(\d{1,2}[-\s\/.][A-Za-z]{3,9}[-\s\/.]\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
    res.offerEndText = till ? toIsoDate(till[1]) : null;
    res.offerStartText = from ? toIsoDate(from[1]) : null;
    res.offerTitle = cleanText(top).slice(0, 140);
  }
  return res;
}

function missingFields(kind, cols) {
  const def = KIND_FIELDS[kind];
  if (!def) return [];
  return def.required.filter(f => cols[f] == null);
}

/* ---------- categorisation, model, keywords ---------- */
function categorize(division, department, type, brand) {
  const B = String(brand || '').toUpperCase();
  if (B === 'CANDY') return 'candy';
  if (B === 'MULTI BRAND') return 'acc';
  const d = (division + ' ' + department).toUpperCase();
  const t = String(type || '').toUpperCase();
  if (t.includes('AIRCONDITION') || t.includes('AIR CONDITION') || t === 'AC' || d.includes('AIR CONDITION')) return 'ac';
  if (d.includes('HANDHELD') || d.includes('HHP') || d.includes('ACC&WEAR') || d.includes('WEARABLE') || d.includes('MOBILE') || /MOBILE|TABLET|WEARABLE|SMARTPHONE/.test(t)) return 'mobile';
  if (d.includes('VISUAL') || d.includes('(VD)')) {
    if (/UHD|QLED|OLED|8K|NEO|TELEVISION|LIFESTYLE|\bTV\b|FHD|CRYSTAL|FRAME/.test(t)) return 'tv';
    return 'av';
  }
  if (d.includes('DIGITAL APPLIANCE') || d.includes('(DA)') || d.includes('HOME APPLIANCE')) return 'ha';
  return 'other';
}
function modelOf(code) { return code.replace(/-MHD$/i, '').replace(/-SRVC$/i, '').replace(/\/.*$/, ''); }

const TYPE_ALIASES = [
  [/REFRIGERATOR|FRIDGE/, 'refrigerator fridge ref freezer'],
  [/^(?!.*DISH).*(WASHING|WASHER)/, 'washing machine washer wm laundry'],
  [/DRYER/, 'dryer'],
  [/AIRCONDITION|AIR CONDITION/, 'ac aircon air conditioner airconditioner split'],
  [/MICROWAVE/, 'microwave mwo oven'],
  [/DISH ?WASHER/, 'dishwasher dish washer dw'],
  [/VACUUM/, 'vacuum cleaner hoover'],
  [/UHD|QLED|OLED|8K|NEO|TELEVISION|LIFESTYLE|\bTV\b/, 'tv television led smart screen'],
  [/AUDIO/, 'audio soundbar sound bar speaker home theatre'],
  [/PROJECTOR/, 'projector'],
  [/BUILT ?IN/, 'built in builtin oven hob hood']
];
const CAT_ALIASES = { ha: 'home appliance appliances', tv: 'tv television', ac: 'ac air conditioning', mobile: 'mobile phone smartphone galaxy', av: 'audio video', candy: 'candy built in builtin oven hob hood', acc: 'accessories bracket wall mount installation service', other: '' };

function keywordsFor(it) {
  const extra = [];
  const T = (it.type + ' ' + it.name).toUpperCase();
  for (const [re, words] of TYPE_ALIASES) if (re.test(T)) extra.push(words);
  extra.push(CAT_ALIASES[it.cat] || '');
  const nm = it.name;
  if (/TOP ?LOAD/i.test(nm) || /^WA\d/.test(it.code)) extra.push('top load toploader');
  if (/FRONT ?LOAD/i.test(nm) || /^WW\d/.test(it.code)) extra.push('front load frontloader');
  if (it.cat === 'tv') {
    const m = it.code.match(/^[A-Z]{2}(\d{2,3})/);
    if (m) extra.push(m[1] + ' ' + m[1] + 'inch inch');
  }
  const lit = nm.match(/(\d{2,4})\s*(?:l|lt|ltr|ltrs|lit|liter|liters|litre|litres)\b/i);
  if (lit) extra.push(lit[1] + ' ' + lit[1] + 'l litre liter');
  if (it.cat === 'ac') {
    const ac = it.code.match(/^AR(\d{2})/);
    const map = { '09': '0.75', '12': '1', '18': '1.5', '24': '2', '30': '2.5', '36': '3' };
    if (ac && map[ac[1]]) extra.push(map[ac[1]] + ' ' + map[ac[1]] + 'ton ton');
    const tn = nm.match(/(\d(?:\.\d)?)\s*(?:t\b|ton)/i);
    if (tn) extra.push(tn[1] + ' ' + tn[1] + 'ton ton');
  }
  return extra.join(' ');
}

/* ---------- workbook processing ---------- */
/* sheets: [{name, rows}] ; opts: {overrides:{[sheet]:{kind, headerRow, cols}}, prevItems:[...], prevVersion} */
function processWorkbook(sheets, opts) {
  opts = opts || {};
  const overrides = opts.overrides || {};
  const errors = [], warnings = [], reviews = [];
  const detected = sheets.map(s => {
    const d = detectSheet(s.name, s.rows);
    const ov = overrides[s.name];
    if (ov) {
      if (ov.kind) d.kind = ov.kind;
      if (ov.headerRow != null) { d.headerRow = ov.headerRow; d.headers = (s.rows[ov.headerRow] || []).map(cleanText); }
      if (ov.cols) d.cols = Object.assign({}, ov.cols);
      d.overridden = true;
    }
    d.missing = missingFields(d.kind, d.cols);
    return d;
  });
  const mainSheet = detected.find(d => d.kind === 'main' && !d.missing.length);
  if (mainSheet) return processMainSheet(mainSheet, sheets.find(s => s.name === mainSheet.name).rows, detected, Object.assign({}, opts, { sheets }));
  const stockSheets = detected.filter(d => d.kind === 'stock');
  const rrpSheets = detected.filter(d => d.kind === 'rrp');
  const offerSheets = detected.filter(d => d.kind === 'offer');
  if (!stockSheets.length) errors.push('No stock sheet found. A stock sheet needs Item Code, Location Code and Confirmed Stock columns. Use column mapping if the headers changed.');
  for (const d of [...stockSheets, ...rrpSheets]) {
    if (d.missing.length) errors.push('Sheet "' + d.name + '": required column(s) missing – ' + d.missing.map(f => FIELD_DEFS[f].label).join(', ') + '. Map them manually to continue.');
  }
  for (const d of stockSheets) {
    if (d.cols.reserved == null) reviews.push('Sheet "' + d.name + '" has no Reserved Quantity column. Quantities may include reserved stock.');
    if (d.cols.unconfIss == null) warnings.push('Sheet "' + d.name + '" has no Unconfirmed Issuances column; pending issues cannot be deducted.');
    if (d.cols.brand == null) reviews.push('Sheet "' + d.name + '" has no Brand column, so non-Samsung items cannot be filtered out.');
  }

  const sheetRows = Object.fromEntries(sheets.map(s => [s.name, s.rows]));
  const ex = { brand: 0, brandList: {}, location: {}, ghala: 0, noCode: 0, noRrp: [], zero: 0, conflictRrp: [] };
  const rowStats = { stockRowsRead: 0, approvedRows: 0 };
  const stock = new Map(); // code -> {meta, loc:{401:{...}, SAR01:{...}}}
  const seen = new Map();
  const dupIgnored = [];
  const conflicts = [];

  for (const d of stockSheets) {
    if (d.missing.length) continue;
    const rows = sheetRows[d.name]; const c = d.cols;
    for (let r = d.headerRow + 1; r < rows.length; r++) {
      const row = rows[r]; if (!row) continue;
      const code = normCode(row[c.code]);
      if (!code) { if (row.some(v => v != null && v !== '')) ex.noCode++; continue; }
      rowStats.stockRowsRead++;
      if (c.brand != null) {
        const b = cleanText(row[c.brand]).toUpperCase();
        if (b !== BRAND_FILTER) { ex.brand++; ex.brandList[b || '(blank)'] = (ex.brandList[b || '(blank)'] || 0) + 1; continue; }
      }
      const loc = normLoc(row[c.loc]);
      if (!WH_BY_CODE[loc]) { ex.location[loc || '(blank)'] = (ex.location[loc || '(blank)'] || 0) + 1; if (loc === '14') ex.ghala++; continue; }
      rowStats.approvedRows++;
      const q = {};
      for (const f of ['confirmed', 'reserved', 'unconfIss', 'blocked', 'unconfRec', 'free']) q[f] = c[f] != null ? parseQty(row[c[f]]) : 0;
      const bad = Object.keys(q).filter(f => isNaN(q[f]));
      if (bad.length) { errors.push('Sheet "' + d.name + '" row ' + (r + 1) + ' (' + code + ' @ ' + loc + '): non-numeric ' + bad.map(f => FIELD_DEFS[f].label).join(', ') + '.'); continue; }
      for (const f of ['confirmed', 'reserved', 'unconfIss', 'blocked']) {
        if (q[f] < 0) { warnings.push(code + ' @ ' + loc + ': negative ' + FIELD_DEFS[f].label + ' (' + q[f] + ') treated as 0.'); q[f] = 0; }
        if (!Number.isInteger(q[f])) { warnings.push(code + ' @ ' + loc + ': fractional ' + FIELD_DEFS[f].label + ' (' + q[f] + ') rounded down.'); q[f] = Math.floor(q[f]); }
      }
      const key = code + '|' + loc;
      const sig = [q.confirmed, q.reserved, q.unconfIss, q.blocked].join('/');
      if (seen.has(key)) {
        const prev = seen.get(key);
        if (prev.sig === sig) dupIgnored.push(key + ' (sheet "' + d.name + '" row ' + (r + 1) + ')');
        else conflicts.push(code + ' @ ' + loc + ': "' + prev.sheet + '" row ' + prev.row + ' (' + prev.sig + ') vs "' + d.name + '" row ' + (r + 1) + ' (' + sig + ')');
        continue;
      }
      seen.set(key, { sig, sheet: d.name, row: r + 1 });
      const available = Math.max(0, q.confirmed - q.reserved - q.unconfIss - q.blocked);
      let e = stock.get(code);
      if (!e) {
        e = { code, name: c.name != null ? cleanText(row[c.name]) : '', type: c.type != null ? cleanText(row[c.type]) : '', division: c.division != null ? cleanText(row[c.division]) : '', department: c.department != null ? cleanText(row[c.department]) : '', loc: {} };
        stock.set(code, e);
      }
      e.loc[loc] = { confirmed: q.confirmed, reserved: q.reserved, unconfIss: q.unconfIss, blocked: q.blocked, free: q.free, available };
    }
  }
  if (conflicts.length) errors.push('Conflicting duplicate rows for the same item and warehouse (' + conflicts.length + '): ' + conflicts.slice(0, 8).join('; ') + (conflicts.length > 8 ? ' …' : ''));
  if (dupIgnored.length) warnings.push(dupIgnored.length + ' exact duplicate stock row(s) ignored (counted once): ' + dupIgnored.slice(0, 6).join(', ') + (dupIgnored.length > 6 ? ' …' : ''));

  /* RRP */
  const rrp = new Map(); const rrpMeta = new Map(); const rrpConflict = new Set();
  for (const d of rrpSheets) {
    if (d.missing.length) continue;
    const rows = sheetRows[d.name]; const c = d.cols;
    for (let r = d.headerRow + 1; r < rows.length; r++) {
      const row = rows[r]; if (!row) continue;
      const code = normCode(row[c.code]); if (!code) continue;
      const v = parseMoney(row[c.rrp]);
      if (v == null || v <= 0) continue;
      const b = toBaisa(v);
      if (rrp.has(code) && rrp.get(code) !== b) rrpConflict.add(code);
      else if (!rrp.has(code)) {
        rrp.set(code, b);
        rrpMeta.set(code, { name: c.name != null ? cleanText(row[c.name]) : '', division: c.division != null ? cleanText(row[c.division]) : '', department: c.department != null ? cleanText(row[c.department]) : '' });
      }
    }
  }
  let rrpSource = 'upload';
  const prevRrp = new Map((opts.prevItems || []).map(i => [i.code, i.rrp]));
  if (!rrpSheets.length) {
    if (prevRrp.size) { rrpSource = 'previous'; reviews.push('No RRP sheet in this upload. RRP will be taken from the currently published stock (version ' + (opts.prevVersion || '—') + '). New items without a previous RRP will be excluded.'); }
    else errors.push('No RRP sheet found and no previously published RRP is available. Include the RRP price list sheet (Item Code + RRP Without VAT).');
  }
  if (rrpConflict.size) warnings.push(rrpConflict.size + ' item code(s) have conflicting RRP values across rows and are excluded: ' + [...rrpConflict].slice(0, 8).join(', '));

  /* Build items */
  const items = [];
  for (const e of stock.values()) {
    let r = rrpSource === 'upload' ? rrp.get(e.code) : prevRrp.get(e.code);
    if (rrpConflict.has(e.code)) { ex.conflictRrp.push(e.code); continue; }
    const s = e.loc['401'] ? e.loc['401'].available : 0;
    const k = e.loc['SAR01'] ? e.loc['SAR01'].available : 0;
    if (s + k <= 0) { ex.zero++; continue; }
    if (!r || r <= 0) { ex.noRrp.push(e.code); continue; }
    const meta = rrpMeta.get(e.code) || {};
    const it = {
      code: e.code,
      model: modelOf(e.code),
      name: e.name || meta.name || e.code,
      type: e.type || '',
      division: e.division || meta.division || '',
      department: e.department || meta.department || '',
      rrp: r,
      sohar: s,
      khazaan: k,
      raw: {
        s: e.loc['401'] ? [e.loc['401'].confirmed, e.loc['401'].reserved, e.loc['401'].unconfIss] : [0, 0, 0],
        k: e.loc['SAR01'] ? [e.loc['SAR01'].confirmed, e.loc['SAR01'].reserved, e.loc['SAR01'].unconfIss] : [0, 0, 0]
      }
    };
    it.cat = categorize(it.division, it.department, it.type);
    it.kw = keywordsFor(it);
    items.push(it);
  }
  const TYPE_ORDER = ['REFRIGERATOR', 'WASHING MACHINE', 'DISH WASHER', 'DRYER', 'MICROWAVE OVEN', 'BUILT IN', 'VACUUM CLEANER'];
  const tRank = it => { const i = TYPE_ORDER.indexOf(it.type.toUpperCase()); return i < 0 ? 99 : i; };
  const wmRank = it => /^WA/.test(it.code) ? 0 : /^WW/.test(it.code) ? 1 : /^WD/.test(it.code) ? 2 : 3; // top load, front load, washer dryer
  items.sort((a, b) => CATS.findIndex(c => c.key === a.cat) - CATS.findIndex(c => c.key === b.cat) || tRank(a) - tRank(b) || a.type.localeCompare(b.type) || wmRank(a) - wmRank(b) || a.code.localeCompare(b.code));

  /* Validation checks */
  const totS = items.reduce((a, i) => a + i.sohar, 0), totK = items.reduce((a, i) => a + i.khazaan, 0);
  let rowLevel = 0;
  for (const it of items) { const e = stock.get(it.code); for (const l of ['401', 'SAR01']) if (e.loc[l]) rowLevel += e.loc[l].available; }
  const codes = new Set(items.map(i => i.code));
  const checks = [
    { label: 'Only Sohar (401) and Khazaan (SAR01) stock included', ok: items.every(i => { const e = stock.get(i.code); return Object.keys(e.loc).every(l => WH_BY_CODE[l]); }) },
    { label: 'Ghala (14) rows excluded', ok: true, info: ex.ghala + ' row(s) excluded' },
    { label: 'No duplicate item codes in published list', ok: codes.size === items.length },
    { label: 'Every product has a valid RRP (> 0)', ok: items.every(i => i.rrp > 0) },
    { label: 'Every product has confirmed available stock (> 0)', ok: items.every(i => i.sohar + i.khazaan > 0) },
    { label: 'Warehouse totals reconcile with row-level totals', ok: totS + totK === rowLevel, info: (totS + totK) + ' = ' + rowLevel },
    { label: 'VAT = 5% of RRP for every product', ok: items.every(i => vatOf(i.rrp) === Math.round(i.rrp * 0.05)) }
  ];
  if (!items.length && !errors.length) errors.push('Processing produced 0 publishable products. Check that the file contains Samsung stock at 401/SAR01 with RRP.');
  if (checks.some(c => !c.ok)) errors.push('One or more validation checks failed: ' + checks.filter(c => !c.ok).map(c => c.label).join('; '));

  /* Change vs previous */
  let diff = null;
  if (opts.prevItems && opts.prevItems.length) {
    const prev = new Map(opts.prevItems.map(i => [i.code, i]));
    const added = items.filter(i => !prev.has(i.code)).map(i => i.code);
    const removed = opts.prevItems.filter(i => !codes.has(i.code)).map(i => i.code);
    const changed = items.filter(i => prev.has(i.code) && (prev.get(i.code).sohar !== i.sohar || prev.get(i.code).khazaan !== i.khazaan)).length;
    const priceChanged = items.filter(i => prev.has(i.code) && prev.get(i.code).rrp !== i.rrp).length;
    diff = { added, removed, changed, priceChanged };
    if (opts.prevItems.length >= 20 && items.length < opts.prevItems.length * 0.5) reviews.push('Product count dropped from ' + opts.prevItems.length + ' to ' + items.length + ' (more than 50%). Confirm the file is complete.');
  }

  /* Offers detected */
  const offerRows = [];
  for (const d of offerSheets) {
    const rows = sheetRows[d.name]; const c = d.cols;
    for (let r = d.headerRow + 1; r < rows.length; r++) {
      const row = rows[r]; if (!row) continue;
      const code = normCode(row[c.code]); if (!code) continue;
      let ex2 = null, basis = '';
      const rrpV = c.rrp != null ? parseMoney(row[c.rrp]) : null;
      const disc = c.discount != null ? parseMoney(row[c.discount]) : null;
      if (c.offerPrice != null && parseMoney(row[c.offerPrice]) != null) { ex2 = toBaisa(parseMoney(row[c.offerPrice])); basis = 'Offer price (excl. VAT) column'; }
      else if (c.offerPriceInc != null && parseMoney(row[c.offerPriceInc]) != null) { ex2 = Math.round(toBaisa(parseMoney(row[c.offerPriceInc])) * 100 / (100 + VAT_PERCENT)); basis = 'Offer price (incl. VAT) ÷ 1.05'; }
      else if (rrpV != null && disc != null) { ex2 = toBaisa(rrpV) - toBaisa(disc); basis = 'RRP − Discount (excl. VAT)'; }
      if (ex2 == null) continue;
      offerRows.push({
        code, priceEx: ex2, sheetRrp: rrpV != null ? toBaisa(rrpV) : null, basis,
        start: c.offerStart != null ? toIsoDate(row[c.offerStart]) : d.offerStartText || null,
        end: c.offerEnd != null ? toIsoDate(row[c.offerEnd]) : d.offerEndText || null,
        source: d.name + (d.offerTitle ? ' – ' + d.offerTitle : '')
      });
    }
  }

  return {
    detected: detected.map(d => ({ name: d.name, kind: d.kind, headerRow: d.headerRow, cols: d.cols, headers: d.headers, missing: d.missing, rows: d.rows, note: d.note, overridden: !!d.overridden, offerEndText: d.offerEndText || null, offerStartText: d.offerStartText || null })),
    items, errors, warnings, reviews, checks, diff, offerRows, offerReport: report, market,
    stats: { products: items.length, sohar: totS, khazaan: totK, total: totS + totK, stockRowsRead: rowStats.stockRowsRead, approvedRows: rowStats.approvedRows, excludedBrandRows: ex.brand, excludedBrands: ex.brandList, excludedLocations: ex.location, ghalaRows: ex.ghala, noRrp: ex.noRrp.length, noRrpCodes: ex.noRrp, zeroStock: ex.zero, rrpSource }
  };
}

/* ---------- MAIN SHEET (formula result) as the single source ---------- */
function processMainSheet(d, rows, detected, opts) {
  const errors = [], warnings = [], reviews = []; const c = d.cols;
  const ex = { brand: 0, brandList: {}, noRrp: [], zero: 0 };
  const items = [], seen = new Map(), offerRows = [], mainOffer = new Map(), offerSkip = []; let allS = 0, allK = 0, rowsRead = 0, blankFormula = 0;
  const top = rows.slice(0, d.headerRow);
  const findTop = keys => { for (const r of top) for (let i = 0; i < (r || []).length - 1; i++) if (keys.includes(normHeader(r[i]))) return r[i + 1]; return null; };
  const sumS = parseQty(findTop(['confirmed401'])), sumK = parseQty(findTop(['confirmedsar01']));
  const stockDate = toIsoDate(findTop(['stockdate']));
  const topText = top.map(r => (r || []).map(cleanText).join(' ')).join(' ').toUpperCase();
  if (/CHECK/.test(topText) && !/CHECKS? OK/.test(topText)) reviews.push('The MAIN SHEET reports failed data checks (see the CHECKS sheet in Excel).');
  for (let r = d.headerRow + 1; r < rows.length; r++) {
    const row = rows[r]; if (!row) continue;
    const code = normCode(row[c.code]);
    if (!code) { if (row.some(v => v === '')) blankFormula++; continue; }
    rowsRead++;
    const s = parseQty(row[c.sohar]), k = parseQty(row[c.khazaan]);
    if (isNaN(s) || isNaN(k)) { errors.push('Row ' + (r + 1) + ' (' + code + '): stock is not a number.'); continue; }
    allS += s; allK += k;
    const brand = c.brand != null ? cleanText(row[c.brand]).toUpperCase() : '';
    if (seen.has(code)) { errors.push('Duplicate item code ' + code + ' (rows ' + seen.get(code) + ' and ' + (r + 1) + ').'); continue; }
    seen.set(code, r + 1);
    const so = Math.max(0, Math.floor(s)), kh = Math.max(0, Math.floor(k));
    if (so + kh <= 0) ex.zero++;
    const rv = parseMoney(row[c.rrp]);
    if (rv == null || rv <= 0) ex.noRrp.push(code);
    const fS = c.freeS != null ? parseQty(row[c.freeS]) : null, fK = c.freeK != null ? parseQty(row[c.freeK]) : null;
    const it = { code, model: modelOf(code), brand, name: c.name != null ? cleanText(row[c.name]) || code : code, type: c.type != null ? cleanText(row[c.type]) : '', division: c.division != null ? cleanText(row[c.division]) : '', department: c.department != null ? cleanText(row[c.department]) : '', rrp: rv != null && rv > 0 ? toBaisa(rv) : 0, sohar: so, khazaan: kh, fs: isNaN(fS) ? null : fS, fk: isNaN(fK) ? null : fK, raw: { s: [so, 0, 0], k: [kh, 0, 0] } };
    it.cat = categorize(it.division, it.department, it.type, it.brand);
    items.push(it);
    if (c.offerPriceInc != null) {
      const raw = row[c.offerPriceInc], oi = parseMoney(raw), txt = cleanText(raw);
      if (oi != null && oi > 0) mainOffer.set(code, { priceEx: Math.round(toBaisa(oi) * 100 / (100 + VAT_PERCENT)), end: c.offerEnd != null ? toIsoDate(row[c.offerEnd]) : null });
      else if (txt && !/^[-–—0.]+$/.test(txt) && !/^n\/?a$/i.test(txt)) offerSkip.push({ code, reason: 'MAIN SHEET offer price is not a number ("' + txt.slice(0, 30) + '")' });
    }
  }
  /* ---- offers: MAIN SHEET column + the offer sheet itself (v52) – every row is either published or reported ---- */
  const byCode = new Map(items.map(i => [i.code, i])), byModel = new Map();
  items.forEach(i => { const m = i.code.split('/')[0]; if (!byModel.has(m)) byModel.set(m, i); });
  const sheetOffer = new Map(); let sheetRowsRead = 0; const offerSheetNames = [];
  for (const od of detected.filter(x => x.kind === 'offer' && x.cols.code != null)) {
    const sh = (opts.sheets || []).find(x => x.name === od.name); if (!sh) continue; offerSheetNames.push(od.name);
    const oc = od.cols;
    for (let r = od.headerRow + 1; r < sh.rows.length; r++) {
      const row = sh.rows[r]; if (!row) continue; const code = normCode(row[oc.code]); if (!code) continue;
      let ex2 = null;
      if (oc.offerPriceInc != null && parseMoney(row[oc.offerPriceInc]) > 0) ex2 = Math.round(toBaisa(parseMoney(row[oc.offerPriceInc])) * 100 / (100 + VAT_PERCENT));
      else if (oc.offerPrice != null && parseMoney(row[oc.offerPrice]) > 0) ex2 = toBaisa(parseMoney(row[oc.offerPrice]));
      else if (oc.rrp != null && oc.discount != null && parseMoney(row[oc.rrp]) > 0 && parseMoney(row[oc.discount]) != null) ex2 = toBaisa(parseMoney(row[oc.rrp])) - toBaisa(parseMoney(row[oc.discount]));
      if (ex2 == null) continue;
      sheetRowsRead++;
      const it = byCode.get(code) || byModel.get(code.split('/')[0]);
      if (!it) { offerSkip.push({ code, reason: 'Not in the MAIN SHEET stock list (no Sohar / Khazaan line), so the app has no product to show it on' }); continue; }
      const rrpV = oc.rrp != null ? parseMoney(row[oc.rrp]) : null;
      if (!sheetOffer.has(it.code)) sheetOffer.set(it.code, { priceEx: ex2, rrp: rrpV > 0 ? toBaisa(rrpV) : 0, end: oc.offerEnd != null ? toIsoDate(row[oc.offerEnd]) : od.offerEndText || null, start: oc.offerStart != null ? toIsoDate(row[oc.offerStart]) : od.offerStartText || null });
    }
  }
  const report = { fromMain: 0, fromSheet: 0, sheetRows: sheetRowsRead, sheets: offerSheetNames, skipped: offerSkip, noRrp: [], hiddenMobile: [], differ: [] };
  for (const it of items) {
    const m = mainOffer.get(it.code), so = sheetOffer.get(it.code); if (!m && !so) continue;
    const use = m || so; const rrp = it.rrp || (so && so.rrp) || 0;
    if (m && so && Math.abs(m.priceEx - so.priceEx) > 1) report.differ.push({ code: it.code, main: m.priceEx, sheet: so.priceEx });
    if (!(use.priceEx > 0)) { offerSkip.push({ code: it.code, reason: 'Offer price is zero' }); continue; }
    if (rrp > 0 && use.priceEx >= rrp) { offerSkip.push({ code: it.code, reason: 'Offer price (' + fmtOMR(use.priceEx) + ' excl. VAT) is not below RRP (' + fmtOMR(rrp) + ')' }); continue; }
    if (!rrp) report.noRrp.push(it.code);
    if (it.cat === 'mobile') report.hiddenMobile.push(it.code);
    if (m) report.fromMain++; else report.fromSheet++;
    offerRows.push({ code: it.code, priceEx: use.priceEx, sheetRrp: rrp, basis: m ? 'Offer Price Incl. VAT ÷ 1.05 (MAIN SHEET)' : 'Offer sheet price (MAIN SHEET cell was empty)', start: (so && so.start) || muscatToday(), end: use.end || (so && so.end) || null, source: m ? d.name : 'offer sheet' });
  }
  /* ---- market prices (v53): read ONLY for items that have an offer in this file ---- */
  const offerCodes = new Set(offerRows.map(o => o.code)); const market = { prices: {}, date: null }; const mrep = { sheets: [], rows: 0, matched: 0, ignored: 0, cheaper: [] };
  for (const md of detected.filter(x => x.kind === 'market' && x.cols.code != null)) {
    const sh = (opts.sheets || []).find(x => x.name === md.name); if (!sh) continue; mrep.sheets.push(md.name); const mc = md.cols;
    for (let r = md.headerRow + 1; r < sh.rows.length; r++) {
      const row = sh.rows[r]; if (!row) continue; const code0 = normCode(row[mc.code]); if (!code0) continue;
      const pr = {}; MARKET_STORES.forEach(([f, n]) => { if (mc[f] != null) { const v = parseMoney(row[mc[f]]); if (v != null && v > 0) pr[n] = toBaisa(v); } });
      if (!Object.keys(pr).length) continue; mrep.rows++;
      const it = byCode.get(code0) || byModel.get(code0.split('/')[0]);
      if (!it || !offerCodes.has(it.code)) { mrep.ignored++; continue; }      /* no running offer -> market price not used */
      const dt = mc.mDate != null ? toIsoDate(row[mc.mDate]) : null;
      market.prices[it.code] = Object.assign({}, pr, dt ? { _date: dt } : {}); mrep.matched++;
      if (dt && (!market.date || dt > market.date)) market.date = dt;
      const o = offerRows.find(x => x.code === it.code); const ours = o.priceEx + vatOf(o.priceEx);
      const low = Object.entries(pr).sort((a, b) => a[1] - b[1])[0];
      if (low[1] < ours) mrep.cheaper.push({ code: it.code, store: low[0], market: low[1], ours });
    }
  }
  report.market = mrep;
  if (offerSkip.length) reviews.push(offerSkip.length + ' offer row(s) could not be published – see "Offer check" below for each item and the reason.');
  if (!rowsRead) errors.push('The MAIN SHEET has no values. Open the file in Excel, let the formulas calculate, press Save, then upload again.');
  const TYPE_ORDER = ['REFRIGERATOR', 'WASHING MACHINE', 'DISH WASHER', 'DRYER', 'MICROWAVE OVEN', 'BUILT IN', 'VACUUM CLEANER'];
  const tRank = it => { const i = TYPE_ORDER.indexOf(it.type.toUpperCase()); return i < 0 ? 99 : i; };
  const wmRank = it => /^WA/.test(it.code) ? 0 : /^WW/.test(it.code) ? 1 : /^WD/.test(it.code) ? 2 : 3;
  items.sort((a, b) => CATS.findIndex(x => x.key === a.cat) - CATS.findIndex(x => x.key === b.cat) || ((b.sohar + b.khazaan > 0) - (a.sohar + a.khazaan > 0)) || tRank(a) - tRank(b) || a.type.localeCompare(b.type) || wmRank(a) - wmRank(b) || a.code.localeCompare(b.code));
  const totS = items.reduce((a, i) => a + i.sohar, 0), totK = items.reduce((a, i) => a + i.khazaan, 0);
  const checks = [
    { label: 'Source is the MAIN SHEET (formula results)', ok: true },
    { label: 'All MAIN SHEET products included', ok: items.length === rowsRead, info: items.length + ' of ' + rowsRead },
    { label: 'Sohar 401 total matches the MAIN SHEET summary', ok: !sumS ? true : totSohar(items) === sumS && allS === sumS, info: n0s(totSohar(items)) + (sumS ? ' vs ' + n0s(sumS) : ' (no summary)') },
    { label: 'Khazaan SAR01 total matches the MAIN SHEET summary', ok: !sumK ? true : totKh(items) === sumK && allK === sumK, info: n0s(totKh(items)) + (sumK ? ' vs ' + n0s(sumK) : ' (no summary)') },
    { label: 'No duplicate item codes', ok: new Set(items.map(i => i.code)).size === items.length },
    { label: 'VAT = 5% of RRP', ok: items.every(i => vatOf(i.rrp) === Math.round(i.rrp * 0.05)) }
  ];
  if (checks.some(x => !x.ok)) errors.push('Validation failed: ' + checks.filter(x => !x.ok).map(x => x.label).join('; ') + '. Recalculate and save the file in Excel, then upload again.');
  if (!items.length && !errors.length) errors.push('No products were found in the MAIN SHEET.');
  let diff = null;
  if (opts.prevItems && opts.prevItems.length) {
    const prev = new Map(opts.prevItems.map(i => [i.code, i])); const codes = new Set(items.map(i => i.code));
    diff = { added: items.filter(i => !prev.has(i.code)).map(i => i.code), removed: opts.prevItems.filter(i => !codes.has(i.code)).map(i => i.code), changed: items.filter(i => prev.has(i.code) && (prev.get(i.code).sohar !== i.sohar || prev.get(i.code).khazaan !== i.khazaan)).length, priceChanged: items.filter(i => prev.has(i.code) && prev.get(i.code).rrp !== i.rrp).length };
    if (opts.prevItems.length >= 20 && items.length < opts.prevItems.length * 0.5) reviews.push('Product count dropped from ' + opts.prevItems.length + ' to ' + items.length + '. Confirm the file is complete.');
  }
  warnings.push('All MAIN SHEET products are shown (all brands, including out-of-stock items). Stock is the CONFIRMED columns as calculated in your Excel file.');
  return { detected: detected.map(x => ({ name: x.name, kind: x.name === d.name ? 'main' : (x.kind === 'main' ? 'ignore' : 'source'), headerRow: x.headerRow, cols: x.cols, headers: x.headers, missing: x.name === d.name ? [] : [], rows: x.rows, note: x.note, overridden: !!x.overridden })),
    items, errors, warnings, reviews, checks, diff, offerRows, offerReport: report, market,
    stats: { products: items.length, sohar: totS, khazaan: totK, total: totS + totK, stockRowsRead: rowsRead, approvedRows: rowsRead, excludedBrandRows: ex.brand, excludedBrands: ex.brandList, excludedLocations: {}, ghalaRows: 0, noRrp: ex.noRrp.length, noRrpCodes: ex.noRrp, zeroStock: ex.zero, rrpSource: 'main', stockDate, source: 'main' } };
}
function totSohar(a) { return a.reduce((x, i) => x + i.sohar, 0); }
function totKh(a) { return a.reduce((x, i) => x + i.khazaan, 0); }
function n0s(n) { return Number(n || 0).toLocaleString('en-US'); }

/* ---------- offers ---------- */
function offerProblems(o, item) {
  const p = [];
  if (!isValidIsoDate(o.start)) p.push('Start date missing or invalid');
  if (!isValidIsoDate(o.end)) p.push('Expiry date missing or invalid');
  if (isValidIsoDate(o.start) && isValidIsoDate(o.end) && o.end < o.start) p.push('Expiry is before start');
  if (!(o.priceEx > 0)) p.push('Offer price must be above zero');
  if (item && item.rrp > 0 && o.priceEx >= item.rrp) p.push('Offer price is not below RRP');
  return p;
}
function offerState(o, item, today) {
  if (!item) return 'no-stock';
  if (offerProblems(o, item).length) return 'invalid';
  if (today < o.start) return 'upcoming';
  if (today > o.end) return 'expired';
  return 'active';
}
function activeOfferMap(offers, itemsByCode, today) {
  const m = new Map();
  for (const o of offers || []) {
    const it = itemsByCode.get(o.code);
    if (offerState(o, it, today) !== 'active') continue;
    const cur = m.get(o.code);
    if (!cur || o.priceEx < cur.priceEx) m.set(o.code, o); // lowest valid price wins if overlapping
  }
  return m;
}
function priceOf(item, offerMap) {
  const o = offerMap.get(item.code);
  const unitEx = o ? o.priceEx : item.rrp;
  return {
    rrpEx: item.rrp, rrpVat: vatOf(item.rrp), rrpInc: item.rrp + vatOf(item.rrp),
    offer: o || null, offerEx: o ? o.priceEx : null, offerVat: o ? vatOf(o.priceEx) : null, offerInc: o ? o.priceEx + vatOf(o.priceEx) : null,
    discPct: o ? discountPct(item.rrp, o.priceEx) : 0,
    unitEx, unitVat: vatOf(unitEx), unitInc: unitEx + vatOf(unitEx)
  };
}

/* ---------- orders ---------- */
/* lines: [{code, wh, qty, priceAtAdd?, offerAtAdd?}] */
function computeOrder(lines, itemsByCode, offerMap) {
  const out = []; const issues = [];
  let sub = 0, vat = 0, qtyTotal = 0;
  const usage = {};
  for (const l of lines) {
    const it = itemsByCode.get(l.code);
    const wh = WH_BY_CODE[l.wh] ? l.wh : 'ALL';
    const row = { code: l.code, wh, qtyRequested: l.qty, qty: l.qty, item: it || null, issues: [] };
    if (!it) { row.qty = 0; row.issues.push('No longer available in published stock'); issues.push(l.code + ': no longer available'); out.push(row); continue; }
    const avail = wh === 'ALL' ? it.sohar + it.khazaan : wh === '401' ? it.sohar : it.khazaan;
    const key = l.code + '|' + wh;
    const already = usage[key] || 0;
    const left = Math.max(0, avail - already);
    row.available = avail;
    if (!(Number.isInteger(row.qty) && row.qty > 0)) { row.qty = 0; row.issues.push('Invalid quantity'); }
    if (row.qty > left) { row.issues.push('Only ' + left + ' available (requested ' + row.qty + ')'); issues.push(l.code + ': quantity reduced to ' + left); row.qty = left; }
    usage[key] = already + row.qty;
    const p = priceOf(it, offerMap);
    row.unitEx = p.unitEx; row.unitVat = p.unitVat; row.offerId = p.offer ? p.offer.id : null; row.rrpEx = p.rrpEx; row.discPct = p.discPct;
    row.lineEx = p.unitEx * row.qty; row.lineVat = vatOf(row.lineEx); row.lineInc = row.lineEx + row.lineVat;
    if (l.priceAtAdd != null && l.priceAtAdd !== p.unitEx) {
      const msg = l.offerAtAdd && !p.offer ? 'Offer has ended – price changed to normal RRP' : 'Price changed from ' + fmtOMR(l.priceAtAdd) + ' to ' + fmtOMR(p.unitEx);
      row.issues.push(msg); issues.push(l.code + ': ' + msg);
    }
    sub += row.lineEx; vat += row.lineVat; qtyTotal += row.qty;
    out.push(row);
  }
  const grand = sub + vat;
  const check = out.every(r => !r.item || (r.lineEx === r.unitEx * r.qty && r.lineInc === r.lineEx + r.lineVat)) && grand === out.reduce((a, r) => a + (r.lineInc || 0), 0);
  return { lines: out, subtotal: sub, vat, grand, qty: qtyTotal, items: out.filter(r => r.qty > 0).length, issues, check };
}

/* ---------- payload / references ---------- */
function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str); let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
  const bin = atob(s); const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
function randomId(n) {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const r = new Uint8Array(n); crypto.getRandomValues(r);
  return Array.from(r, x => a[x % a.length]).join('');
}
function newOrderRef(now) { const p = muscatParts(now || new Date()); return 'SRC-' + p.year.slice(2) + p.month + p.day + '-' + randomId(5); }
async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
}
async function statusKey(ref, token) { return (await sha256Hex(ref + '|' + token)).slice(0, 24); }

/* ---------- search ---------- */
const STOP = new Set(['the', 'and', 'for', 'with', 'of']);
const Q_SYN = { frige: 'refrigerator', fridg: 'refrigerator', freezer: 'refrigerator', ref: 'refrigerator', reff: 'refrigerator', split: 'ac', aircondition: 'ac', airconditioning: 'ac', telivision: 'tv', televison: 'tv', led: 'tv', oven: 'oven', mw: 'microwave', dw: 'dishwasher', dishwashers: 'dishwasher', vaccum: 'vacuum', vacum: 'vacuum', hoover: 'vacuum', speaker: 'soundbar', sound: 'soundbar', fridge: 'refrigerator', fridges: 'refrigerator', refrigerators: 'refrigerator', aircon: 'ac', airconditioner: 'ac', conditioner: 'ac', television: 'tv', tvs: 'tv', washer: 'washing', washers: 'washing', wm: 'washing', mobiles: 'mobile', phone: 'mobile', phones: 'mobile', microwaves: 'microwave', dishwashers: 'dishwasher', inches: 'inch', litres: 'litre', liters: 'litre', ltr: 'litre', lt: 'litre', tons: 'ton', tonne: 'ton' };
function tokenize(s) { return (String(s || '').toLowerCase().match(/[a-z0-9]+(?:\.[0-9]+)?/g) || []); }
function compact(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
function buildSearchIndex(items) {
  return items.map((it, i) => {
    const toks = new Set([...tokenize(it.brand || ''), ...tokenize(it.code), ...tokenize(it.model), ...tokenize(it.name), ...tokenize(it.type), ...tokenize(it.division), ...tokenize(it.department), ...tokenize(CAT_LABEL[it.cat]), ...tokenize(it.kw || keywordsFor(it))]);
    [...toks].forEach(k => { const m = k.match(/^(\d+(?:\.\d+)?)([a-z]+)$/); if (m) { toks.add(m[1]); toks.add(m[2]); } });
    return { i, toks: [...toks], code: compact(it.code), ncode: codeNorm(it.code), name: it.name.toLowerCase() };
  });
}
function vocabOf(index) {
  if (!index._vocab) { const v = new Set(); index.forEach(e => e.toks.forEach(t => { if (t.length >= 3 && !/^\d+$/.test(t)) v.add(t); })); Object.values(Q_SYN).forEach(t => v.add(t)); index._vocab = [...v]; }
  return index._vocab;
}
/* "Did you mean": fix each misspelt word to the closest known word */
function correctQuery(index, query) {
  const vocab = vocabOf(index); let changed = false;
  const out = tokenize(query).map(t => {
    if (t.length < 3 || /\d/.test(t) || Q_SYN[t] || vocab.includes(t) || vocab.some(v => v.startsWith(t))) return t;
    let best = null, bd = 99;
    for (const v of vocab) { if (Math.abs(v.length - t.length) > maxTypos(t.length)) continue; const d = osa(t, v); if (d < bd || (d === bd && best && v.length < best.length)) { bd = d; best = v; } }
    if (best && bd <= maxTypos(t.length)) { changed = true; return best; }
    return t;
  });
  return changed ? out.join(' ') : null;
}
/* Smart search: exact -> corrected spelling -> closest matches */
function searchSmart(index, items, query) {
  const q = String(query || '').trim();
  if (!q) return { idx: items.map((_, i) => i), mode: 'all', corrected: null };
  let idx = searchItems(index, items, q);
  const corrected = correctQuery(index, q);
  if (idx.length) return { idx, mode: 'exact', corrected: idx.length < 3 ? corrected : null };
  if (corrected) { idx = searchItems(index, items, corrected); if (idx.length) return { idx, mode: 'corrected', corrected }; }
  const nq = codeNorm(q);
  const qt = tokenize(q).filter(t => !STOP.has(t)).map(t => Q_SYN[t] || t);
  const scored = [];
  for (const e of index) {
    let sc = 0;
    if (nq.length >= 4) { if (e.ncode.includes(nq)) sc += 50; else if (nq.length >= 6 && e.ncode.length >= nq.length - 1 && osa(nq, e.ncode.slice(0, nq.length)) <= 2) sc += 30; }
    for (const t of qt) { let best = 0; for (const k of e.toks) { if (k === t) { best = 10; break; } if (k.startsWith(t) || t.startsWith(k) && k.length >= 3) best = Math.max(best, 6); else if (t.length >= 4 && Math.abs(k.length - t.length) <= 3 && osa(t, k) <= maxTypos(t.length) + 1) best = Math.max(best, 4); } sc += best; }
    const ts = trigramSim(q.toLowerCase(), e.name); if (ts > .35) sc += ts * 10;
    if (sc >= 8) scored.push({ i: e.i, sc });
  }
  scored.sort((a, b) => b.sc - a.sc);
  return { idx: scored.slice(0, 40).map(x => x.i), mode: scored.length ? 'closest' : 'none', corrected };
}
function editDistanceWithin(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  return osa(a, b) <= max;
}
function osa(a, b) {
  const m = a.length, n = b.length; const d = [];
  for (let i = 0; i <= m; i++) { d[i] = [i]; }
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const c = a[i - 1] === b[j - 1] ? 0 : 1;
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[m][n];
}
const maxTypos = len => len <= 2 ? 0 : len <= 5 ? 1 : len <= 8 ? 2 : 3;
const codeNorm = s => compact(s).replace(/o/g, '0').replace(/[il]/g, '1');
function trigrams(s) { const t = new Set(); const x = '  ' + s + ' '; for (let i = 0; i < x.length - 2; i++) t.add(x.substr(i, 3)); return t; }
function trigramSim(a, b) { const A = trigrams(a), B = trigrams(b); let n = 0; A.forEach(t => { if (B.has(t)) n++; }); return n / Math.max(1, Math.min(A.size, B.size)); }
function searchItems(index, items, query) {
  const raw = tokenize(query).filter(t => !STOP.has(t));
  const qc = compact(query);
  if (!raw.length && !qc) return items.map((_, i) => i);
  const qt = raw.map(t => Q_SYN[t] || t);
  const results = [];
  for (const e of index) {
    let score = 0;
    if (qc.length >= 3 && e.code.includes(qc)) score += e.code.startsWith(qc) ? 60 : 40;
    else if (qc.length >= 4 && e.ncode.includes(codeNorm(qc))) score += 45;
    let all = true;
    for (const t of qt) {
      let best = 0;
      for (const k of e.toks) {
        if (k === t) { best = 10; break; }
        if (t.length >= 2 && k.startsWith(t)) best = Math.max(best, 7);
        else if (t.length >= 4 && k.includes(t)) best = Math.max(best, 5);
        else if (t.length >= 4 && best < 3 && editDistanceWithin(t, k, maxTypos(t.length))) best = 3;
      }
      if (!best && t.length >= 3 && e.code.includes(t)) best = 6;
      if (!best && /^\d+(\.\d+)?$/.test(t)) { const v = +t; for (const k of e.toks) { if (/^\d+(\.\d+)?$/.test(k) && Math.abs(+k - v) <= Math.max(1, v * 0.1)) { best = 4; break; } } }
      if (best && t.length >= 2 && e.name.includes(t)) best += 4;
      if (!best) { all = false; break; }
      score += best;
    }
    if (all) results.push({ i: e.i, score });
    else if (score >= 40) results.push({ i: e.i, score });
  }
  results.sort((a, b) => b.score - a.score || (items[b.i].sohar + items[b.i].khazaan) - (items[a.i].sohar + items[a.i].khazaan));
  return results.map(r => r.i);
}

if (typeof module !== 'undefined' && module.exports) module.exports = { searchSmart, correctQuery, muscatToday, fmtDate, fmtDateTime, toIsoDate, toBaisa, vatOf, fmtOMR, discountPct, detectSheet, processWorkbook, offerProblems, offerState, activeOfferMap, priceOf, computeOrder, b64urlEncode, b64urlDecode, newOrderRef, statusKey, buildSearchIndex, searchItems, categorize, isValidIsoDate };
