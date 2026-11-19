/* ================= SARCO ORDER SHEET (fills the official PDF template) ================= */
const PDFLIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
const SALES_REP = 'SARFARAAZ KHAN (E32114)';
/* positions measured on order-sheet.pdf (A4, points from the top) */
const SH = {
  H: 841.8898,
  head: { code: [108, 117], name: [108, 129.8], loc: [108, 142.5], contact: [108, 155.3], date: [338, 117], rep: [355, 129.8] },
  cols: { sr: [30, 48.1], code: [48.1, 162.7], desc: [162.7, 263.6], qty: [263.6, 306.3], price: [306.3, 362.9], gross: [362.9, 426.1], vat: [426.1, 472.5], net: [472.5, 536.4] },
  rowTop: 206.8, rowH: 13.7, rows: 10, totalTop: 344.3, words: [146, 368.5]
};

/* number to words for Omani Rial (1 OMR = 1000 Baisa) */
function numWords(n) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const h = x => { let s = ''; if (x >= 100) { s += a[Math.floor(x / 100)] + ' Hundred'; x %= 100; if (x) s += ' '; } if (x >= 20) { s += b[Math.floor(x / 10)]; if (x % 10) s += '-' + a[x % 10]; } else if (x) s += a[x]; return s; };
  if (n === 0) return 'Zero';
  const parts = []; const units = [[1e9, 'Billion'], [1e6, 'Million'], [1e3, 'Thousand']];
  for (const [v, w] of units) { if (n >= v) { parts.push(h(Math.floor(n / v)) + ' ' + w); n %= v; } }
  if (n) parts.push(h(n));
  return parts.join(' ');
}
function omrWords(baisa) {
  const r = Math.floor(baisa / 1000), bz = baisa % 1000;
  return 'Omani Rials ' + numWords(r) + (bz ? ' and ' + numWords(bz) + ' Baisa' : '') + ' Only';
}

async function getPdfLib() {
  if (window.PDFLib) return window.PDFLib;
  await new Promise((res, rej) => { const s = document.createElement('script'); s.src = PDFLIB_URL; s.onload = res; s.onerror = () => rej(new Error('Could not load the PDF tool. Check your internet connection.')); document.head.appendChild(s); });
  return window.PDFLib;
}
const winAnsiSafe = s => /^[\x20-\x7E\u00A0-\u00FF–—‘’“”•…]*$/.test(s);

