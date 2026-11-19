AL SEEB TECHNICAL EST. (SARCO) - DEALER APP  v54
Dealer link : https://sarcosarfaraaz.github.io/AL-SEEB-TECH-SARCO/

NEW IN v53 / v54
  v54 SOUNDS – pure water only (made inside the app; switch off in Account):
    1. water drop ........ every normal tap
    2. drip (two drops) .. menu opened / product opened
    3. water splash ...... unit added to the basket
    4. big splash wave ... order sent
    5. rising bubbles .... welcome greeting
    (clap and applause removed)
  Look: Plus Jakarta Sans font, a colour for every category icon, Samsung / Candy badges.
  Market comparison (Lulu, Nesto, Sharaf DG, Extra, Hypermax, Carrefour):
    - prices come from a "MARKET PRICES" sheet inside your stock workbook
      (use MARKET_PRICES_TEMPLATE.xlsx - it lists only items with a running offer)
    - read and published ONLY for items with a running offer
    - our offer price (incl. VAT) is compared with the shelf prices (incl. VAT)
    - SARCO lowest  -> dealers see "Lowest price in Oman - OMR x below <store>"
                       + a comparison chart on the product page
    - a store cheaper -> that offer is HIDDEN from dealers (admin still sees it, with a warning)
    - new sort option: "Biggest saving vs market"
    - the upload page ("Offer check") lists compared items and the offers that will be hidden
  From v52: offer sheet read too, offers without RRP kept, "Offer check" report.

FILES TO UPLOAD (23 files, keep the history folder as a folder)
  CHANGED in v53/v54: dealer.js, dealer.css, core.js, admin.js, admin.html, index.html, sw.js, README.txt
  !! stock.json in this package = live file of 19 Nov 2026 07:51 UTC.
     Do NOT upload it if you published after that time.

NOT FOR GITHUB (for you only): MARKET_PRICES_TEMPLATE.xlsx, water-sound-*.wav

AFTER UPLOADING
  1. Fill MARKET_PRICES_TEMPLATE.xlsx, copy its sheet "MARKET PRICES" into DEALER_APP.xlsx, save.
  2. admin.html -> upload DEALER_APP.xlsx -> read "Offer check" -> PUBLISH.