/* where the dealer's signed box goes (clean template, points from top) */
const SIGN_BOX = { x0: 369, x1: 536, top: 514, bottom: 613 };
async function buildOrderSheet(o, opt) {
  opt = opt || {};
  const L = await getPdfLib();
  const tpl = await (await fetch('order-sheet.pdf', { cache: 'force-cache' })).arrayBuffer();
  const out = await L.PDFDocument.create();
  const font = await out.embedFont(L.StandardFonts.Helvetica), bold = await out.embedFont(L.StandardFonts.HelveticaBold);
  const ink = L.rgb(0.02, 0.07, 0.25), white = L.rgb(1, 1, 1);
  const pages = Math.max(1, Math.ceil(o.lines.length / SH.rows));
  const fit = (txt, f, size, w) => { txt = String(txt || ''); while (txt.length && f.widthOfTextAtSize(txt, size) > w) txt = txt.slice(0, -1); return txt; };

  for (let pg = 0; pg < pages; pg++) {
    const src = await L.PDFDocument.load(tpl); const [cp] = await out.copyPages(src, [0]); const page = out.addPage(cp);
    const Y = top => SH.H - top;
    /* draw text; Arabic or other scripts are drawn as an image so letters join correctly */
    const put = async (txt, x, top, opt = {}) => {
      txt = String(txt == null ? '' : txt); if (!txt) return;
      const size = opt.size || 8, f = opt.bold ? bold : font, w = opt.w || 190;
      if (winAnsiSafe(txt)) {
        const s = fit(txt, f, size, w); const tw = f.widthOfTextAtSize(s, size);
        const x0 = opt.align === 'right' ? x - tw : opt.align === 'center' ? x - tw / 2 : x;
        page.drawText(s, { x: x0, y: Y(top) - size * 0.82, size, font: f, color: ink });
      } else {
        const c = document.createElement('canvas'); const sc = 4; const cx = c.getContext('2d'); const fpx = size * sc;
        const fontStr = (opt.bold ? '700 ' : '600 ') + fpx + 'px Cairo, Tahoma, "Segoe UI", Arial, sans-serif';
        cx.font = fontStr;
        const tw = Math.min(cx.measureText(txt).width, w * sc); c.width = Math.ceil(tw) + 4; c.height = Math.ceil(fpx * 1.45);
        const cx2 = c.getContext('2d'); cx2.font = fontStr; cx2.fillStyle = '#04123F'; cx2.textBaseline = 'top'; cx2.direction = 'rtl'; cx2.textAlign = 'right'; cx2.fillText(txt, c.width - 2, fpx * 0.12, w * sc);
        const png = await out.embedPng(c.toDataURL('image/png')); const iw = c.width / sc, ih = c.height / sc;
        const x0 = opt.align === 'right' ? x - iw : opt.align === 'center' ? x - iw / 2 : x;
        page.drawImage(png, { x: x0, y: Y(top) - ih + 1.5, width: iw, height: ih });
      }
    };
    const blank = (x0, x1, top, h) => page.drawRectangle({ x: x0 + 0.8, y: Y(top + h) + 0.8, width: x1 - x0 - 1.6, height: h - 1.6, color: white });

    /* header */
    await put(o.dealer.code, SH.head.code[0], SH.head.code[1], { bold: true, w: 195 });
    await put(o.dealer.name, SH.head.name[0], SH.head.name[1], { bold: true, w: 195 });
    await put(o.dealer.location, SH.head.loc[0], SH.head.loc[1], { w: 195 });
    await put((o.dealer.wa ? fmtWaSheet(o.dealer.wa) : '') + (o.dealer.contact ? '  (' + o.dealer.contact + ')' : ''), SH.head.contact[0], SH.head.contact[1], { w: 195 });
    await put(fmtDate(muscatToday(new Date(o.createdAt))), SH.head.date[0], SH.head.date[1], { bold: true });
    page.drawRectangle({ x: 353, y: Y(138.5), width: 180, height: 11.5, color: white });
    await put(SALES_REP, SH.head.rep[0], SH.head.rep[1], { bold: true, w: 178 });

    /* items */
    const lines = o.lines.slice(pg * SH.rows, pg * SH.rows + SH.rows); const C = SH.cols;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i]; const top = SH.rowTop + i * SH.rowH; const tt = top + 3.2;
      const priced = l.unitEx > 0; const gross = l.unitEx * l.qty, vat = vatOf(gross), net = gross + vat;
      if (pg > 0) { blank(C.sr[0], C.sr[1], top, SH.rowH); await put(String(pg * SH.rows + i + 1), (C.sr[0] + C.sr[1]) / 2, tt, { align: 'center', size: 7.5 }); }
      if (priced) { blank(C.vat[0], C.vat[1], top, SH.rowH); blank(C.net[0], C.net[1], top, SH.rowH); }
      await put(l.code, C.code[0] + 3, tt, { bold: true, size: 7.2, w: C.code[1] - C.code[0] - 6 });
      const name = (l.name || '').replace(/\s+/g, ' ');
      if (font.widthOfTextAtSize(name, 6) > C.desc[1] - C.desc[0] - 5 && winAnsiSafe(name)) {
        const words = name.split(' '); let l1 = ''; while (words.length && font.widthOfTextAtSize((l1 + ' ' + words[0]).trim(), 5.4) <= C.desc[1] - C.desc[0] - 5) l1 = (l1 + ' ' + words.shift()).trim();
        await put(l1, C.desc[0] + 2.5, top + 1.9, { size: 5.4, w: C.desc[1] - C.desc[0] - 5 }); await put(words.join(' '), C.desc[0] + 2.5, top + 7.6, { size: 5.4, w: C.desc[1] - C.desc[0] - 5 });
      } else await put(name, C.desc[0] + 2.5, tt, { size: 6.2, w: C.desc[1] - C.desc[0] - 5 });
      await put(String(l.qty), (C.qty[0] + C.qty[1]) / 2, tt, { align: 'center', bold: true, size: 7.5 });
      if (priced) {
        await put(fmtOMR(l.unitEx, false), C.price[1] - 3, tt, { align: 'right', size: 7.5 });
        await put(fmtOMR(gross, false), C.gross[1] - 3, tt, { align: 'right', size: 7.5 });
        await put(fmtOMR(vat, false), C.vat[1] - 3, tt, { align: 'right', size: 7.5 });
        await put(fmtOMR(net, false), C.net[1] - 3, tt, { align: 'right', bold: true, size: 7.5 });
      } else await put('TBC', C.price[1] - 3, tt, { align: 'right', size: 7 });
    }
    if (pg > 0) for (let i = lines.length; i < SH.rows; i++) blank(C.sr[0], C.sr[1], SH.rowTop + i * SH.rowH, SH.rowH);

    /* totals (last page) */
    const tt = SH.totalTop + 3.3;
    const allPriced = o.lines.every(l => l.unitEx > 0);
    if (pg === pages - 1 && !allPriced) {
      await put(String(o.lines.reduce((a, l) => a + l.qty, 0)), (C.qty[0] + C.qty[1]) / 2, tt, { align: 'center', bold: true, size: 7.5 });
      await put('Prices to be confirmed by SARCO', SH.words[0], SH.words[1], { size: 7.6, w: 390 });
    } else if (pg === pages - 1) {
      blank(C.net[0], C.net[1], SH.totalTop, 13.7);
      await put(String(o.lines.reduce((a, l) => a + l.qty, 0)), (C.qty[0] + C.qty[1]) / 2, tt, { align: 'center', bold: true, size: 7.5 });
      await put(fmtOMR(o.subtotal, false), C.gross[1] - 3, tt, { align: 'right', bold: true, size: 7.5 });
      await put(fmtOMR(o.vat, false), C.vat[1] - 3, tt, { align: 'right', bold: true, size: 7.5 });
      await put(fmtOMR(o.grand, false), C.net[1] - 3, tt, { align: 'right', bold: true, size: 8 });
      await put(omrWords(o.grand), SH.words[0], SH.words[1], { bold: true, size: 7.6, w: 390 });
    } else {
      blank(C.net[0], C.net[1], SH.totalTop, 13.7);
      await put('Continued on page ' + (pg + 2), SH.words[0], SH.words[1], { size: 7.6, w: 390 });
    }
    if (pages > 1) await put('Page ' + (pg + 1) + ' of ' + pages, 536, 104, { align: 'right', size: 7 });
    if (opt.sign) {
      try {
        const buf = await (await fetch(opt.sign)).arrayBuffer(); const u8 = new Uint8Array(buf);
        const img = u8[0] === 0x89 ? await out.embedPng(buf) : await out.embedJpg(buf);
        const B = SIGN_BOX, bw = B.x1 - B.x0, bh = B.bottom - B.top; const k = Math.min(bw / img.width, bh / img.height);
        const w = img.width * k, h = img.height * k;
        page.drawRectangle({ x: B.x0, y: Y(B.bottom), width: bw, height: bh, color: white });
        page.drawImage(img, { x: B.x0 + (bw - w) / 2, y: Y(B.top) - h - (bh - h) / 2, width: w, height: h });
      } catch (e) { console.warn('signature image', e); }
    }
  }
  out.setTitle('SARCO Order Sheet ' + o.ref); out.setAuthor('AL SEEB TECHNICAL EST. (SARCO) LLC'); out.setCreator('SARCO Dealer Portal');
  return new Blob([await out.save()], { type: 'application/pdf' });
}
function fmtWaSheet(d) { return d && d.startsWith('968') && d.length === 11 ? '+968 ' + d.slice(3, 7) + ' ' + d.slice(7) : '+' + d; }

/* short link payload so the same filled sheet can be re-downloaded from the WhatsApp message */
function sheetPayload(o) { return b64urlEncode(JSON.stringify({ r: o.ref, t: o.createdAt, dl: o.deliveryDate, d: [o.dealer.code, o.dealer.name, o.dealer.location, o.dealer.wa || '', o.dealer.contact || ''], l: o.lines.map(l => [l.code, l.qty, l.unitEx]) })); }
function orderFromPayload(p, byCode, priceFor) {
  const j = JSON.parse(b64urlDecode(p));
  const lines = j.l.map(([code, qty, unitEx]) => { const it = byCode.get(code); if (!(unitEx > 0) && priceFor && it) unitEx = priceFor(it); const lineEx = (unitEx || 0) * qty; return { code, qty, unitEx: unitEx || 0, lineEx, lineVat: vatOf(lineEx), name: it ? it.name : '' }; });
  const subtotal = lines.reduce((a, l) => a + l.lineEx, 0), vat = lines.reduce((a, l) => a + l.lineVat, 0);
  return { ref: j.r, createdAt: j.t, deliveryDate: j.dl, dealer: { code: j.d[0], name: j.d[1], location: j.d[2], wa: j.d[3], contact: j.d[4] }, lines, subtotal, vat, grand: subtotal + vat };
}
