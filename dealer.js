/* =====================================================================
   AL SEEB TECHNICAL EST. (SARCO) – DEALER APP  v50 (clean rebuild)
   Needs core.js (engine) and sheet.js (PDF order sheet) loaded first.
   ===================================================================== */
'use strict';
const APP_V = '54';
const WA_NUMBER = '96872416506', WA_DISPLAY = '+968 7241 6506', PHONE = '+96872416506', EMAIL = 'sarfaraaz.khan@sarcooman.com';
const OWNER_HASH = 'd0d94ce020f00c48cc86b5d247537b32468e21567905156cb649fd2ab976e343';
const HIDDEN_CATS = ['mobile'];            /* remove 'mobile' to show phones again */
const DEFAULT_PW = 'sarco@123';
const ADMIN_USERS = ['ADMIN', 'E32114'];
const PAGE = 24;                           /* products drawn per step (more load while scrolling) */

/* ---------- storage ---------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem('sarco.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('sarco.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem('sarco.' + k); } catch (e) { } }
};

/* ---------- language ---------- */
const TX = {"en":{"home":"Home","products":"Products","offers":"Offers","basket":"Basket","myBasket":"My Basket","searchPh":"Search by item code, model or name…","call":"Call","email":"Email","stockUpdated":"Stock updated","categories":"Shop by category","bestsellers":"Bestsellers","seeAll":"See all","noOffers":"No active offers right now","allProducts":"All Products","inStockOnly":"In stock only","activeOffers":"Active offers","nProducts":"{n} products","nProduct":"{n} product","showingFor":"Showing results for","closest":"No exact match for “{q}”. Here are the closest products:","notFound":"We could not find “{q}”","notFoundSub":"Try a shorter word or the item code.","askWa":"Ask Sarfaraaz on WhatsApp","cancel":"Cancel","clear":"Clear","priceReq":"Price on request","inclVat":"incl. VAT","itemCode":"Item code","brand":"Brand","type":"Type","priceEx":"Price excl. VAT","vat5":"VAT 5%","priceInc":"Price incl. VAT","offerPrice":"Offer price incl. VAT","discount":"Discount","validTill":"Offer valid till","availability":"Availability","addBasket":"ADD TO BASKET","noMore":"Not available to order","contactAvail":"Please contact SARCO on WhatsApp to confirm availability.","added":"Added to basket","maxReached":"Maximum available quantity reached","basketEmpty":"Your basket is empty","basketEmptySub":"Search for a product or open a category to start.","browse":"Browse products","unitPrice":"Unit price","remove":"Remove","summary":"Order summary","items":"Items","units":"units","subtotal":"Subtotal (excl. VAT)","vatAmt":"VAT 5%","grand":"Grand total","checkout":"Checkout","continueShop":"Continue shopping","emptyBasket":"Empty basket","emptyQ":"Remove all items from your basket?","yes":"Yes","dealerName":"Dealer name","chooseDealer":"Choose your dealer name","yourName":"Your name (person ordering)","outlet":"Outlet location","delivery":"Delivery date","noteOpt":"Note to SARCO (optional)","changed":"Some items changed since you added them.","accept":"Accept updated items","sendHint":"WhatsApp opens with your full order. Press Send in WhatsApp to complete it.","fillHint":"Please fill in your dealer name, your name, outlet location, delivery date and WhatsApp number.","notFoundOrder":"Order not found on this phone","offline":"You are offline. Showing the last saved stock.","newStock":"New stock loaded","needHelp":"Need help? Contact Sarfaraaz Khan","footer":"AL SEEB TECHNICAL EST. (SARCO) LLC, Sultanate of Oman. Prices are in Omani Rials and include 5% VAT where stated. This app is for placing orders only; no payments are accepted. Adding items to the basket does not reserve stock.","wrongPw":"Wrong password","totalStock":"Total stock","sohar":"Sohar (401)","khazaan":"Khazaan (SAR01)","loading":"Loading stock…","noStock":"Stock is not available yet. Please check again later.","stockLabels":["Cross-check","Almost Gone","Limited Stock","Few Left","Running Low","In Stock"],"waNum":"Your WhatsApp number","waBad":"Please enter a valid WhatsApp number, e.g. 9123 4567","sentTitle":"Order sent to Sarfaraaz Khan","sentSub":"Thank you for your order. Sarfaraaz will confirm it with you shortly.","getCopy":"GET MY CONFIRMATION ON WHATSAPP","getCopyHint":"Opens your own WhatsApp chat with the order details. Press Send to keep the copy.","notSent":"Did WhatsApp not open? Tap here.","askPrice":"Check latest price","askPriceNote":"Prices are shared by Sarfaraaz Khan. You can add this item to your basket and send your order, or ask for the latest price on WhatsApp.","allBrands":"All brands","brands":{"SAMSUNG":"Samsung","CANDY":"Candy","MULTI BRAND":"Accessories"},"sheetBtn":"Download order sheet (PDF)","sheetTitle":"SARCO order sheet","sheetSub":"Filled automatically for your records.","preparing":"Preparing your order sheet…","sheetErr":"Could not create the order sheet. Please check your internet connection.","sheetReady":"Order sheet ready","signIn":"SIGN IN","loginHint":"Your User ID is your dealer code, for example CL005761.","loginBad":"Incorrect User ID or password","loginWelcome":"Welcome to the SARCO dealer app","account":"Account","hello":"Welcome, {n}","changePw":"Change password","curPw":"Current password","newPw":"New password","newPw2":"Confirm new password","pwRule":"At least 6 characters","pwMismatch":"The new passwords do not match","pwShort":"The new password must have at least 6 characters","pwSaved":"Password changed on this phone. Send it to Sarfaraaz to activate it on all your phones.","pwSendBtn":"Send password update to Sarfaraaz","logout":"Sign out","language":"Language","adminRole":"Admin – full access","uploadPage":"Open stock upload page","orderFor":"Order for dealer","notStored":"Orders are not stored in the app. Download your order sheet now if you need it.","newOrder":"Start a new order","step2Copy":"Now get your own confirmation:","saveBtn":"SAVE","noPayT":"Orders only – no payments","privT":"Your privacy is protected","notYours":"This order belongs to another dealer. For privacy, it cannot be opened from this account.","offerPriceEx":"Offer price excl. VAT","tbc":"To be confirmed","pricesTbc":"Prices for non-offer items will be confirmed by SARCO.","newOffersT":"🔔 New offers!","newOffersB":"New offers have just been published ({n}). Tap below to see them.","seeOffers":"See offers","noSignAdmin":"This dealer’s signed sales order sheet is missing. Please add it in the upload page (Dealers tab).","missingSign":"{n} dealers have no signed sales order sheet. Add them in the upload page → Dealers tab.","alertsT":"Offer alerts","alertsB":"Hear a ping and see a message when new offers are published.","alertsOn":"Turn on alerts","alertsOk":"Offer alerts are on","alertsTest":"Test sound","viewAs":"Open a dealer account","viewAsB":"See the app exactly as this dealer sees it. You can come back to your admin account at any time.","openAs":"Open as this dealer","asDealer":"Admin viewing as {n}","backAdmin":"Back to admin","dealerCodeHint":"Admin only: enter a dealer code to open that dealer’s account.","badDealer":"This dealer code was not found","resetT":"Please set your own password","resetB":"For your security, choose a new password before you continue. Do not share it with anyone.","resetSave":"SAVE MY NEW PASSWORD","resetDone":"Your new password is saved","continueBtn":"Continue to the app","resetDealerT":"Reset a dealer password","resetDealerB":"If a dealer forgets the password, reset it to sarco@123. The dealer will be asked to choose a new password at the next login.","resetBtn":"Reset in upload page","hi":"Hi, {n} 👋","whatToday":"What would you like to order today?","almostDone":"Almost done!","shortNotice":"🧾 Orders only – no payments · 🔒 Your details are private","reviewOrder":"Your order","sendNow":"Send my order","chooseLang":"Choose your language","goCheckout":"Go to checkout","itemsN":"{n} items","keepBasketQ":"You have items in your basket ({n}). They will be kept for your next login. Do you want to sign out?","itemN":"{n} item","browseGuest":"Browse stock without signing in","guestHi":"Hi 👋","signToOrder":"Sign in to send your order","guestBar":"Guest view – availability and offer prices only","guestNote":"You are browsing as a guest. You can see availability and offer prices. Sign in with your dealer code to send an order. Your basket will be kept.","months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"cur":"OMR","menu":"Menu","add":"Add","askWaShort":"Ask","askWaItem":"Ask about this item on WhatsApp","now":"Now","was":"Was","youSave":"You save","wasPrice":"Normal price (was) incl. VAT","validTillD":"Valid till {d}","daysLeft":"{n} days left","oneDay":"1 day left","lastDay":"Last day today","offerShort":"OFFER","specialOffers":"Special offers","nOffers":"{n} offer items","offerFolders":"Offer folders","allOffers":"All offers","hotOffers":"Best offers","allShort":"All","sortBy":"Sort","sortRec":"Recommended","sortLow":"Price: low to high","sortHigh":"Price: high to low","sortOffers":"Offers first","sortAz":"Name A–Z","noPriceLast":"items without a price are shown last","showMore":"Show {n} more","offersHint":"Offer prices include 5% VAT and end automatically after the last valid day (Oman time).","inBasketN":"{n} already in your basket","folder":"Category","grp":{"fridge":"Fridges","wash":"Washing Machines","dish":"Dishwashers","micro":"Microwaves","vacuum":"Vacuum Cleaners","tv":"Televisions","ac":"Air Conditioners","audio":"Audio & Projectors","builtin":"Candy Built-in","acc":"Accessories","other":"Other"},"welcomeT":"Welcome","welcomeMsg":"I wish you barakah in your business, and a happy, healthy and wealthy life.","welcomeSign":"Sarfaraaz Khan","welcomeGo":"Let's start","tapSoundT":"Water sounds – drops and splashes","onW":"On","offW":"Off","mktBest":"Lowest price in Oman","mktBelow":"{a} below {s}","mktTitle":"Oman market comparison","mktNote":"Shelf prices incl. VAT in Oman stores, checked on {d}. Compared only while the offer is running.","mktHidden":"Hidden from dealers – cheaper at {s}","sortMkt":"Biggest saving vs market","nBestOman":"{n} offers are the lowest price in Oman"},"ar":{"home":"الرئيسية","products":"المنتجات","offers":"العروض","basket":"السلة","myBasket":"سلتي","searchPh":"ابحث برمز الصنف أو الموديل أو الاسم…","call":"اتصال","email":"بريد إلكتروني","stockUpdated":"آخر تحديث للمخزون","categories":"تسوّق حسب الفئة","bestsellers":"الأكثر مبيعاً","seeAll":"عرض الكل","noOffers":"لا توجد عروض حالياً","allProducts":"جميع المنتجات","inStockOnly":"المتوفر فقط","activeOffers":"العروض الحالية","nProducts":"عدد المنتجات: {n}","nProduct":"عدد المنتجات: {n}","showingFor":"عرض النتائج لـ","closest":"لا توجد نتيجة مطابقة تماماً لـ “{q}”. إليك أقرب المنتجات:","notFound":"لم نعثر على “{q}”","notFoundSub":"جرّب كلمة أقصر أو رمز الصنف.","askWa":"اسأل سرفراز عبر واتساب","cancel":"إلغاء","clear":"مسح","priceReq":"السعر عند الطلب","inclVat":"شامل الضريبة","itemCode":"رمز الصنف","brand":"العلامة التجارية","type":"النوع","priceEx":"السعر بدون ضريبة","vat5":"ضريبة القيمة المضافة 5%","priceInc":"السعر شامل الضريبة","offerPrice":"سعر العرض شامل الضريبة","discount":"الخصم","validTill":"العرض ساري حتى","availability":"التوفر","addBasket":"أضف إلى السلة","noMore":"غير متاح للطلب","contactAvail":"يرجى التواصل مع ساركو عبر واتساب للتأكد من التوفر.","added":"تمت الإضافة إلى السلة","maxReached":"تم الوصول إلى أقصى كمية متاحة","basketEmpty":"سلتك فارغة","basketEmptySub":"ابحث عن منتج أو افتح فئة للبدء.","browse":"تصفّح المنتجات","unitPrice":"سعر الوحدة","remove":"حذف","summary":"ملخص الطلب","items":"الأصناف","units":"وحدة","subtotal":"المجموع قبل الضريبة","vatAmt":"ضريبة القيمة المضافة 5%","grand":"الإجمالي","checkout":"إتمام الطلب","continueShop":"متابعة التسوق","emptyBasket":"إفراغ السلة","emptyQ":"هل تريد حذف جميع الأصناف من السلة؟","yes":"نعم","dealerName":"اسم التاجر","chooseDealer":"اختر اسم التاجر","yourName":"اسمك (مقدّم الطلب)","outlet":"موقع المحل","delivery":"تاريخ التسليم","noteOpt":"ملاحظة لساركو (اختياري)","changed":"تغيّرت بعض الأصناف منذ إضافتها.","accept":"قبول التحديثات","sendHint":"سيُفتح واتساب وفيه طلبك كاملاً. اضغط «إرسال» في واتساب لإتمام الطلب.","fillHint":"يرجى إدخال اسم التاجر واسمك وموقع المحل وتاريخ التسليم ورقم واتساب.","notFoundOrder":"الطلب غير موجود على هذا الهاتف","offline":"أنت غير متصل بالإنترنت. يتم عرض آخر مخزون محفوظ.","newStock":"تم تحميل مخزون جديد","needHelp":"تحتاج مساعدة؟ تواصل مع سرفراز خان","footer":"مؤسسة السيب الفنية (ساركو) ش.م.م، سلطنة عُمان. الأسعار بالريال العُماني وتشمل ضريبة القيمة المضافة 5% حيثما ذُكر. هذا التطبيق لتقديم الطلبات فقط، ولا يتم قبول أي مدفوعات. الإضافة إلى السلة لا تعني حجز المخزون.","wrongPw":"كلمة المرور غير صحيحة","totalStock":"إجمالي المخزون","sohar":"صحار (401)","khazaan":"خزائن (SAR01)","loading":"جارٍ تحميل المخزون…","noStock":"المخزون غير متاح حالياً. يرجى المحاولة لاحقاً.","stockLabels":["يُرجى التأكد","على وشك النفاد","كمية محدودة","تبقّى القليل","المخزون يتناقص","متوفر"],"waNum":"رقم واتساب الخاص بك","waBad":"يرجى إدخال رقم واتساب صحيح، مثال: 9123 4567","sentTitle":"تم إرسال الطلب إلى سرفراز خان","sentSub":"شكراً لطلبكم. سيقوم سرفراز بتأكيد الطلب معكم قريباً.","getCopy":"استلم تأكيد الطلب على واتساب","getCopyHint":"سيفتح محادثتك الخاصة في واتساب وفيها تفاصيل الطلب. اضغط «إرسال» للاحتفاظ بالنسخة.","notSent":"لم يُفتح واتساب؟ اضغط هنا.","askPrice":"اسأل عن آخر سعر","askPriceNote":"يقدّم سرفراز خان الأسعار. يمكنك إضافة هذا الصنف إلى السلة وإرسال طلبك، أو السؤال عن آخر سعر عبر واتساب.","allBrands":"جميع العلامات","brands":{"SAMSUNG":"سامسونج","CANDY":"كاندي","MULTI BRAND":"الملحقات"},"sheetBtn":"تحميل نموذج الطلب (PDF)","sheetTitle":"نموذج طلب ساركو","sheetSub":"يُعبّأ تلقائياً للاحتفاظ به كمرجع.","preparing":"جارٍ تجهيز نموذج الطلب…","sheetErr":"تعذّر إنشاء نموذج الطلب. يرجى التحقق من الاتصال بالإنترنت.","sheetReady":"نموذج الطلب جاهز","signIn":"دخول","loginHint":"رمز المستخدم (User ID) هو رمز التاجر، مثال: CL005761.","loginBad":"رمز المستخدم أو كلمة المرور غير صحيح","loginWelcome":"مرحباً بكم في تطبيق تجّار ساركو","account":"حسابي","hello":"مرحباً، {n}","changePw":"تغيير كلمة المرور","curPw":"كلمة المرور الحالية","newPw":"كلمة المرور الجديدة","newPw2":"تأكيد كلمة المرور الجديدة","pwRule":"6 أحرف على الأقل","pwMismatch":"كلمتا المرور الجديدتان غير متطابقتين","pwShort":"يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل","pwSaved":"تم تغيير كلمة المرور على هذا الهاتف. أرسلها إلى سرفراز لتفعيلها على جميع هواتفك.","pwSendBtn":"إرسال تحديث كلمة المرور إلى سرفراز","logout":"تسجيل الخروج","language":"اللغة","adminRole":"المسؤول – صلاحية كاملة","uploadPage":"فتح صفحة رفع المخزون","orderFor":"الطلب للتاجر","notStored":"لا يتم حفظ الطلبات في التطبيق. حمّل نموذج الطلب الآن إذا كنت تحتاجه.","newOrder":"ابدأ طلباً جديداً","step2Copy":"الآن استلم نسخة التأكيد الخاصة بك:","saveBtn":"حفظ","noPayT":"للطلبات فقط – لا مدفوعات","privT":"خصوصيتك محمية","notYours":"هذا الطلب يخص تاجراً آخر، ولا يمكن فتحه من هذا الحساب حفاظاً على الخصوصية.","offerPriceEx":"سعر العرض بدون ضريبة","tbc":"سيتم تأكيده","pricesTbc":"سيتم تأكيد أسعار الأصناف غير المشمولة بالعروض من قِبل ساركو.","newOffersT":"🔔 عروض جديدة!","newOffersB":"تم نشر عروض جديدة الآن ({n}). اضغط أدناه لمشاهدتها.","seeOffers":"عرض العروض","noSignAdmin":"نموذج الطلب الموقّع لهذا التاجر غير موجود. يرجى إضافته من صفحة الرفع (تبويب التجّار).","missingSign":"لا توجد نماذج طلب موقّعة لعدد {n} من التجّار. أضفها من صفحة الرفع ← تبويب التجّار.","alertsT":"تنبيهات العروض","alertsB":"استمع إلى نغمة تنبيه وشاهد رسالة عند نشر عروض جديدة.","alertsOn":"تفعيل التنبيهات","alertsOk":"تنبيهات العروض مفعّلة","alertsTest":"تجربة الصوت","viewAs":"فتح حساب تاجر","viewAsB":"شاهد التطبيق كما يراه هذا التاجر تماماً. يمكنك العودة إلى حساب المسؤول في أي وقت.","openAs":"الدخول كهذا التاجر","asDealer":"المسؤول يعرض حساب {n}","backAdmin":"العودة إلى المسؤول","dealerCodeHint":"للمسؤول فقط: أدخل رمز التاجر لفتح حسابه.","badDealer":"رمز التاجر هذا غير موجود","resetT":"يرجى تعيين كلمة مرور خاصة بك","resetB":"حفاظاً على أمانك، اختر كلمة مرور جديدة قبل المتابعة، ولا تشاركها مع أي شخص.","resetSave":"حفظ كلمة المرور الجديدة","resetDone":"تم حفظ كلمة المرور الجديدة","continueBtn":"المتابعة إلى التطبيق","resetDealerT":"إعادة تعيين كلمة مرور تاجر","resetDealerB":"إذا نسي التاجر كلمة المرور، أعد تعيينها إلى sarco@123. سيُطلب من التاجر اختيار كلمة مرور جديدة عند الدخول التالي.","resetBtn":"إعادة التعيين من صفحة الرفع","hi":"مرحباً، {n} 👋","whatToday":"ماذا تريد أن تطلب اليوم؟","almostDone":"اقتربت من الانتهاء!","shortNotice":"🧾 للطلبات فقط – لا مدفوعات · 🔒 بياناتك خاصة","reviewOrder":"طلبك","sendNow":"إرسال طلبي","chooseLang":"اختر لغتك","goCheckout":"الانتقال إلى إتمام الطلب","keepBasketQ":"لديك أصناف في السلة ({n}) وسيتم حفظها لدخولك القادم. هل تريد تسجيل الخروج؟","itemN":"صنف واحد","itemsN":"الأصناف: {n}","browseGuest":"تصفّح المخزون بدون تسجيل الدخول","guestHi":"مرحباً 👋","signToOrder":"سجّل الدخول لإرسال طلبك","guestBar":"عرض الزائر – التوفر وأسعار العروض فقط","guestNote":"أنت تتصفح كزائر. يمكنك رؤية التوفر وأسعار العروض. سجّل الدخول برمز التاجر لإرسال الطلب، وسيتم الاحتفاظ بسلتك.","months":["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],"cur":"ر.ع.","menu":"القائمة","add":"أضف","askWaShort":"اسأل","askWaItem":"اسأل عن هذا المنتج عبر واتساب","now":"الآن","was":"كان","youSave":"توفّر","wasPrice":"السعر العادي (كان) شامل الضريبة","validTillD":"صالح حتى {d}","daysLeft":"متبقٍ {n} أيام","oneDay":"متبقٍ يوم واحد","lastDay":"اليوم آخر يوم","offerShort":"عرض","specialOffers":"العروض الخاصة","nOffers":"{n} منتجات بعروض","offerFolders":"مجلدات العروض","allOffers":"كل العروض","hotOffers":"أفضل العروض","allShort":"الكل","sortBy":"ترتيب","sortRec":"المقترح","sortLow":"السعر: من الأقل للأعلى","sortHigh":"السعر: من الأعلى للأقل","sortOffers":"العروض أولاً","sortAz":"الاسم أ–ي","noPriceLast":"المنتجات بدون سعر تظهر في النهاية","showMore":"عرض {n} أكثر","offersHint":"أسعار العروض شاملة ضريبة 5% وتنتهي تلقائياً بعد آخر يوم صالح (بتوقيت عُمان).","inBasketN":"{n} موجودة في سلتك","folder":"الفئة","grp":{"fridge":"ثلاجات","wash":"غسالات","dish":"غسالات صحون","micro":"ميكروويف","vacuum":"مكانس كهربائية","tv":"تلفزيونات","ac":"مكيفات","audio":"صوتيات وبروجكتر","builtin":"كاندي – أجهزة مدمجة","acc":"إكسسوارات","other":"أخرى"},"cf":{"thanks":"*شكراً لطلبكم!*","dear":"عزيزي","sent":"تم إرسال طلبكم إلى ساركو. إليكم تفاصيل الطلب:","ref":"رقم الطلب","date":"التاريخ (بتوقيت عُمان)","dealer":"التاجر","loc":"موقع المحل","items":"*الأصناف:*","qty":"الكمية","withVat":"شامل ضريبة 5%","tbcLine":"السعر: سيؤكده ساركو","totalTbc":"*الإجمالي: سيؤكده ساركو*","sub":"المجموع قبل الضريبة","vat":"ضريبة القيمة المضافة 5%","total":"*الإجمالي شامل الضريبة*","del":"*تاريخ التسليم*","sheet":"نموذج الطلب (PDF)","confirm":"سيقوم سرفراز خان بتأكيد طلبكم قريباً.","noPay":"ملاحظة: لا يتم تحصيل أي مبلغ من خلال التطبيق، وستؤكد ساركو شروط الدفع معكم."},"welcomeT":"أهلاً وسهلاً","welcomeMsg":"أتمنى لكم البركة في تجارتكم، وحياة سعيدة مليئة بالصحة والرزق الوفير.","welcomeSign":"سرفراز خان","welcomeGo":"لنبدأ","tapSoundT":"أصوات الماء – قطرات ورذاذ","onW":"تشغيل","offW":"إيقاف","mktBest":"أقل سعر في عُمان","mktBelow":"أقل بـ {a} من {s}","mktTitle":"مقارنة أسعار السوق في عُمان","mktNote":"أسعار الرفوف شاملة الضريبة في متاجر عُمان، تم التحقق في {d}. تتم المقارنة فقط أثناء سريان العرض.","mktHidden":"مخفي عن التجار – أرخص في {s}","sortMkt":"أكبر توفير مقارنة بالسوق","nBestOman":"{n} عروض بأقل سعر في عُمان"},"ml":{"home":"ഹോം","products":"ഉൽപ്പന്നങ്ങൾ","offers":"ഓഫറുകൾ","basket":"ബാസ്കറ്റ്","myBasket":"എന്റെ ബാസ്കറ്റ്","searchPh":"ഐറ്റം കോഡ്, മോഡൽ അല്ലെങ്കിൽ പേര് ഉപയോഗിച്ച് തിരയുക…","call":"വിളിക്കുക","email":"ഇമെയിൽ","stockUpdated":"സ്റ്റോക്ക് അപ്ഡേറ്റ് ചെയ്തത്","categories":"വിഭാഗം അനുസരിച്ച് നോക്കുക","bestsellers":"ബെസ്റ്റ് സെല്ലറുകൾ","seeAll":"എല്ലാം കാണുക","noOffers":"ഇപ്പോൾ ഓഫറുകളൊന്നുമില്ല","allProducts":"എല്ലാ ഉൽപ്പന്നങ്ങളും","inStockOnly":"സ്റ്റോക്കുള്ളവ മാത്രം","activeOffers":"നിലവിലെ ഓഫറുകൾ","nProducts":"{n} ഉൽപ്പന്നങ്ങൾ","nProduct":"{n} ഉൽപ്പന്നം","showingFor":"ഇതിനുള്ള ഫലങ്ങൾ കാണിക്കുന്നു:","closest":"“{q}” എന്നതിന് കൃത്യമായ ഫലമില്ല. ഏറ്റവും അടുത്ത ഉൽപ്പന്നങ്ങൾ ഇതാ:","notFound":"“{q}” കണ്ടെത്താനായില്ല","notFoundSub":"ചെറിയ ഒരു വാക്കോ ഐറ്റം കോഡോ ഉപയോഗിച്ച് നോക്കുക.","askWa":"സർഫറാസിനോട് വാട്ട്‌സ്ആപ്പിൽ ചോദിക്കുക","cancel":"റദ്ദാക്കുക","clear":"മായ്ക്കുക","priceReq":"വിലയ്ക്ക് ബന്ധപ്പെടുക","inclVat":"വാറ്റ് ഉൾപ്പെടെ","itemCode":"ഐറ്റം കോഡ്","brand":"ബ്രാൻഡ്","type":"തരം","priceEx":"വാറ്റ് ഇല്ലാതെയുള്ള വില","vat5":"വാറ്റ് 5%","priceInc":"വാറ്റ് ഉൾപ്പെടെയുള്ള വില","offerPrice":"ഓഫർ വില (വാറ്റ് ഉൾപ്പെടെ)","discount":"ഡിസ്കൗണ്ട്","validTill":"ഓഫർ കാലാവധി","availability":"ലഭ്യത","addBasket":"ബാസ്കറ്റിൽ ചേർക്കുക","noMore":"ഓർഡർ ചെയ്യാൻ ലഭ്യമല്ല","contactAvail":"ലഭ്യത ഉറപ്പാക്കാൻ ദയവായി വാട്ട്‌സ്ആപ്പിൽ SARCO-യെ ബന്ധപ്പെടുക.","added":"ബാസ്കറ്റിൽ ചേർത്തു","maxReached":"ലഭ്യമായ പരമാവധി എണ്ണം എത്തി","basketEmpty":"നിങ്ങളുടെ ബാസ്കറ്റ് ശൂന്യമാണ്","basketEmptySub":"തുടങ്ങാൻ ഒരു ഉൽപ്പന്നം തിരയുകയോ ഒരു വിഭാഗം തുറക്കുകയോ ചെയ്യുക.","browse":"ഉൽപ്പന്നങ്ങൾ കാണുക","unitPrice":"ഒന്നിന്റെ വില","remove":"നീക്കം ചെയ്യുക","summary":"ഓർഡർ സംഗ്രഹം","items":"ഐറ്റങ്ങൾ","units":"എണ്ണം","subtotal":"ആകെ (വാറ്റ് ഇല്ലാതെ)","vatAmt":"വാറ്റ് 5%","grand":"മൊത്തം തുക","checkout":"ഓർഡർ ചെയ്യുക","continueShop":"കൂടുതൽ ഉൽപ്പന്നങ്ങൾ നോക്കുക","emptyBasket":"ബാസ്കറ്റ് കാലിയാക്കുക","emptyQ":"ബാസ്കറ്റിലെ എല്ലാ ഐറ്റങ്ങളും നീക്കം ചെയ്യണോ?","yes":"അതെ","dealerName":"ഡീലറുടെ പേര്","chooseDealer":"ഡീലറുടെ പേര് തിരഞ്ഞെടുക്കുക","yourName":"നിങ്ങളുടെ പേര് (ഓർഡർ ചെയ്യുന്നയാൾ)","outlet":"ഷോപ്പിന്റെ ലൊക്കേഷൻ","delivery":"ഡെലിവറി തീയതി","noteOpt":"SARCO-യ്ക്കുള്ള കുറിപ്പ് (ഓപ്ഷണൽ)","changed":"നിങ്ങൾ ചേർത്ത ശേഷം ചില ഐറ്റങ്ങളിൽ മാറ്റം വന്നു.","accept":"മാറ്റങ്ങൾ സ്വീകരിക്കുക","sendHint":"നിങ്ങളുടെ മുഴുവൻ ഓർഡറുമായി വാട്ട്‌സ്ആപ്പ് തുറക്കും. പൂർത്തിയാക്കാൻ വാട്ട്‌സ്ആപ്പിൽ Send അമർത്തുക.","fillHint":"നിങ്ങളുടെ പേര്, ഷോപ്പിന്റെ ലൊക്കേഷൻ, ഡെലിവറി തീയതി, വാട്ട്‌സ്ആപ്പ് നമ്പർ എന്നിവ ദയവായി പൂരിപ്പിക്കുക.","notFoundOrder":"ഈ ഓർഡർ കണ്ടെത്താനായില്ല","offline":"നിങ്ങൾ ഓഫ്‌ലൈനാണ്. അവസാനം സേവ് ചെയ്ത സ്റ്റോക്ക് കാണിക്കുന്നു.","newStock":"പുതിയ സ്റ്റോക്ക് ലഭ്യമായി","needHelp":"സഹായം വേണോ? സർഫറാസ് ഖാനെ ബന്ധപ്പെടുക","footer":"AL SEEB TECHNICAL EST. (SARCO) LLC, സുൽത്താനേറ്റ് ഓഫ് ഒമാൻ. വിലകൾ ഒമാനി റിയാലിലാണ്; സൂചിപ്പിച്ചിടത്ത് 5% വാറ്റ് ഉൾപ്പെടുന്നു. ഈ ആപ്പ് ഓർഡറുകൾ നൽകാൻ മാത്രമുള്ളതാണ്; പണമൊന്നും സ്വീകരിക്കുന്നില്ല. ബാസ്കറ്റിൽ ചേർക്കുന്നത് സ്റ്റോക്ക് റിസർവ് ചെയ്യുന്നില്ല.","wrongPw":"പാസ്‌വേഡ് തെറ്റാണ്","totalStock":"മൊത്തം സ്റ്റോക്ക്","sohar":"സോഹാർ (401)","khazaan":"ഖസായിൻ (SAR01)","loading":"സ്റ്റോക്ക് ലോഡ് ചെയ്യുന്നു…","noStock":"സ്റ്റോക്ക് ഇപ്പോൾ ലഭ്യമല്ല. ദയവായി പിന്നീട് നോക്കുക.","stockLabels":["ലഭ്യത ഉറപ്പാക്കുക","തീരാറായി","പരിമിതമായ സ്റ്റോക്ക്","കുറച്ച് മാത്രം ബാക്കി","സ്റ്റോക്ക് കുറയുന്നു","സ്റ്റോക്കുണ്ട്"],"waNum":"നിങ്ങളുടെ വാട്ട്‌സ്ആപ്പ് നമ്പർ","waBad":"ശരിയായ വാട്ട്‌സ്ആപ്പ് നമ്പർ നൽകുക, ഉദാ: 9123 4567","sentTitle":"ഓർഡർ സർഫറാസ് ഖാന് അയച്ചു","sentSub":"നിങ്ങളുടെ ഓർഡറിന് നന്ദി. സർഫറാസ് ഉടൻ തന്നെ നിങ്ങളുമായി സ്ഥിരീകരിക്കും.","getCopy":"എന്റെ സ്ഥിരീകരണം വാട്ട്‌സ്ആപ്പിൽ നേടുക","getCopyHint":"ഓർഡർ വിവരങ്ങളുമായി നിങ്ങളുടെ സ്വന്തം വാട്ട്‌സ്ആപ്പ് ചാറ്റ് തുറക്കും. കോപ്പി സൂക്ഷിക്കാൻ Send അമർത്തുക.","notSent":"വാട്ട്‌സ്ആപ്പ് തുറന്നില്ലേ? ഇവിടെ അമർത്തുക.","askPrice":"പുതിയ വില അറിയുക","askPriceNote":"വിലകൾ സർഫറാസ് ഖാൻ അറിയിക്കും. ഈ ഐറ്റം ബാസ്കറ്റിൽ ചേർത്ത് ഓർഡർ അയയ്ക്കാം, അല്ലെങ്കിൽ പുതിയ വില വാട്ട്‌സ്ആപ്പിൽ ചോദിക്കാം.","allBrands":"എല്ലാ ബ്രാൻഡുകളും","brands":{"SAMSUNG":"സാംസങ്","CANDY":"കാൻഡി","MULTI BRAND":"ആക്സസറികൾ"},"sheetBtn":"ഓർഡർ ഷീറ്റ് ഡൗൺലോഡ് ചെയ്യുക (PDF)","sheetTitle":"SARCO ഓർഡർ ഷീറ്റ്","sheetSub":"നിങ്ങളുടെ റെക്കോർഡിനായി സ്വയം പൂരിപ്പിച്ചത്.","preparing":"ഓർഡർ ഷീറ്റ് തയ്യാറാക്കുന്നു…","sheetErr":"ഓർഡർ ഷീറ്റ് ഉണ്ടാക്കാനായില്ല. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.","sheetReady":"ഓർഡർ ഷീറ്റ് തയ്യാർ","signIn":"ലോഗിൻ ചെയ്യുക","loginHint":"നിങ്ങളുടെ ഡീലർ കോഡാണ് യൂസർ ഐഡി (User ID), ഉദാ: CL005761.","loginBad":"യൂസർ ഐഡി അല്ലെങ്കിൽ പാസ്‌വേഡ് തെറ്റാണ്","loginWelcome":"SARCO ഡീലർ ആപ്പിലേക്ക് സ്വാഗതം","account":"അക്കൗണ്ട്","hello":"സ്വാഗതം, {n}","changePw":"പാസ്‌വേഡ് മാറ്റുക","curPw":"നിലവിലെ പാസ്‌വേഡ്","newPw":"പുതിയ പാസ്‌വേഡ്","newPw2":"പുതിയ പാസ്‌വേഡ് വീണ്ടും നൽകുക","pwRule":"കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ","pwMismatch":"പുതിയ പാസ്‌വേഡുകൾ ഒന്നല്ല","pwShort":"പുതിയ പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം","pwSaved":"ഈ ഫോണിൽ പാസ്‌വേഡ് മാറ്റി. നിങ്ങളുടെ എല്ലാ ഫോണുകളിലും പ്രവർത്തിക്കാൻ ഇത് സർഫറാസിന് അയയ്ക്കുക.","pwSendBtn":"പാസ്‌വേഡ് മാറ്റം സർഫറാസിന് അയയ്ക്കുക","logout":"ലോഗൗട്ട്","language":"ഭാഷ","adminRole":"അഡ്മിൻ – പൂർണ്ണ ആക്സസ്","uploadPage":"സ്റ്റോക്ക് അപ്‌ലോഡ് പേജ് തുറക്കുക","orderFor":"ഡീലർക്കുള്ള ഓർഡർ","notStored":"ഓർഡറുകൾ ആപ്പിൽ സൂക്ഷിക്കുന്നില്ല. ആവശ്യമെങ്കിൽ ഓർഡർ ഷീറ്റ് ഇപ്പോൾ ഡൗൺലോഡ് ചെയ്യുക.","newOrder":"പുതിയ ഓർഡർ തുടങ്ങുക","step2Copy":"ഇനി നിങ്ങളുടെ സ്ഥിരീകരണം നേടുക:","saveBtn":"സേവ് ചെയ്യുക","noPayT":"ഓർഡറുകൾക്ക് മാത്രം – പണമടയ്ക്കൽ ഇല്ല","privT":"നിങ്ങളുടെ സ്വകാര്യത സുരക്ഷിതമാണ്","notYours":"ഈ ഓർഡർ മറ്റൊരു ഡീലറുടേതാണ്. സ്വകാര്യതയ്ക്കായി ഈ അക്കൗണ്ടിൽ നിന്ന് ഇത് തുറക്കാൻ കഴിയില്ല.","offerPriceEx":"ഓഫർ വില (വാറ്റ് ഇല്ലാതെ)","tbc":"സ്ഥിരീകരിക്കും","pricesTbc":"ഓഫറിലില്ലാത്ത ഐറ്റങ്ങളുടെ വില SARCO സ്ഥിരീകരിക്കും.","newOffersT":"🔔 പുതിയ ഓഫറുകൾ!","newOffersB":"പുതിയ ഓഫറുകൾ ഇപ്പോൾ പ്രസിദ്ധീകരിച്ചു ({n}). കാണാൻ താഴെ അമർത്തുക.","seeOffers":"ഓഫറുകൾ കാണുക","noSignAdmin":"ഈ ഡീലറുടെ ഒപ്പിട്ട സെയിൽസ് ഓർഡർ ഷീറ്റ് ലഭ്യമല്ല. അപ്‌ലോഡ് പേജിലെ Dealers ടാബിൽ ചേർക്കുക.","missingSign":"{n} ഡീലർമാരുടെ ഒപ്പിട്ട സെയിൽസ് ഓർഡർ ഷീറ്റ് ലഭ്യമല്ല. അപ്‌ലോഡ് പേജിലെ Dealers ടാബിൽ ചേർക്കുക.","alertsT":"ഓഫർ അലേർട്ടുകൾ","alertsB":"പുതിയ ഓഫറുകൾ പ്രസിദ്ധീകരിക്കുമ്പോൾ ഒരു പിങ് ശബ്ദവും സന്ദേശവും ലഭിക്കും.","alertsOn":"അലേർട്ടുകൾ ഓണാക്കുക","alertsOk":"ഓഫർ അലേർട്ടുകൾ ഓണാണ്","alertsTest":"ശബ്ദം പരീക്ഷിക്കുക","viewAs":"ഒരു ഡീലർ അക്കൗണ്ട് തുറക്കുക","viewAsB":"ഈ ഡീലർ കാണുന്നതുപോലെ തന്നെ ആപ്പ് കാണുക. എപ്പോൾ വേണമെങ്കിലും അഡ്മിൻ അക്കൗണ്ടിലേക്ക് തിരികെ വരാം.","openAs":"ഈ ഡീലറായി തുറക്കുക","asDealer":"അഡ്മിൻ {n} ആയി കാണുന്നു","backAdmin":"അഡ്മിനിലേക്ക് മടങ്ങുക","dealerCodeHint":"അഡ്മിന് മാത്രം: ഒരു ഡീലറുടെ അക്കൗണ്ട് തുറക്കാൻ ഡീലർ കോഡ് നൽകുക.","badDealer":"ഈ ഡീലർ കോഡ് കണ്ടെത്തിയില്ല","resetT":"ദയവായി നിങ്ങളുടെ സ്വന്തം പാസ്‌വേഡ് സജ്ജമാക്കുക","resetB":"നിങ്ങളുടെ സുരക്ഷയ്ക്കായി, തുടരുന്നതിന് മുമ്പ് ഒരു പുതിയ പാസ്‌വേഡ് തിരഞ്ഞെടുക്കുക. ഇത് ആരുമായും പങ്കിടരുത്.","resetSave":"പുതിയ പാസ്‌വേഡ് സേവ് ചെയ്യുക","resetDone":"നിങ്ങളുടെ പുതിയ പാസ്‌വേഡ് സേവ് ചെയ്തു","continueBtn":"ആപ്പിലേക്ക് തുടരുക","resetDealerT":"ഡീലറുടെ പാസ്‌വേഡ് റീസെറ്റ് ചെയ്യുക","resetDealerB":"ഡീലർ പാസ്‌വേഡ് മറന്നാൽ, അത് sarco@123 ആയി റീസെറ്റ് ചെയ്യുക. അടുത്ത ലോഗിനിൽ പുതിയ പാസ്‌വേഡ് തിരഞ്ഞെടുക്കാൻ ഡീലറോട് ആവശ്യപ്പെടും.","resetBtn":"അപ്‌ലോഡ് പേജിൽ റീസെറ്റ് ചെയ്യുക","hi":"നമസ്കാരം, {n} 👋","whatToday":"ഇന്ന് എന്താണ് ഓർഡർ ചെയ്യേണ്ടത്?","almostDone":"ഏകദേശം പൂർത്തിയായി!","shortNotice":"🧾 ഓർഡറുകൾക്ക് മാത്രം – പണമടയ്ക്കൽ ഇല്ല · 🔒 നിങ്ങളുടെ വിവരങ്ങൾ സ്വകാര്യമാണ്","reviewOrder":"നിങ്ങളുടെ ഓർഡർ","sendNow":"എന്റെ ഓർഡർ അയയ്ക്കുക","chooseLang":"നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക","goCheckout":"ഓർഡർ ചെയ്യാൻ പോകുക","itemsN":"{n} ഐറ്റങ്ങൾ","keepBasketQ":"നിങ്ങളുടെ ബാസ്കറ്റിൽ ഐറ്റങ്ങൾ ഉണ്ട് ({n}). അവ അടുത്ത ലോഗിൻ വരെ സൂക്ഷിക്കും. ലോഗൗട്ട് ചെയ്യണോ?","itemN":"{n} ഐറ്റം","browseGuest":"ലോഗിൻ ചെയ്യാതെ സ്റ്റോക്ക് കാണുക","guestHi":"നമസ്കാരം 👋","signToOrder":"ഓർഡർ അയയ്ക്കാൻ ലോഗിൻ ചെയ്യുക","guestBar":"അതിഥി കാഴ്ച – ലഭ്യതയും ഓഫർ വിലകളും മാത്രം","guestNote":"നിങ്ങൾ അതിഥിയായി കാണുകയാണ്. ലഭ്യതയും ഓഫർ വിലകളും കാണാം. ഓർഡർ അയയ്ക്കാൻ ഡീലർ കോഡ് ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക. നിങ്ങളുടെ ബാസ്കറ്റ് സൂക്ഷിക്കും.","months":["ജനുവരി","ഫെബ്രുവരി","മാർച്ച്","ഏപ്രിൽ","മേയ്","ജൂൺ","ജൂലൈ","ഓഗസ്റ്റ്","സെപ്റ്റംബർ","ഒക്ടോബർ","നവംബർ","ഡിസംബർ"],"cur":"OMR","menu":"മെനു","add":"ചേർക്കുക","askWaShort":"ചോദിക്കുക","askWaItem":"ഈ ഐറ്റത്തെക്കുറിച്ച് വാട്ട്‌സ്ആപ്പിൽ ചോദിക്കുക","now":"ഇപ്പോൾ","was":"മുമ്പ്","youSave":"ലാഭം","wasPrice":"സാധാരണ വില (മുമ്പ്) വാറ്റ് ഉൾപ്പെടെ","validTillD":"{d} വരെ സാധുവാണ്","daysLeft":"{n} ദിവസം ബാക്കി","oneDay":"1 ദിവസം ബാക്കി","lastDay":"ഇന്ന് അവസാന ദിവസം","offerShort":"ഓഫർ","specialOffers":"സ്പെഷ്യൽ ഓഫറുകൾ","nOffers":"{n} ഓഫർ ഐറ്റങ്ങൾ","offerFolders":"ഓഫർ ഫോൾഡറുകൾ","allOffers":"എല്ലാ ഓഫറുകളും","hotOffers":"മികച്ച ഓഫറുകൾ","allShort":"എല്ലാം","sortBy":"ക്രമം","sortRec":"ശുപാർശ","sortLow":"വില: കുറഞ്ഞത് ആദ്യം","sortHigh":"വില: കൂടിയത് ആദ്യം","sortOffers":"ഓഫറുകൾ ആദ്യം","sortAz":"പേര് A–Z","noPriceLast":"വിലയില്ലാത്ത ഐറ്റങ്ങൾ അവസാനം കാണിക്കുന്നു","showMore":"{n} എണ്ണം കൂടി കാണിക്കുക","offersHint":"ഓഫർ വിലകളിൽ 5% വാറ്റ് ഉൾപ്പെടുന്നു; അവസാന സാധുവായ ദിവസത്തിന് ശേഷം (ഒമാൻ സമയം) സ്വയം അവസാനിക്കും.","inBasketN":"{n} എണ്ണം ഇതിനകം ബാസ്കറ്റിൽ","folder":"വിഭാഗം","grp":{"fridge":"ഫ്രിഡ്ജുകൾ","wash":"വാഷിംഗ് മെഷീനുകൾ","dish":"ഡിഷ്‌വാഷറുകൾ","micro":"മൈക്രോവേവുകൾ","vacuum":"വാക്വം ക്ലീനറുകൾ","tv":"ടിവികൾ","ac":"എസികൾ","audio":"ഓഡിയോ & പ്രൊജക്ടർ","builtin":"കാൻഡി ബിൽറ്റ്-ഇൻ","acc":"ആക്സസറികൾ","other":"മറ്റുള്ളവ"},"cf":{"thanks":"*നിങ്ങളുടെ ഓർഡറിന് നന്ദി!*","dear":"പ്രിയ","sent":"നിങ്ങളുടെ ഓർഡർ SARCO-യ്ക്ക് അയച്ചിരിക്കുന്നു. ഓർഡർ വിവരങ്ങൾ താഴെ:","ref":"ഓർഡർ നമ്പർ","date":"തീയതി (ഒമാൻ സമയം)","dealer":"ഡീലർ","loc":"ഷോപ്പിന്റെ ലൊക്കേഷൻ","items":"*ഐറ്റങ്ങൾ:*","qty":"എണ്ണം","withVat":"വാറ്റ് 5% ഉൾപ്പെടെ","tbcLine":"വില: SARCO സ്ഥിരീകരിക്കും","totalTbc":"*മൊത്തം തുക: SARCO സ്ഥിരീകരിക്കും*","sub":"ആകെ (വാറ്റ് ഇല്ലാതെ)","vat":"വാറ്റ് 5%","total":"*മൊത്തം തുക (വാറ്റ് ഉൾപ്പെടെ)*","del":"*ഡെലിവറി തീയതി*","sheet":"ഓർഡർ ഷീറ്റ് (PDF)","confirm":"സർഫറാസ് ഖാൻ ഉടൻ തന്നെ നിങ്ങളുടെ ഓർഡർ സ്ഥിരീകരിക്കും.","noPay":"ശ്രദ്ധിക്കുക: ആപ്പിലൂടെ പണമൊന്നും സ്വീകരിക്കുന്നില്ല. പണമടയ്ക്കൽ വ്യവസ്ഥകൾ SARCO നിങ്ങളുമായി സ്ഥിരീകരിക്കും."},"welcomeT":"സ്വാഗതം","welcomeMsg":"നിങ്ങളുടെ ബിസിനസിൽ ബറക്കത്തും, സന്തോഷവും ആരോഗ്യവും സമ്പൽസമൃദ്ധിയും നിറഞ്ഞ ജീവിതവും ഞാൻ ആശംസിക്കുന്നു.","welcomeSign":"സർഫറാസ് ഖാൻ","welcomeGo":"തുടങ്ങാം","tapSoundT":"വെള്ളത്തിന്റെ ശബ്ദങ്ങൾ – തുള്ളികളും തെറിക്കലും","onW":"ഓൺ","offW":"ഓഫ്","mktBest":"ഒമാനിലെ ഏറ്റവും കുറഞ്ഞ വില","mktBelow":"{s}-നേക്കാൾ {a} കുറവ്","mktTitle":"ഒമാൻ മാർക്കറ്റ് വില താരതമ്യം","mktNote":"ഒമാൻ സ്റ്റോറുകളിലെ വാറ്റ് ഉൾപ്പെടെയുള്ള ഷെൽഫ് വിലകൾ, {d}-ന് പരിശോധിച്ചത്. ഓഫർ നിലവിലുള്ളപ്പോൾ മാത്രം താരതമ്യം.","mktHidden":"ഡീലർമാരിൽ നിന്ന് മറച്ചു – {s}-ൽ വില കുറവ്","sortMkt":"മാർക്കറ്റിനേക്കാൾ ഏറ്റവും വലിയ ലാഭം","nBestOman":"{n} ഓഫറുകൾ ഒമാനിലെ ഏറ്റവും കുറഞ്ഞ വിലയിൽ"}};
let LANG = LS.get('lang', 'en'); if (!TX[LANG]) LANG = 'en';
const LANGS = [['en', '🇬🇧', 'English'], ['ar', '🇴🇲', 'العربية'], ['ml', '🇮🇳', 'മലയാളം']];
const t = (k, v) => { let s = (TX[LANG] && TX[LANG][k]); if (s == null) s = TX.en[k]; if (s == null) s = k; if (v && typeof s === 'string') for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
function applyLang() {
  document.documentElement.lang = LANG; document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  const f = { ar: 'Cairo:wght@500;700;800', ml: 'Noto+Sans+Malayalam:wght@500;700;800' }[LANG];
  if (f && !document.getElementById('font-' + LANG)) { const l = document.createElement('link'); l.id = 'font-' + LANG; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + f + '&display=swap'; document.head.appendChild(l); }
}
const money = b => { if (b == null || !isFinite(b)) return '—'; const s = fmtOMR(b, false); return LANG === 'ar' ? s + ' ' + t('cur') : 'OMR ' + s; };
const dateL = iso => { if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '—'; const [y, m, d] = iso.split('-'); return parseInt(d, 10) + ' ' + t('months')[parseInt(m, 10) - 1] + ' ' + y; };
const dateTimeL = ts => { if (!ts) return '—'; const p = muscatParts(new Date(ts)); return parseInt(p.day, 10) + ' ' + t('months')[parseInt(p.month, 10) - 1] + ' ' + p.year + ', ' + p.hour + ':' + p.minute; };
const isoUTC = iso => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const daysLeft = end => Math.round((isoUTC(end) - isoUTC(TODAY)) / 86400000);

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n0 = n => Number(n || 0).toLocaleString('en-US');
const waLink = text => 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
const waTo = (num, text) => 'https://wa.me/' + num + '?text=' + encodeURIComponent(text);
function normWa(v) {
  let d = String(v || '').replace(/[٠-٩]/g, x => String('٠١٢٣٤٥٦٧٨٩'.indexOf(x))).replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 8 && /^[79]/.test(d)) d = '968' + d;
  return d.length >= 10 && d.length <= 15 ? d : null;
}
const fmtWa = d => d && d.startsWith('968') && d.length === 11 ? '+968 ' + d.slice(3, 7) + ' ' + d.slice(7) : '+' + d;
function toast(msg, err) { const b = $('#toasts'); if (!b) return; const x = document.createElement('div'); x.className = 'toast' + (err ? ' err' : ''); x.textContent = msg; b.appendChild(x); setTimeout(() => x.remove(), err ? 4500 : 2200); }

/* ---------- icons ---------- */
const ICONS = {
  fridge: '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M6 9.5h12M9 5.5v2M9 12.5v3"/>',
  washer: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><circle cx="12" cy="13.5" r="4.5"/><path d="M4 6.5h16M7 4.5h.01"/>',
  dish: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M4 7h16M7 4.8h.01M10 4.8h4M8 12h8M8 15.5h8"/>',
  micro: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><rect x="5.5" y="8" width="10" height="8" rx="1"/><path d="M18.5 9v.01M18.5 12v.01M18.5 15v.01"/>',
  vacuum: '<path d="M5 20h8a3.5 3.5 0 0 0 0-7H9.5"/><path d="M9.5 13V3.5h3.5"/><circle cx="7" cy="19.5" r="1.5"/>',
  tv: '<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8 20h8M12 16.5V20"/>',
  ac: '<rect x="2.5" y="5" width="19" height="8" rx="2"/><path d="M6 10h12M7 16c0 1.5-1 2-1 3.5M12 16v3.5M17 16c0 1.5 1 2 1 3.5"/>',
  audio: '<rect x="2.5" y="9" width="19" height="6" rx="3"/><path d="M7 12h.01M12 12h.01M17 12h.01"/>',
  hob: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/>',
  box: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  bracket: '<rect x="4" y="3.5" width="16" height="11" rx="1.5"/><path d="M9 14.5v3h6v-3M7 20.5h10"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  basket: '<path d="M3 6h2l2.2 10.2a1 1 0 0 0 1 .8h9.4a1 1 0 0 0 1-.8L20.5 9H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
  home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>',
  tag: '<path d="M20.5 13.5 13.5 20.5a1.5 1.5 0 0 1-2.1 0L3 12V3h9l8.5 8.4a1.5 1.5 0 0 1 0 2.1z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  chat: '<path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4A8.4 8.4 0 1 1 20.5 11.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/>',
  call: '<path d="M5 3.5h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6.5 6.5l1.5-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  chev: '<path d="m9 6 6 6-6 6"/>', star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>', upload: '<path d="M12 20V8M7 13l5-5 5 5"/><path d="M4 4.5h16"/>'
};
const icon = (n, c) => '<svg class="i' + (c ? ' ' + c : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || ICONS.box) + '</svg>';

/* ---------- product folders (groups) ---------- */
const GROUPS = [['fridge', 'fridge'], ['wash', 'washer'], ['dish', 'dish'], ['micro', 'micro'], ['vacuum', 'vacuum'], ['tv', 'tv'], ['ac', 'ac'], ['audio', 'audio'], ['builtin', 'hob'], ['acc', 'bracket'], ['other', 'box']];
const GROUP_ICON = Object.fromEntries(GROUPS);
function groupOf(it) {
  const x = ((it.type || '') + ' ' + (it.name || '')).toUpperCase(), ty = (it.type || '').toUpperCase();
  if (it.cat === 'candy' || it.brand === 'CANDY') return 'builtin';
  if (/REFRIGERATOR|FRIDGE|FREEZER/.test(ty)) return 'fridge';
  if (/DISH/.test(ty)) return 'dish';
  if (/WASHING|DRYER/.test(ty)) return 'wash';
  if (/MICROWAVE/.test(ty)) return 'micro';
  if (/VACUUM/.test(ty)) return 'vacuum';
  if (it.cat === 'tv') return 'tv';
  if (it.cat === 'ac' || /AIR ?CONDITION|\bAC\b/.test(x)) return 'ac';
  if (it.cat === 'av') return 'audio';
  if (it.cat === 'acc') return 'acc';
  if (/REFRIGERATOR|FRIDGE/.test(x)) return 'fridge';
  return 'other';
}
const gName = g => (TX[LANG].grp || TX.en.grp)[g] || g;
function itemIcon(it) {
  const s = ((it.type || '') + ' ' + (it.name || '')).toUpperCase();
  if (/REFRIGERATOR|FRIDGE|FREEZER/.test(s)) return 'fridge'; if (/DISH/.test(s)) return 'dish'; if (/WASH|DRYER/.test(s)) return 'washer';
  if (/HOB|HOOD|CHIMNEY/.test(s)) return 'hob'; if (/MICROWAVE|OVEN/.test(s)) return 'micro'; if (/VACUUM/.test(s)) return 'vacuum';
  if (/BRACKET|MOUNT/.test(s)) return 'bracket';
  return GROUP_ICON[it.g] || 'box';
}

/* ---------- session & state ---------- */
let SESSION = LS.get('session', null);
let OWNER = !!(SESSION && SESSION.role === 'admin');
let DATA = null, STOCK = null, ITEMS = [], BY = new Map(), INDEX = [], DEALERS = [], BEST = new Set();
let TODAY = muscatToday(), OFFERS = new Map(), MARKET = {}, MKT_HIDE = new Map();
const S = {
  route: 'home', arg: '', q: '', sort: 'rec', instock: false, brand: 'all', onlyOffers: false, shown: PAGE,
  basket: [], profile: {}, note: '', modal: null, drawer: false,
  online: navigator.onLine, fresh: false, syncedAt: null, loading: true,
  lastOrder: null, sheetOrder: null, wantLogin: false, resetSent: null, lastUser: '', focusQ: false
};
const isGuest = () => !!(SESSION && SESSION.role === 'guest');
const me = () => SESSION && SESSION.role === 'dealer' ? DEALERS.find(d => d.code === SESSION.code) : null;
const basketKey = () => 'basket.' + (SESSION ? SESSION.code : 'x');
const saveBasket = () => LS.set(basketKey(), S.basket);
const profKey = () => 'profile.' + (SESSION ? SESSION.code : 'x');
function loadProfile() { S.profile = LS.get(profKey(), {}); const d = me(); if (d) S.profile.dealerCode = d.code; }
function loadBasket() { S.basket = SESSION ? LS.get(basketKey(), []) : []; }
loadProfile(); loadBasket();

/* ---------- stock words ---------- */
const tot = it => it.sohar + it.khazaan;
const band = n => n <= 0 ? 0 : n <= 4 ? 1 : n <= 9 ? 2 : n <= 14 ? 3 : n <= 19 ? 4 : 5;
const isOut = it => tot(it) <= 0;
const canOrder = it => tot(it) > 0;
const capOf = it => isGuest() ? (tot(it) > 0 ? 999 : 0) : tot(it);
const inBasketQty = code => S.basket.filter(l => l.code === code).reduce((a, l) => a + l.qty, 0);
const basketCount = () => S.basket.reduce((a, l) => a + l.qty, 0);
function stockBadge(it) { const b = band(tot(it)); return '<span class="sb b' + b + '"><i></i>' + esc(t('stockLabels')[b]) + (OWNER ? ' · ' + n0(tot(it)) : '') + '</span>'; }

/* ---------- prices & offers ---------- */
/* Was/Now: NOW = offer price, WAS = normal price (RRP) published with the offer. Both shown incl. 5% VAT. */
function offerInfo(it) {
  const o = OFFERS.get(it.code); if (!o) return null;
  const nowEx = o.priceEx;
  const wasEx = (o.wasEx > nowEx ? o.wasEx : 0) || (it.rrp > nowEx ? it.rrp : 0);
  const nowInc = nowEx + vatOf(nowEx), wasInc = wasEx ? wasEx + vatOf(wasEx) : 0;
  const pct = wasEx ? (wasEx - nowEx) / wasEx * 100 : 0;
  return { o, nowEx, nowInc, wasEx, wasInc, save: wasInc ? wasInc - nowInc : 0, pct, end: o.end, left: daysLeft(o.end) };
}
/* market comparison – only for items with a RUNNING offer; shelf prices incl. VAT */
const mktList = m => Object.keys(m).filter(k => k[0] !== '_' && m[k] > 0).map(k => [k, m[k]]).sort((a, b) => a[1] - b[1]);
function mktInfo(it) {
  const f = offerInfo(it); if (!f) return null; const m = MARKET[it.code]; if (!m) return null; const list = mktList(m); if (!list.length) return null;
  const low = list[0]; return { list, low, ours: f.nowInc, below: low[1] - f.nowInc, date: m._date || (DATA.market && DATA.market.date) || null, hidden: MKT_HIDE.get(it.code) || null };
}
const STORE_CLASS = { 'Lulu': 'st-lulu', 'Nesto': 'st-nesto', 'Sharaf DG': 'st-sharaf', 'Extra': 'st-extra', 'Hypermax': 'st-hyper', 'Carrefour': 'st-carre' };
function mktBadge(it) {
  const k = mktInfo(it); if (!k) return '';
  if (k.hidden) return OWNER ? '<div class="mkt warn">⚠️ ' + t('mktHidden', { s: esc(k.low[0]) }) + '</div>' : '';
  return '<div class="mkt">🏆 <b>' + t('mktBest') + '</b><span>' + t('mktBelow', { a: money(k.below), s: esc(k.low[0]) }) + '</span></div>';
}
function mktTable(it) {
  const k = mktInfo(it); if (!k) return '';
  const max = Math.max(k.ours, ...k.list.map(x => x[1]));
  const bar = (label, v, cls, diff) => '<div class="mrow ' + cls + '"><span class="mname">' + label + '</span><span class="mbar"><i style="width:' + Math.max(8, Math.round(v / max * 100)) + '%"></i></span><b dir="ltr">' + fmtOMR(v, false) + '</b>' + (diff != null ? '<small dir="ltr">' + (diff >= 0 ? '+' : '−') + fmtOMR(Math.abs(diff), false) + '</small>' : '<small></small>') + '</div>';
  return '<div class="mcomp' + (k.hidden ? ' bad' : '') + '"><h3>🏪 ' + t('mktTitle') + '</h3>' + (k.hidden ? '' : '<p class="mwin">🏆 ' + t('mktBest') + ' · ' + t('mktBelow', { a: money(k.below), s: esc(k.low[0]) }) + '</p>') +
    bar('SARCO', k.ours, 'ours', null) + k.list.map(([n, v]) => bar('<i class="st ' + (STORE_CLASS[n] || '') + '">' + esc(n) + '</i>', v, '', v - k.ours)).join('') +
    '<p class="small muted">' + t('mktNote', { d: k.date ? dateL(k.date) : '—' }) + '</p></div>';
}
const showPrice = it => OWNER ? (it.rrp > 0 || OFFERS.has(it.code)) : OFFERS.has(it.code);
const lineShown = l => OWNER ? l.unitEx > 0 : !!l.offerId;
/* number used for "sort by price" (incl. VAT); null = no price shown to this user */
function sortPrice(it) { const f = offerInfo(it); if (f) return f.nowInc; if (OWNER && it.rrp > 0) return it.rrp + vatOf(it.rrp); return null; }
function leftText(n) { return n <= 0 ? t('lastDay') : n === 1 ? t('oneDay') : t('daysLeft', { n }); }
function priceHtml(it, big) {
  const f = offerInfo(it);
  if (f) {
    return '<div class="pr off' + (big ? ' big' : '') + '">' +
      '<div class="pr-now"><span class="lbl">' + t('now') + '</span><b>' + money(f.nowInc) + '</b>' + (f.pct >= 1 ? '<em class="save">−' + Math.round(f.pct) + '%</em>' : '') + '</div>' +
      (f.wasInc ? '<div class="pr-was"><span class="lbl">' + t('was') + '</span><s>' + money(f.wasInc) + '</s>' + (big && f.save > 0 ? '<span class="saveamt">' + t('youSave') + ' ' + money(f.save) + '</span>' : '') + '</div>' : '') +
      '<div class="pr-till' + (f.left <= 2 ? ' soon' : '') + '">' + icon('clock') + '<span>' + t('validTillD', { d: dateL(f.end) }) + ' · ' + leftText(f.left) + '</span></div>' +
      '<div class="pr-vat">' + t('inclVat') + '</div></div>';
  }
  if (OWNER) return it.rrp > 0 ? '<div class="pr"><div class="pr-now"><b>' + money(it.rrp + vatOf(it.rrp)) + '</b></div><div class="pr-vat">' + t('inclVat') + '</div></div>' : '<div class="pr"><span class="ask">' + t('priceReq') + '</span></div>';
  return '<div class="pr"><span class="ask">' + icon('chat') + t('askPrice') + '</span></div>';
}

/* ---------- data ---------- */
function applyData(j) {
  DATA = j || {}; STOCK = DATA.stock || null;
  ITEMS = STOCK ? STOCK.items.filter(i => !HIDDEN_CATS.includes(i.cat)).map(i => Object.assign({}, i)) : [];
  if (OWNER) { const pm = LS.get('adm.prices', null); if (pm) ITEMS.forEach(i => { if (pm[i.code]) i.rrp = pm[i.code]; }); }
  ITEMS.forEach((it, k) => { it.g = groupOf(it); it.k = k; });
  BY = new Map(ITEMS.map(i => [i.code, i])); INDEX = buildSearchIndex(ITEMS);
  DEALERS = (DATA.dealers || []).slice().sort((a, b) => a.name.localeCompare(b.name));
  BEST = new Set((DATA.bestsellers || []).filter(c => BY.has(c)));
  TODAY = muscatToday(); OFFERS = activeOfferMap(DATA.offers || [], BY, TODAY);
  MARKET = (DATA.market && DATA.market.prices) || {}; MKT_HIDE = new Map();
  OFFERS.forEach((o, code) => { const m = MARKET[code]; if (!m) return; const ours = o.priceEx + vatOf(o.priceEx); const low = mktList(m)[0]; if (low && low[1] < ours) { MKT_HIDE.set(code, low); if (!OWNER) OFFERS.delete(code); } });
  /* dealer removed from the list (or broken saved login) -> back to the sign-in page */
  if (SESSION && SESSION.role === 'dealer' && DEALERS.length && !DEALERS.some(d => d.code === SESSION.code)) { SESSION = null; OWNER = false; LS.set('session', null); S.wantLogin = true; S.basket = []; }
  if (SESSION && !['guest', 'dealer', 'admin'].includes(SESSION.role)) { SESSION = null; OWNER = false; LS.set('session', null); }
  const before = S.basket.length; S.basket = S.basket.filter(l => { const it = BY.get(l.code); return !it || canOrder(it); }); if (S.basket.length !== before) saveBasket();
  checkOfferAlerts();
}
let loadingNow = false;
async function loadData(first) {
  if (loadingNow) return; loadingNow = true;
  try {
    const r = await fetch('stock.json?t=' + Math.floor(Date.now() / 30000), { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    const changed = !DATA || !STOCK || !j.stock || j.stock.version !== STOCK.version || JSON.stringify([j.offers, j.dealers, j.bestsellers, j.passwords]) !== JSON.stringify([DATA.offers, DATA.dealers, DATA.bestsellers, DATA.passwords]);
    S.fresh = true; S.syncedAt = Date.now(); LS.set('data', j); LS.set('syncedAt', S.syncedAt);
    if (changed) { const prev = STOCK && STOCK.version; applyData(j); if (!first && prev && prev !== STOCK.version) toast(t('newStock') + ' · ' + dateTimeL(STOCK.publishedAt)); softRender(); }
  } catch (e) { S.fresh = false; }
  finally { loadingNow = false; if (S.loading) { S.loading = false; softRender(); } if (S.welcomePending) { S.welcomePending = false; showWelcome(false); } }
}
/* re-render without losing what the user is typing or the scroll position */
function softRender() { if (document.activeElement && document.activeElement.matches('input,select,textarea') && !document.activeElement.closest('#results')) { if (S.route === 'products' || S.route === 'offers') renderResults(); return; } const y = window.scrollY; render(); window.scrollTo(0, y); }

/* ---------- search ---------- */
const AR_SYN = [[/غسال[ةه] صحون|غسالة الصحون|جلاي[ةه]/g, 'dishwasher'], [/ثلاج[ةه]|برّاد|براد|فريزر/g, 'fridge'], [/غسال[ةه]|نشاف[ةه]/g, 'washing'], [/تلفزيون|تلفاز|شاش[ةه]/g, 'tv'], [/مكيّف|مكيف|تكييف/g, 'ac'], [/ميكروويف|مايكروويف/g, 'microwave'], [/فرن/g, 'oven'], [/موقد|طباخ[ةه]?/g, 'hob'], [/مكنس[ةه]/g, 'vacuum'], [/سماع[ةه]|ساوند ?بار/g, 'soundbar'], [/كاندي/g, 'candy'], [/سامسونج|سامسونغ/g, 'samsung'], [/بوص[ةه]|إنش|انش/g, 'inch'], [/طن/g, 'ton'],
  [/ഡിഷ് ?വാഷർ|ഡിഷ്‌വാഷർ/g, 'dishwasher'], [/ഫ്രിഡ്ജ്|ഫ്രിജ്|റഫ്രിജറേറ്റർ|ഫ്രീസർ/g, 'fridge'], [/വാഷിംഗ് ?മെഷീൻ|വാഷിങ് ?മെഷീൻ|വാഷർ/g, 'washing'], [/ടിവി|ടി\.വി|ടെലിവിഷൻ/g, 'tv'], [/എസി|എ\.സി|എയർ ?കണ്ടീഷണർ/g, 'ac'], [/മൈക്രോവേവ്|മൈക്രോ ?വേവ്/g, 'microwave'], [/ഓവൻ/g, 'oven'], [/വാക്വം|വാക്വം ക്ലീനർ/g, 'vacuum'], [/സൗണ്ട് ?ബാർ|സ്പീക്കർ/g, 'soundbar'], [/സാംസങ്/g, 'samsung'], [/കാൻഡി/g, 'candy'], [/ഇഞ്ച്/g, 'inch'], [/ടൺ/g, 'ton']];
const PHRASES = [[/\bdish\s*wash(er|ing)?s?\b/g, 'dishwasher'], [/\bmicro\s*wave?s?\b/g, 'microwave'], [/\bsound\s*bars?\b/g, 'soundbar'], [/\bair\s*con\w*/g, 'ac'], [/\bwashing\s*m\w*/g, 'washing'], [/\bwash\s*m\w*/g, 'washing'], [/\bfront\s*load\w*/g, 'front load'], [/\btop\s*load\w*/g, 'top load'], [/\bwasher\s*dryer\b/g, 'washer dryer'], [/\bvac+u+m+\s*clean\w*/g, 'vacuum'], [/\bfrid?ge?\s*freez\w*/g, 'refrigerator'], [/\bgas\s*cook\w*/g, 'cooker'], [/\bcook\w*\s*hood\b/g, 'hood'], [/\bchimn\w*/g, 'hood'], [/\btelevision\b|\btelly\b/g, 'tv'], [/\bsmart\s*tv\b/g, 'tv'], [/\bwindow\s*ac\b/g, 'window'], [/\bsplit\s*ac\b/g, 'split ac'], [/\b(frij|fridj|freej|frig|fridje|frige|frizer|freezr)\b/g, 'refrigerator'], [/\bcooking\s*range\b|\bgas\s*range\b|\bcooker\b|\bcookers\b/g, 'oven'], [/\bstoves?\b/g, 'hob'], [/\bvac\b/g, 'vacuum'], [/\bfreestanding\b/g, 'free standing']];
function normQuery(q) {
  let s = String(q || '').toLowerCase();
  AR_SYN.forEach(([re, en]) => { s = s.replace(re, ' ' + en + ' '); });
  s = s.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  s = s.replace(/["”″]/g, ' inch ').replace(/[,;|]+/g, ' ');
  PHRASES.forEach(([re, rep]) => { s = s.replace(re, ' ' + rep + ' '); });
  s = s.replace(/(\d)\s*(kg|kgs|ltr|lt|l|litre|liter|litres|liters|ton|tons|t|inch|in|cm)\b/g, '$1 $2');
  return s.replace(/\s+/g, ' ').trim();
}
function smartFind(q) {
  const nq = normQuery(q); const r = searchSmart(INDEX, ITEMS, nq);
  if (r.idx.length || !nq) return r;
  const c = codeNorm(q); if (c.length < 3) return r;
  const hits = INDEX.filter(e => e.ncode.includes(c) || codeNorm(e.name).includes(c)).map(e => e.i);
  return hits.length ? { idx: hits.slice(0, 60), mode: 'closest', corrected: null } : r;
}

/* ---------- list: filter + sort ---------- */
function listIdx() {
  const offersPage = S.route === 'offers', g = S.arg || 'all', searching = !!S.q.trim();
  const sm = searching ? smartFind(S.q) : { idx: ITEMS.map((_, i) => i), mode: 'all' };
  let idx = sm.idx.filter(i => {
    const it = ITEMS[i];
    if (g !== 'all' && it.g !== g) return false;
    if ((offersPage || S.onlyOffers) && !OFFERS.has(it.code)) return false;
    if (S.instock && isOut(it)) return false;
    if (S.brand !== 'all' && it.brand !== S.brand) return false;
    return true;
  });
  const rank = new Map(idx.map((i, n) => [i, n]));            /* search relevance order */
  const base = (a, b) => (isOut(ITEMS[a]) - isOut(ITEMS[b])) || (searching ? rank.get(a) - rank.get(b) : (OFFERS.has(ITEMS[b].code) - OFFERS.has(ITEMS[a].code)) || (BEST.has(ITEMS[b].code) - BEST.has(ITEMS[a].code)) || a - b);
  const byPrice = dir => (a, b) => { const pa = sortPrice(ITEMS[a]), pb = sortPrice(ITEMS[b]); if (pa == null && pb == null) return base(a, b); if (pa == null) return 1; if (pb == null) return -1; return dir * (pa - pb) || base(a, b); };
  const sorters = {
    rec: base, low: byPrice(1), high: byPrice(-1),
    offers: (a, b) => { const fa = offerInfo(ITEMS[a]), fb = offerInfo(ITEMS[b]); if (!!fb - !!fa) return !!fb - !!fa; if (fa && fb) return (fb.pct - fa.pct) || fa.end.localeCompare(fb.end) || base(a, b); return base(a, b); },
    mkt: (a, b) => { const ka = mktInfo(ITEMS[a]), kb = mktInfo(ITEMS[b]); const va = ka && !ka.hidden ? ka.below : -1e12, vb = kb && !kb.hidden ? kb.below : -1e12; return (vb - va) || base(a, b); },
    az: (a, b) => ITEMS[a].name.localeCompare(ITEMS[b].name)
  };
  idx.sort(sorters[S.sort] || base);
  return { idx, sm };
}

/* ---------- product card ---------- */
function card(it) {
  const q = inBasketQty(it.code), f = offerInfo(it);
  const add = !canOrder(it) ? '<a class="c-ask" href="' + itemWaLink(it) + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('askWaShort') + '</span></a>'
    : q ? '<div class="qs"><button data-act="dec" data-code="' + esc(it.code) + '" aria-label="−1">−</button><b>' + q + '</b><button data-act="inc" data-code="' + esc(it.code) + '" aria-label="+1">+</button></div>'
      : '<button class="c-add" data-act="inc" data-code="' + esc(it.code) + '">' + icon('basket') + '<span>' + t('add') + '</span></button>';
  return '<article class="card' + (isOut(it) ? ' out' : '') + (f ? ' hasoff' : '') + (q ? ' inb' : '') + '">' +
    '<button class="c-main" data-act="item" data-code="' + esc(it.code) + '">' +
    '<span class="c-ico" data-g="' + it.g + '">' + icon(itemIcon(it)) + (f ? '<i class="c-pct">' + t('offerShort') + '</i>' : '') + '</span>' +
    '<span class="c-body"><span class="c-name">' + esc(it.name) + '</span><span class="c-code" dir="ltr">' + esc(it.code) + '</span>' +
    '<span class="c-row">' + stockBadge(it) + (it.brand ? '<span class="brandchip b-' + esc(it.brand.toLowerCase().replace(/[^a-z]/g, '')) + '">' + esc(it.brand) + '</span>' : '') + (BEST.has(it.code) ? '<span class="best">' + icon('star') + '</span>' : '') + '</span>' +
    (OWNER ? '<span class="c-wh">' + t('sohar') + ': <b>' + n0(it.sohar) + '</b> · ' + t('khazaan') + ': <b>' + n0(it.khazaan) + '</b></span>' : '') + '</span></button>' +
    mktBadge(it) + '<div class="c-foot">' + priceHtml(it) + '<div class="c-act">' + add + '</div></div></article>';
}
function itemWaLink(it) { const d = me(); return waLink('Hello Mr. Sarfaraaz,\n\nI would like to ask about:\n' + it.code + ' – ' + it.name + (d ? '\n\nDealer: ' + d.name + ' (' + d.code + ')' : '') + '\n\nThank you.'); }

/* ---------- basket ---------- */
function addToBasket(code, qty) {
  const it = BY.get(code); if (!it || !canOrder(it)) return false;
  const p = priceOf(it, OFFERS); const ex = S.basket.find(l => l.code === code);
  const add = Math.min(qty, capOf(it) - (ex ? ex.qty : 0));
  if (add <= 0) { toast(t('maxReached'), true); return false; }
  if (ex) { ex.qty += add; ex.wh = 'ALL'; ex.priceAtAdd = p.unitEx; ex.offerAtAdd = p.offer ? p.offer.id : null; }
  else S.basket.push({ code, wh: 'ALL', qty: add, priceAtAdd: p.unitEx, offerAtAdd: p.offer ? p.offer.id : null });
  saveBasket(); return true;
}
function setQty(i, q) {
  const l = S.basket[i]; const it = l && BY.get(l.code); if (!it) return;
  q = Math.floor(Number(q)); if (!isFinite(q) || q < 1) q = 1;
  if (q > capOf(it)) { q = capOf(it); toast(t('maxReached'), true); }
  l.qty = Math.max(1, q); l.wh = 'ALL'; saveBasket();
}
const withTbc = c => Object.assign(c, { tbc: c.tbc != null ? c.tbc : (c.lines || []).some(l => l.qty > 0 && !lineShown(l)) });
function totalsHtml(c) {
  withTbc(c);
  const head = '<div class="tr"><span>' + t('items') + '</span><b>' + c.items + ' · ' + c.qty + ' ' + t('units') + '</b></div>';
  if (c.tbc) return '<div class="totals">' + head + '<div class="tr g"><span>' + t('grand') + '</span><span class="tbc">' + t('tbc') + '</span></div><p class="small muted">' + t('pricesTbc') + '</p></div>';
  return '<div class="totals">' + head + '<div class="tr"><span>' + t('subtotal') + '</span><b>' + money(c.subtotal) + '</b></div><div class="tr"><span>' + t('vatAmt') + '</span><b>' + money(c.vat) + '</b></div><div class="tr g"><span>' + t('grand') + '</span><span>' + money(c.grand) + '</span></div></div>';
}

/* ====================================================================
   VIEWS
   ==================================================================== */
function offerFolders() {
  const m = {}; ITEMS.forEach(it => { if (OFFERS.has(it.code)) m[it.g] = (m[it.g] || 0) + 1; });
  return GROUPS.map(g => g[0]).filter(g => m[g]).map(g => [g, m[g]]);
}
function offerEndRange() { const ends = [...OFFERS.values()].filter(o => BY.has(o.code)).map(o => o.end).sort(); return ends.length ? ends[ends.length - 1] : null; }
function contactRow() {
  return '<div class="helpbar"><img src="sarfaraaz.jpg" alt="" width="44" height="44" loading="lazy"><div class="hb-t"><b>' + t('needHelp') + '</b><span dir="ltr">' + WA_DISPLAY + '</span></div>' +
    '<a class="rb call" href="tel:' + PHONE + '" aria-label="' + esc(t('call')) + '">' + icon('call') + '</a>' +
    '<a class="rb wa" href="' + waLink('Hello Mr. Sarfaraaz, I need help with an order.') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon('chat') + '</a>' +
    '<a class="rb mail" href="mailto:' + EMAIL + '" aria-label="' + esc(t('email')) + '">' + icon('mail') + '</a></div>';
}
function homeView() {
  const d = me(); const cnt = {}; ITEMS.forEach(i => { cnt[i.g] = (cnt[i.g] || 0) + 1; });
  const offs = ITEMS.filter(i => OFFERS.has(i.code)); const folders = offerFolders(); const lastEnd = offerEndRange();
  let h = '<section class="hero"><div class="wrap"><div class="hello"><img class="av" src="sarfaraaz.jpg" alt="Sarfaraaz Khan" width="52" height="52"><div><h1>' + (isGuest() ? t('guestHi') : t('hi', { n: esc(OWNER ? 'Sarfaraaz' : d ? d.name : '') })) + '</h1><p>' + t('whatToday') + '</p></div></div>' +
    '<button class="fakesearch" data-act="go-search">' + icon('search') + '<span>' + t('searchPh') + '</span></button>' +
    '<p class="stamp">' + icon('clock') + t('stockUpdated') + ': <b>' + (STOCK ? dateTimeL(STOCK.publishedAt) : '—') + '</b></p></div></section><div class="wrap">';
  if (!STOCK && !S.loading) h += '<div class="note warn">' + t('noStock') + '</div>';
  if (OWNER) { const miss = DEALERS.filter(x => !signFor(x.code)); if (miss.length) h += '<div class="note warn"><b>✍️ ' + t('missingSign', { n: miss.length }) + '</b></div>'; }
  if (offs.length) {
    const nBest = offs.filter(i => { const k = mktInfo(i); return k && !k.hidden; }).length;
    h += '<button class="offbanner" data-nav="offers"><span class="ob-tag">' + icon('tag') + '</span><span class="ob-t"><b>' + t('specialOffers') + '</b><span>' + t('nOffers', { n: offs.length }) + (lastEnd ? ' · ' + t('validTillD', { d: dateL(lastEnd) }) : '') + '</span>' + (nBest ? '<span class="ob-best">🏆 ' + t('nBestOman', { n: nBest }) + '</span>' : '') + '</span>' + icon('chev', 'flip') + '</button>';
    h += '<section class="sec"><div class="sh"><h2>' + t('offerFolders') + '</h2></div><div class="folders">' +
      '<button class="folder all" data-nav="offers"><span class="f-ico">' + icon('tag') + '</span><b>' + t('allOffers') + '</b><small>' + offs.length + '</small></button>' +
      folders.map(([g, n]) => '<button class="folder" data-nav="offers-' + g + '"><span class="f-ico" data-g="' + g + '">' + icon(GROUP_ICON[g]) + '</span><b>' + esc(gName(g)) + '</b><small>' + n + '</small></button>').join('') + '</div></section>';
    const hot = offs.slice().sort((a, b) => (offerInfo(b).pct - offerInfo(a).pct) || (tot(b) - tot(a))).filter(i => !isOut(i)).slice(0, 10);
    if (hot.length) h += '<section class="sec"><div class="sh"><h2>' + t('hotOffers') + '</h2><button class="lnk" data-nav="offers">' + t('seeAll') + ' (' + offs.length + ')</button></div><div class="rail">' + hot.map(card).join('') + '</div></section>';
  }
  h += '<section class="sec"><div class="sh"><h2>' + t('categories') + '</h2><button class="lnk" data-nav="products">' + t('seeAll') + ' (' + ITEMS.length + ')</button></div><div class="tiles">' +
    GROUPS.filter(([g]) => cnt[g]).map(([g, ic]) => '<button class="tile" data-nav="products-' + g + '"><span class="t-ico" data-g="' + g + '">' + icon(ic) + '</span><b>' + esc(gName(g)) + '</b><small>' + t('nProducts', { n: cnt[g] }) + '</small></button>').join('') +
    '<button class="tile alltile" data-nav="products"><span class="t-ico">' + icon('grid') + '</span><b>' + t('allProducts') + '</b><small>' + t('nProducts', { n: ITEMS.length }) + '</small></button></div></section>';
  const best = ITEMS.filter(i => BEST.has(i.code));
  if (best.length) h += '<section class="sec"><div class="sh"><h2>' + t('bestsellers') + '</h2></div><div class="rail">' + best.slice(0, 10).map(card).join('') + '</div></section>';
  return h + '<section class="sec">' + contactRow() + '<p class="shortnote">' + t('shortNotice') + '</p></section><p class="foot">' + t('footer') + '</p></div>';
}

function listView() {
  const offersPage = S.route === 'offers', g = S.arg || 'all';
  const title = offersPage ? (g === 'all' ? t('specialOffers') : t('offers') + ' · ' + gName(g)) : (g === 'all' ? t('allProducts') : gName(g));
  const brands = [...new Set(ITEMS.map(i => i.brand).filter(Boolean))].sort();
  let chips;
  if (offersPage) chips = '<button class="chip' + (g === 'all' ? ' on' : '') + '" data-nav="offers">' + icon('tag') + t('allOffers') + ' <small>' + OFFERS.size + '</small></button>' +
    offerFolders().map(([x, n]) => '<button class="chip' + (g === x ? ' on' : '') + '" data-nav="offers-' + x + '">' + icon(GROUP_ICON[x]) + esc(gName(x)) + ' <small>' + n + '</small></button>').join('');
  else {
    const cnt = {}; ITEMS.forEach(i => { cnt[i.g] = (cnt[i.g] || 0) + 1; });
    chips = '<button class="chip' + (g === 'all' ? ' on' : '') + '" data-nav="products">' + icon('grid') + t('allShort') + '</button>' +
      (OFFERS.size ? '<button class="chip offchip" data-nav="offers">' + icon('tag') + t('offers') + ' <small>' + OFFERS.size + '</small></button>' : '') +
      GROUPS.filter(([x]) => cnt[x]).map(([x, ic]) => '<button class="chip' + (g === x ? ' on' : '') + '" data-nav="products-' + x + '">' + icon(ic) + esc(gName(x)) + ' <small>' + cnt[x] + '</small></button>').join('');
  }
  const sortOpts = [['rec', t('sortRec')], ['low', t('sortLow')], ['high', t('sortHigh')], ['offers', t('sortOffers')]].concat(Object.keys(MARKET).length ? [['mkt', t('sortMkt')]] : []).concat([['az', t('sortAz')]]);
  return '<div class="wrap"><div class="ph"><h1>' + esc(title) + '</h1></div>' +
    (offersPage && OFFERS.size ? '<p class="offhint">' + icon('tag') + t('offersHint') + '</p>' : '') +
    '<div class="sbox">' + icon('search') + '<input id="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="' + esc(t('searchPh')) + '" value="' + esc(S.q) + '">' + (S.q ? '<button class="sx" data-act="clear-q" aria-label="' + esc(t('clear')) + '">' + icon('x') + '</button>' : '') + '</div>' +
    '<div class="chips" id="chips">' + chips + '</div>' +
    '<div class="tools"><label class="sortsel">' + icon('menu') + '<select data-input="sort" aria-label="' + esc(t('sortBy')) + '">' + sortOpts.map(([v, l]) => '<option value="' + v + '"' + (S.sort === v ? ' selected' : '') + '>' + esc(t('sortBy')) + ': ' + esc(l) + '</option>').join('') + '</select></label>' +
    '<button class="tg' + (S.instock ? ' on' : '') + '" data-act="tog" data-v="instock">' + (S.instock ? icon('check') : '') + t('inStockOnly') + '</button>' +
    (offersPage ? '' : '<button class="tg' + (S.onlyOffers ? ' on' : '') + '" data-act="tog" data-v="onlyOffers">' + (S.onlyOffers ? icon('check') : '') + t('activeOffers') + '</button>') +
    (brands.length > 1 ? '<select class="tg sel" data-input="brand" aria-label="' + esc(t('brand')) + '"><option value="all">' + t('allBrands') + '</option>' + brands.map(b => '<option value="' + esc(b) + '"' + (S.brand === b ? ' selected' : '') + '>' + esc(((TX[LANG].brands || {})[b]) || b) + '</option>').join('') + '</select>' : '') +
    '</div><div id="results"></div></div>';
}
let moreObs = null;
function renderResults() {
  const box = $('#results'); if (!box) return;
  const { idx, sm } = listIdx();
  const note = sm.mode === 'corrected' ? '<div class="dym">✓ ' + t('showingFor') + ' <b dir="ltr">' + esc(sm.corrected) + '</b></div>' : sm.mode === 'closest' ? '<div class="dym">' + t('closest', { q: esc(S.q) }) + '</div>' : '';
  if (!idx.length) {
    const what = S.q || (S.route === 'offers' ? t('offers') : gName(S.arg || 'all'));
    box.innerHTML = note + '<div class="empty"><b>' + (S.route === 'offers' && !S.q ? t('noOffers') : t('notFound', { q: esc(what) })) + '</b><p>' + t('notFoundSub') + '</p><button class="btn" data-act="reset-f">' + t('clear') + '</button> <a class="btn wa" href="' + waLink('Hello Mr. Sarfaraaz, I am looking for: ' + what) + '" target="_blank" rel="noopener">' + icon('chat') + t('askWaShort') + '</a></div>';
    return;
  }
  const noPrice = (S.sort === 'low' || S.sort === 'high') && idx.some(i => sortPrice(ITEMS[i]) == null);
  box.innerHTML = note + '<p class="count">' + t(idx.length === 1 ? 'nProduct' : 'nProducts', { n: idx.length }) + (noPrice ? ' · <span class="muted">' + t('noPriceLast') + '</span>' : '') + '</p>' +
    '<div class="grid">' + idx.slice(0, S.shown).map(i => card(ITEMS[i])).join('') + '</div>' +
    (idx.length > S.shown ? '<div class="more"><button class="btn" id="morebtn" data-act="more">' + t('showMore', { n: idx.length - S.shown }) + '</button></div>' : '');
  const mb = $('#morebtn');
  if (moreObs) moreObs.disconnect();
  if (mb && 'IntersectionObserver' in window) { moreObs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { moreObs.disconnect(); S.shown += PAGE; renderResults(); } }, { rootMargin: '600px' }); moreObs.observe(mb); }
}

function itemModal() {
  const it = BY.get(S.modal.code);
  if (!it) return '<div class="empty"><b>' + t('noMore') + '</b></div>';
  const f = offerInfo(it), inB = inBasketQty(it.code), max = Math.max(0, capOf(it) - inB);
  const qty = Math.min(Math.max(1, S.modal.qty || 1), Math.max(1, max));
  let h = '<div class="m-head"><span class="c-ico lg" data-g="' + it.g + '">' + icon(itemIcon(it)) + '</span><div><span class="m-brand">' + esc(it.brand || '') + (it.type ? ' · ' + esc(it.type) : '') + '</span><h2>' + esc(it.name) + '</h2><span class="c-code" dir="ltr">' + esc(it.code) + '</span></div></div>' +
    '<div class="m-stock"><span>' + t('availability') + '</span>' + stockBadge(it) + '</div>';
  if (OWNER) h += '<div class="m-wh"><div><small>' + t('totalStock') + '</small><b>' + n0(tot(it)) + '</b></div><div><small>' + t('sohar') + '</small><b>' + n0(it.sohar) + '</b></div><div><small>' + t('khazaan') + '</small><b>' + n0(it.khazaan) + '</b></div></div>';
  if (showPrice(it)) {
    h += '<div class="m-price">' + priceHtml(it, true) + '</div>' + mktTable(it);
    const rows = [];
    if (f) { rows.push([t('offerPriceEx'), money(f.nowEx)], [t('vat5'), money(vatOf(f.nowEx))], [t('offerPrice'), money(f.nowInc)]); if (f.wasInc) rows.push([t('wasPrice'), money(f.wasInc)], [t('discount'), f.pct.toFixed(1) + '%']); rows.push([t('validTill'), dateL(f.end)]); }
    else if (OWNER && it.rrp > 0) rows.push([t('priceEx'), money(it.rrp)], [t('vat5'), money(vatOf(it.rrp))], [t('priceInc'), money(it.rrp + vatOf(it.rrp))]);
    h += '<table class="ptab">' + rows.map(r => '<tr><td>' + r[0] + '</td><td dir="ltr">' + r[1] + '</td></tr>').join('') + '</table>';
  } else h += '<div class="askbox"><img src="sarfaraaz.jpg" alt="" width="44" height="44"><div><b>' + t('askPrice') + '</b><p>' + t('askPriceNote') + '</p></div></div>';
  if (canOrder(it)) h += '<div class="m-act"><div class="step"><button data-act="m-dec" aria-label="−1">−</button><input id="mqty" inputmode="numeric" value="' + (max > 0 ? qty : 0) + '" data-input="m-qty"><button data-act="m-inc" aria-label="+1">+</button></div><button class="btn pri grow" data-act="m-add"' + (max <= 0 ? ' disabled' : '') + '>' + icon('basket') + '<span>' + (max <= 0 ? t('maxReached') : t('addBasket')) + '</span></button></div>' + (inB ? '<p class="small muted center">' + t('inBasketN', { n: inB }) + '</p>' : '');
  else h += '<div class="note warn">' + t('contactAvail') + '</div>';
  h += '<a class="btn wa block" href="' + itemWaLink(it) + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('askWaItem') + '</span></a>';
  h += '<table class="ptab det"><tr><td>' + t('itemCode') + '</td><td dir="ltr">' + esc(it.code) + '</td></tr><tr><td>' + t('brand') + '</td><td>' + esc(it.brand || '—') + '</td></tr><tr><td>' + t('type') + '</td><td>' + esc(it.type || '—') + '</td></tr><tr><td>' + t('folder') + '</td><td>' + esc(gName(it.g)) + '</td></tr></table>';
  return h;
}

function basketView() {
  if (!S.basket.length) return '<div class="wrap"><div class="ph"><h1>' + t('myBasket') + '</h1></div><div class="empty"><span class="big-ico">' + icon('basket') + '</span><b>' + t('basketEmpty') + '</b><p>' + t('basketEmptySub') + '</p><button class="btn pri" data-nav="products">' + t('browse') + '</button>' + (OFFERS.size ? ' <button class="btn" data-nav="offers">' + t('specialOffers') + '</button>' : '') + '</div></div>';
  const c = computeOrder(S.basket, BY, OFFERS);
  let h = '<div class="wrap"><div class="ph"><h1>' + t('myBasket') + '</h1><span class="muted">' + t(basketCount() === 1 ? 'itemN' : 'itemsN', { n: basketCount() }) + '</span></div><div class="two"><div class="panel lines">';
  c.lines.forEach((l, i) => {
    const it = l.item;
    if (!it) { h += '<div class="bl"><span class="c-ico">' + icon('box') + '</span><div class="bl-m"><b dir="ltr">' + esc(l.code) + '</b><span class="small muted">' + t('noMore') + '</span></div><button class="ib danger" data-act="b-rm" data-i="' + i + '" aria-label="' + esc(t('remove')) + '">' + icon('trash') + '</button></div>'; return; }
    const f = offerInfo(it);
    h += '<div class="bl"><span class="c-ico">' + icon(itemIcon(it)) + '</span><div class="bl-m"><b class="bl-n">' + esc(it.name) + '</b><span class="c-code" dir="ltr">' + esc(it.code) + '</span>' +
      (lineShown(l) ? '<span class="small">' + t('unitPrice') + ': <b>' + money(l.unitEx + vatOf(l.unitEx)) + '</b>' + (f && f.wasInc ? ' <s class="muted">' + money(f.wasInc) + '</s>' : '') + ' ' + t('inclVat') + '</span>' : '<span class="small muted">' + t('tbc') + '</span>') +
      (f ? '<span class="small offtxt">' + icon('clock') + t('validTillD', { d: dateL(f.end) }) + '</span>' : '') +
      '<div class="bl-c"><div class="step sm"><button data-act="b-dec" data-i="' + i + '">−</button><input inputmode="numeric" value="' + S.basket[i].qty + '" data-input="b-qty" data-i="' + i + '"><button data-act="b-inc" data-i="' + i + '">+</button></div><button class="ib danger" data-act="b-rm" data-i="' + i + '" aria-label="' + esc(t('remove')) + '">' + icon('trash') + '</button></div></div>' +
      '<div class="bl-t">' + (lineShown(l) ? money(l.lineInc) : '—') + '</div></div>';
  });
  return h + '</div><div class="panel side">' + '<h3>' + t('summary') + '</h3>' + totalsHtml(c) + (isGuest() ? '<button class="btn pri block" data-act="to-login">' + icon('lock') + t('signToOrder') + '</button>' : '<button class="btn pri block big" data-nav="checkout">' + t('checkout') + ' →</button>') +
    '<button class="btn block" data-nav="products">' + t('continueShop') + '</button><button class="btn block ghost danger" data-act="b-clear">' + t('emptyBasket') + '</button></div></div></div>';
}

function tomorrowIso() { const p = muscatParts(new Date(Date.now() + 86400000)); return p.year + '-' + p.month + '-' + p.day; }
function profileReady() { const d = me(); if (d) S.profile.dealerCode = d.code; const p = S.profile; if (!normWa(p.wa)) return false; return !!(p.dealerCode && DEALERS.some(x => x.code === p.dealerCode) && (p.orderedBy || '').trim().length >= 2 && (p.location || '').trim().length >= 2 && isValidIsoDate(p.delivery || '') && p.delivery >= TODAY); }
function checkoutView() {
  if (isGuest()) return guestCard();
  if (!S.basket.length) return basketView();
  const c = computeOrder(S.basket, BY, OFFERS); const p = S.profile; const d = me();
  if (!p.delivery || p.delivery < TODAY) p.delivery = tomorrowIso();
  const ready = profileReady() && !c.issues.length && c.qty > 0;
  let h = '<div class="wrap"><div class="ph"><h1>' + t('almostDone') + '</h1></div><div class="two"><div><div class="panel form">' +
    (OWNER ? '<label class="f">' + t('orderFor') + '<select class="inp" data-input="prof" data-k="dealerCode"><option value="">' + t('chooseDealer') + '</option>' + DEALERS.map(x => '<option value="' + esc(x.code) + '"' + (p.dealerCode === x.code ? ' selected' : '') + '>' + esc(x.name) + ' (' + esc(x.code) + ')</option>').join('') + '</select></label>'
      : '<div class="dealerfix">' + icon('user') + '<b>' + esc(d ? d.name : '') + '</b><span dir="ltr">' + esc(d ? d.code : '') + '</span></div>') +
    '<label class="f">' + t('yourName') + ' *<input class="inp" data-input="prof" data-k="orderedBy" value="' + esc(p.orderedBy || '') + '" autocomplete="name"></label>' +
    '<label class="f">' + t('outlet') + ' *<input class="inp" data-input="prof" data-k="location" value="' + esc(p.location || '') + '"></label>' +
    '<label class="f">' + t('delivery') + ' *<input class="inp" type="date" min="' + TODAY + '" data-input="prof" data-k="delivery" value="' + esc(p.delivery) + '"></label>' +
    '<label class="f">' + t('waNum') + ' *<div class="waf"><span>🇴🇲 +968</span><input class="inp" dir="ltr" data-input="prof" data-k="wa" value="' + esc(p.wa || '') + '" inputmode="tel" placeholder="9123 4567" autocomplete="tel"></div></label><p class="small err" id="wahint">' + (normWa(p.wa) ? '' : t('waBad')) + '</p>' +
    '<label class="f">' + t('noteOpt') + '<input class="inp" data-input="note" value="' + esc(S.note || '') + '"></label></div>';
  if (c.issues.length) h += '<div class="note warn">' + t('changed') + ' <button class="btn sm pri" data-act="accept">' + t('accept') + '</button></div>';
  h += '</div><div class="panel side"><h3>' + t('reviewOrder') + '</h3>' + c.lines.filter(l => l.qty > 0).map(l => '<div class="rv"><span class="rq">' + l.qty + '×</span><span class="rn">' + esc(l.item.name) + '<small dir="ltr">' + esc(l.code) + '</small></span><span class="rp">' + (lineShown(l) ? fmtOMR(l.lineInc, false) : t('tbc')) + '</span></div>').join('') + totalsHtml(c) +
    '<button class="btn wa block big" data-act="send"' + (ready ? '' : ' disabled') + '>' + icon('chat') + '<span>' + t('sendNow') + '</span></button><p class="small muted center" id="readyhint">' + (profileReady() ? t('sendHint') : t('fillHint')) + '</p><p class="shortnote">' + t('shortNotice') + '</p></div></div></div>';
  return h;
}
function guestCard() {
  return '<div class="wrap"><div class="success"><div class="tick">' + icon('lock') + '</div><h2>' + t('signToOrder') + '</h2><p>' + t('guestNote') + '</p>' +
    '<button class="btn pri big block" data-act="to-login">' + icon('lock') + '<span>' + t('signIn') + '</span></button>' +
    '<a class="btn wa block" href="' + waLink('Hello Mr. Sarfaraaz, I would like to order. Please share my dealer login.') + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('askWa') + '</span></a></div></div>';
}

/* ---------- WhatsApp order text (same format as before) ---------- */
const padR = (s, n) => { s = String(s); return s.length >= n ? s : s + ' '.repeat(n - s.length); };
const padL = (s, n) => { s = String(s); return s.length >= n ? s : ' '.repeat(n - s.length) + s; };
function wrapText(s, n) { const w = String(s).split(/\s+/); const out = []; let cur = ''; w.forEach(x => { if ((cur + ' ' + x).trim().length > n) { if (cur) out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) out.push(cur); return out; }
const siteUrl = () => location.origin + location.pathname;
const sheetLink = o => siteUrl() + '#sheet-' + sheetPayload(o);
function orderMessage(o) {
  const cw = Math.max(9, ...o.lines.map(l => l.code.length));
  const cols = [['Sl', 2, 'L'], ['Item Code', cw, 'R'], ['Qty', 4, 'L'], ['Price', 9, 'L'], ['Gross', 10, 'L'], ['VAT%', 4, 'L'], ['Net w/ VAT', 11, 'L']];
  const row = vals => vals.map((v, k) => cols[k][2] === 'R' ? padR(v, cols[k][1]) : padL(v, cols[k][1])).join(' ');
  const width = cols.reduce((a, c) => a + c[1], 0) + cols.length - 1;
  const T = [row(cols.map(c => c[0])), '-'.repeat(width)];
  o.lines.forEach((l, i) => {
    const gross = l.unitEx * l.qty, net = gross + vatOf(gross);
    T.push(l.unitEx > 0 ? row([i + 1, l.code, l.qty, fmtOMR(l.unitEx, false), fmtOMR(gross, false), '5%', fmtOMR(net, false)]) : row([i + 1, l.code, l.qty, 'TBC', '-', '5%', '-']));
    wrapText(l.name, width - 3).forEach(x => T.push('   ' + x));
  });
  T.push('-'.repeat(width));
  if (o.lines.some(l => !(l.unitEx > 0))) T.push('NET TOTAL: To be confirmed by SARCO');
  else { T.push(padL('Gross total:', width - 12) + padL(fmtOMR(o.subtotal, false), 12)); T.push(padL('VAT 5%:', width - 12) + padL(fmtOMR(o.vat, false), 12)); T.push(padL('NET TOTAL (OMR):', width - 12) + padL(fmtOMR(o.grand, false), 12)); }
  const L = ['Dear Mr. Sarfaraaz Khan,', '', '*NEW ORDER*', '', 'Dealer Name : ' + o.dealer.name + ' (' + o.dealer.code + ')', 'Ordered by: ' + o.dealer.contact, 'Outlet location: ' + o.dealer.location];
  if (o.dealer.wa) L.push('Dealer WhatsApp: ' + fmtWa(o.dealer.wa), 'Reply to dealer: https://wa.me/' + o.dealer.wa);
  if (o.lang === 'ar') L.push('Dealer language: Arabic'); if (o.lang === 'ml') L.push('Dealer language: Malayalam');
  L.push('Order Ref: ' + o.ref, 'Date: ' + fmtDateTime(o.createdAt) + ' (Oman time)', '', '*ITEMS:*', '```', ...T, '```', '', '*Delivery date: ' + fmtDate(o.deliveryDate) + '*');
  if (o.note) L.push('Note: ' + o.note);
  L.push('', 'Order sheet (PDF): ' + sheetLink(o), '', 'Thank you.');
  return L.join('\n');
}
function confirmEn(o) {
  const m = orderMessage(o).split('\n'); const i = m.indexOf('*ITEMS:*');
  const head = ['*Thank you for your order!*', '', 'Dear ' + o.dealer.contact + ' (' + o.dealer.name + '),', 'Your order has been sent to SARCO. Here are your order details:', '', 'Order Ref: ' + o.ref, 'Date: ' + fmtDateTime(o.createdAt) + ' (Oman time)', 'Dealer: ' + o.dealer.name + ' (' + o.dealer.code + ')', 'Outlet location: ' + o.dealer.location, ''];
  const items = m.slice(i, m.indexOf('```', m.indexOf('```') + 1) + 1);
  return head.concat(items, ['', '*Delivery date: ' + fmtDate(o.deliveryDate) + '*', '', 'Order sheet (PDF): ' + sheetLink(o), '', 'Sarfaraaz Khan will confirm your order shortly.', 'Note: No payment is taken through the app. SARCO will confirm the payment terms with you.', 'SARCO – AL SEEB TECHNICAL EST. (SARCO) LLC', 'WhatsApp / Call: ' + WA_DISPLAY]).join('\n');
}
function confirmLocal(o) {
  const L = TX[o.lang] && TX[o.lang].cf; if (!L) return '';
  const mo = TX[o.lang].months; const dd = iso => { const [y, m, d] = iso.split('-'); return parseInt(d, 10) + ' ' + mo[parseInt(m, 10) - 1] + ' ' + y; };
  const p = muscatParts(new Date(o.createdAt)); const when = parseInt(p.day, 10) + ' ' + mo[parseInt(p.month, 10) - 1] + ' ' + p.year + ', ' + p.hour + ':' + p.minute;
  const out = [L.thanks, '', L.dear + ' ' + o.dealer.contact + ' (' + o.dealer.name + ')', L.sent, '', L.ref + ': ' + o.ref, L.date + ': ' + when, L.dealer + ': ' + o.dealer.name + ' (' + o.dealer.code + ')', L.loc + ': ' + o.dealer.location, '', L.items];
  o.lines.forEach((l, k) => { const g = l.unitEx * l.qty; out.push((k + 1) + '. ' + l.code + ' – ' + l.name); if (l.unitEx > 0) out.push('   ' + L.qty + ': ' + l.qty + ' × ' + fmtOMR(l.unitEx, false) + ' = OMR ' + fmtOMR(g, false), '   ' + L.withVat + ': OMR ' + fmtOMR(g + vatOf(g), false)); else out.push('   ' + L.qty + ': ' + l.qty + ' – ' + L.tbcLine); });
  if (o.tbc) out.push('', L.totalTbc); else out.push('', L.sub + ': OMR ' + fmtOMR(o.subtotal, false), L.vat + ': OMR ' + fmtOMR(o.vat, false), L.total + ': OMR ' + fmtOMR(o.grand, false));
  out.push('', L.del + ': ' + dd(o.deliveryDate), '', L.sheet + ': ' + sheetLink(o), '', L.confirm, L.noPay, 'SARCO – AL SEEB TECHNICAL EST. (SARCO) LLC', 'WhatsApp: ' + WA_DISPLAY);
  return out.join('\n');
}
const dealerCopy = o => (o.lang === 'ar' || o.lang === 'ml') ? confirmLocal(o) + '\n\n— — — — — — — —\nENGLISH\n\n' + confirmEn(o) : confirmEn(o);
function sendOrder() {
  const c = computeOrder(S.basket, BY, OFFERS);
  if (c.issues.length || !c.qty || !profileReady() || !c.check) { render(); return; }
  const d = DEALERS.find(x => x.code === S.profile.dealerCode); const p = S.profile;
  const o = { ref: newOrderRef(), createdAt: Date.now(), lang: LANG, stockVersion: STOCK.version, deliveryDate: p.delivery, dealer: { name: d.name, code: d.code, contact: p.orderedBy.trim(), location: p.location.trim(), wa: normWa(p.wa) || '' }, note: (S.note || '').trim(),
    lines: c.lines.filter(l => l.qty > 0).map(l => { const u = lineShown(l) ? l.unitEx : 0; const ex = u * l.qty; return { code: l.code, name: l.item.name, wh: 'ALL', qty: l.qty, unitEx: u, lineEx: ex, lineVat: vatOf(ex), offerId: l.offerId || null }; }), status: 'sent' };
  o.subtotal = o.lines.reduce((a, l) => a + l.lineEx, 0); o.vat = o.lines.reduce((a, l) => a + l.lineVat, 0); o.grand = o.subtotal + o.vat; o.tbc = o.lines.some(l => !(l.unitEx > 0));
  /* validation: every line = unit × qty, VAT per line, grand = subtotal + VAT */
  if (!o.lines.every(l => l.lineEx === l.unitEx * l.qty && l.lineVat === vatOf(l.lineEx)) || o.grand !== o.subtotal + o.vat) { toast('Order check failed – please reload the app.', true); return; }
  const url = waLink(orderMessage(o)); const w = window.open(url, '_blank');
  S.lastOrder = o; S.basket = []; saveBasket(); S.note = '';
  play('wave');
  if (!w) location.href = url; else nav('order-' + o.ref);
}
function orderView(ref) {
  const o = S.lastOrder && S.lastOrder.ref === ref ? S.lastOrder : null;
  if (!o) return '<div class="wrap"><div class="empty"><b>' + t('notFoundOrder') + '</b><button class="btn" data-nav="home">' + t('home') + '</button></div></div>';
  return '<div class="wrap"><div class="success"><div class="tick">' + icon('check') + '</div><h2>' + t('sentTitle') + '</h2><p>' + t('sentSub') + '</p>' +
    '<a class="lnk" href="' + waLink(orderMessage(o)) + '" target="_blank" rel="noopener">' + t('notSent') + '</a>' +
    '<p class="small"><b>' + t('step2Copy') + '</b></p><a class="btn wa big block" href="' + waTo(o.dealer.wa, dealerCopy(o)) + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('getCopy') + '</span></a>' +
    '<p class="small muted">' + t('getCopyHint') + ' <bdi dir="ltr">' + fmtWa(o.dealer.wa) + '</bdi></p>' +
    '<button class="btn block" data-act="pdf">' + icon('download') + '<span>' + t('sheetBtn') + '</span></button>' +
    '<p class="small muted">' + t('notStored') + '</p><button class="btn pri big block" data-act="new-order">' + icon('grid') + '<span>' + t('newOrder') + '</span></button></div>' +
    '<div class="panel"><div class="rowsb"><b dir="ltr">' + esc(o.ref) + '</b><span class="small muted">' + dateTimeL(o.createdAt) + '</span></div><dl class="kv"><dt>' + t('dealerName') + '</dt><dd>' + esc(o.dealer.name) + ' (' + esc(o.dealer.code) + ')</dd><dt>' + t('outlet') + '</dt><dd>' + esc(o.dealer.location) + '</dd><dt>' + t('delivery') + '</dt><dd>' + dateL(o.deliveryDate) + '</dd></dl>' +
    totalsHtml({ items: o.lines.length, qty: o.lines.reduce((a, l) => a + l.qty, 0), subtotal: o.subtotal, vat: o.vat, grand: o.grand, tbc: o.tbc }) + '</div></div>';
}
const signFor = code => ((DATA && DATA.signatures) || {})[code] || null;
async function downloadSheet(o) {
  if (!o) return; toast(t('preparing'));
  const sign = signFor(o.dealer.code);
  if (OWNER && !sign) setTimeout(() => toast(t('noSignAdmin'), true), 600);
  try {
    const blob = await buildOrderSheet(o, { sign }); const u = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = u; a.download = 'SARCO_Order_Sheet_' + o.ref + '.pdf'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 60000); toast(t('sheetReady'));
  } catch (e) { console.error(e); toast(t('sheetErr'), true); }
}
function sheetView(p) {
  let o; try { o = orderFromPayload(p, BY, OWNER ? it => priceOf(it, OFFERS).unitEx : null); } catch (e) { return '<div class="wrap"><div class="empty"><b>' + t('notFoundOrder') + '</b></div></div>'; }
  if (!OWNER && (!me() || me().code !== o.dealer.code)) return '<div class="wrap"><div class="empty"><b>🔒 ' + t('privT') + '</b><p>' + t('notYours') + '</p></div></div>';
  S.sheetOrder = o;
  return '<div class="wrap"><div class="success"><div class="tick">' + icon('download') + '</div><h2>' + t('sheetTitle') + '</h2><p dir="ltr">' + esc(o.ref) + '</p><p>' + t('sheetSub') + '</p><button class="btn pri big block" data-act="sheet-dl">' + icon('download') + '<span>' + t('sheetBtn') + '</span></button></div>' +
    '<div class="panel"><dl class="kv"><dt>' + t('dealerName') + '</dt><dd>' + esc(o.dealer.name) + ' (' + esc(o.dealer.code) + ')</dd><dt>' + t('outlet') + '</dt><dd>' + esc(o.dealer.location) + '</dd><dt>' + t('delivery') + '</dt><dd>' + dateL(o.deliveryDate) + '</dd></dl>' +
    o.lines.map(l => '<div class="rv"><span class="rq">' + l.qty + '×</span><span class="rn">' + esc(l.name) + '<small dir="ltr">' + esc(l.code) + '</small></span><span class="rp">' + fmtOMR(l.lineEx, false) + '</span></div>').join('') +
    totalsHtml({ items: o.lines.length, qty: o.lines.reduce((a, l) => a + l.qty, 0), subtotal: o.subtotal, vat: o.vat, grand: o.grand, tbc: o.lines.some(l => !(l.unitEx > 0)) }) + '</div></div>';
}

/* ---------- login & passwords (same rules as before – existing passwords keep working) ---------- */
async function sha(txt) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)); return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join(''); }
const pwKey = (code, pw) => sha(code.toUpperCase() + '|' + pw);
async function checkLogin(user, pw) {
  const u = String(user || '').trim().toUpperCase();
  if (ADMIN_USERS.includes(u)) return (await sha(pw)) === OWNER_HASH ? { role: 'admin', code: u } : null;
  const d = DEALERS.find(x => x.code.toUpperCase() === u); if (!d) return null;
  const h = await pwKey(d.code, pw);
  const published = (DATA && DATA.passwords || {})[d.code] || null;
  const local = LS.get('pw.' + d.code, null), snap = LS.get('pwpub.' + d.code, null);
  let expected;
  if (local && published === snap) expected = local;
  else if (published && !String(published).startsWith('RESET')) expected = published;
  else expected = await pwKey(d.code, DEFAULT_PW);
  if (local && published !== snap) { LS.del('pw.' + d.code); LS.del('pwpub.' + d.code); }
  const ok = h === expected; const isDefault = expected === await pwKey(d.code, DEFAULT_PW);
  return ok ? { role: 'dealer', code: d.code, mustReset: isDefault } : null;
}
async function openPriceVault(pw) {
  const v = DATA && DATA.priceVault; if (!v) return null;
  try {
    const fb = s2 => Uint8Array.from(atob(s2), c => c.charCodeAt(0));
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: fb(v.salt), iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fb(v.iv) }, key, fb(v.ct))));
  } catch (e) { return null; }
}
const langPills = () => '<div class="langs">' + LANGS.map(([k, f, n]) => '<button class="' + (LANG === k ? 'on' : '') + '" data-act="set-lang" data-v="' + k + '">' + f + ' ' + n + '</button>').join('') + '</div>';
function loginView() {
  const adm = ADMIN_USERS.includes(String(S.lastUser || '').trim().toUpperCase());
  return '<div class="login"><div class="lcard"><img class="llogo" src="logo.jpg" alt="SARCO"><img class="av big" src="sarfaraaz.jpg" alt="Sarfaraaz Khan" width="72" height="72"><h1>' + t('loginWelcome') + '</h1>' + langPills() +
    '<label class="f" dir="ltr">User ID<input class="inp en" id="lu" dir="ltr" autocomplete="username" autocapitalize="characters" spellcheck="false" placeholder="CL000000" value="' + esc(S.lastUser || '') + '"></label>' +
    '<label class="f" dir="ltr">Password<input class="inp en" id="lp" dir="ltr" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false"></label>' +
    '<label class="f' + (adm ? '' : ' hide') + '" dir="ltr" id="dcwrap">Dealer code (optional)<input class="inp en" id="ld" dir="ltr" autocapitalize="characters" spellcheck="false" placeholder="CL000000"><small>' + t('dealerCodeHint') + '</small></label>' +
    '<button class="btn pri big block" data-act="login">' + icon('lock') + '<span>' + t('signIn') + '</span></button>' +
    '<button class="btn big block" data-act="guest">' + t('browseGuest') + '</button><p class="small muted">' + t('loginHint') + '</p>' +
    '<a class="btn wa block" href="' + waLink('Hello Mr. Sarfaraaz, I need help to sign in to the dealer app.') + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('askWa') + '</span></a><p class="small muted">🧾 ' + t('noPayT') + ' · 🔒 ' + t('privT') + '</p></div></div>';
}
async function doLogin() {
  const u = ($('#lu') || {}).value || '', p = ($('#lp') || {}).value || '', dc = (($('#ld') || {}).value || '').trim().toUpperCase(); S.lastUser = u;
  if (!DEALERS.length && !ADMIN_USERS.includes(u.trim().toUpperCase())) { toast(t('loading')); return; }
  const s2 = await checkLogin(u, p);
  if (!s2) { toast(t('loginBad'), true); const lp = $('#lp'); if (lp) { lp.value = ''; lp.focus(); } return; }
  if (s2.role === 'admin' && dc) { const dd = DEALERS.find(x => x.code.toUpperCase() === dc); if (!dd) { toast(t('badDealer'), true); return; } s2.dealerOpen = dd.code; }
  const gb = LS.get('basket.GUEST', []);
  if (s2.role === 'admin') { const pm = await openPriceVault(p); if (pm) LS.set('adm.prices', pm); }
  SESSION = s2.dealerOpen ? { role: 'dealer', code: s2.dealerOpen, viaAdmin: true } : s2; OWNER = SESSION.role === 'admin'; LS.set('session', SESSION);
  if (gb.length) { const cur = LS.get(basketKey(), []); gb.forEach(g => { const e = cur.find(x => x.code === g.code); if (e) e.qty += g.qty; else cur.push(g); }); LS.set(basketKey(), cur.filter(l => { const it = BY.get(l.code); if (!it || tot(it) <= 0) return false; if (l.qty > tot(it)) l.qty = tot(it); return true; })); LS.set('basket.GUEST', []); }
  S.wantLogin = false; applyData(DATA); loadProfile(); loadBasket(); S.lastOrder = null; nav('home'); showWelcome(true);
}
function resetView() {
  const d = me() || { name: SESSION.code, code: SESSION.code };
  if (S.resetSent) return '<div class="login"><div class="lcard"><img class="llogo" src="logo.jpg" alt="SARCO"><div class="tick">' + icon('check') + '</div><h1>' + t('resetDone') + '</h1><p class="small muted">' + t('pwSaved') + '</p><a class="btn wa block" href="' + waLink(S.resetSent) + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('pwSendBtn') + '</span></a><button class="btn pri big block" data-act="reset-continue">' + t('continueBtn') + '</button></div></div>';
  return '<div class="login"><div class="lcard"><img class="llogo" src="logo.jpg" alt="SARCO"><h1>🔒 ' + t('resetT') + '</h1><p class="small muted">' + t('resetB') + '</p><div class="dealerfix">' + icon('user') + '<b>' + esc(d.name) + '</b><span dir="ltr">' + esc(d.code) + '</span></div>' +
    '<label class="f" dir="ltr">New password<input class="inp en" id="rp1" type="password" dir="ltr" autocomplete="new-password" placeholder="' + esc(t('pwRule')) + '"></label>' +
    '<label class="f" dir="ltr">Confirm new password<input class="inp en" id="rp2" type="password" dir="ltr" autocomplete="new-password"></label>' +
    '<button class="btn pri big block" data-act="reset-save">' + icon('lock') + '<span>' + t('resetSave') + '</span></button>' + langPills() + '</div></div>';
}
const pwMsg = (d, key) => 'Dear Mr. Sarfaraaz Khan,\n\n*PASSWORD UPDATE REQUEST*\n\nDealer: ' + d.name + ' (' + d.code + ')\nKey: ' + key + '\n\nPlease apply this in the SARCO upload page (Dealers tab) so my new password works on all my phones.\n\nThank you.';
async function saveReset() {
  const d = me(); if (!d) return; const p1 = $('#rp1').value, p2 = $('#rp2').value;
  if (p1.length < 6) { toast(t('pwShort'), true); return; }
  if (p1 !== p2) { toast(t('pwMismatch'), true); return; }
  if (p1 === DEFAULT_PW) { toast(t('resetB'), true); return; }
  const key = await pwKey(d.code, p1); LS.set('pw.' + d.code, key); LS.set('pwpub.' + d.code, (DATA.passwords || {})[d.code] || null);
  S.resetSent = pwMsg(d, key); render();
}
async function changePw() {
  const d = me(); if (!d) return; const p0 = $('#pw0').value, p1 = $('#pw1').value, p2 = $('#pw2').value;
  if (!(await checkLogin(d.code, p0))) { toast(t('wrongPw'), true); return; }
  if (p1.length < 6) { toast(t('pwShort'), true); return; }
  if (p1 !== p2) { toast(t('pwMismatch'), true); return; }
  const key = await pwKey(d.code, p1); LS.set('pw.' + d.code, key); LS.set('pwpub.' + d.code, (DATA.passwords || {})[d.code] || null);
  $('#pwmsg').innerHTML = '<div class="note ok">' + icon('check') + '<span>' + t('pwSaved') + '</span></div><a class="btn wa block" href="' + waLink(pwMsg(d, key)) + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + t('pwSendBtn') + '</span></a>';
  ['pw0', 'pw1', 'pw2'].forEach(i => { $('#' + i).value = ''; });
}
function accountView() {
  if (isGuest()) return '<div class="wrap"><div class="ph"><h1>' + t('account') + '</h1></div><div class="panel"><h3>' + t('language') + '</h3>' + langPills() + '</div>' + '<div class="panel rowsb"><h3 style="margin:0">💧 ' + t('tapSoundT') + '</h3><button class="tg' + (soundOn() ? ' on' : '') + '" data-act="snd">' + (soundOn() ? icon('check') + t('onW') : t('offW')) + '</button></div>' + '</div>' + guestCard();
  const d = me(); const dealerOpts = DEALERS.map(x => '<option value="' + esc(x.code) + '">' + esc(x.name) + ' (' + esc(x.code) + ')</option>').join('');
  let h = '<div class="wrap"><div class="acc"><img class="av" src="sarfaraaz.jpg" alt="" width="52" height="52"><div><h1>' + t('hello', { n: esc(OWNER ? 'Sarfaraaz Khan' : d ? d.name : '') }) + '</h1><span class="c-code" dir="ltr">' + esc(OWNER ? t('adminRole') + ' · ' + SESSION.code : d ? d.code : '') + '</span></div></div>';
  h += '<div class="panel"><h3>' + t('language') + '</h3>' + langPills() + '</div>';
  h += '<div class="panel rowsb"><h3 style="margin:0">💧 ' + t('tapSoundT') + '</h3><button class="tg' + (soundOn() ? ' on' : '') + '" data-act="snd">' + (soundOn() ? icon('check') + t('onW') : t('offW')) + '</button></div>';
  if (!OWNER) h += '<div class="panel"><h3>🔔 ' + t('alertsT') + '</h3><p class="small muted">' + t('alertsB') + '</p><div class="row">' + (LS.get('alerts', false) ? '<span class="pill ok">✓ ' + t('alertsOk') + '</span>' : '<button class="btn pri" data-act="alerts-on">' + t('alertsOn') + '</button>') + '<button class="btn" data-act="alerts-test">' + t('alertsTest') + '</button></div></div>';
  if (OWNER) h += '<div class="panel"><h3>' + t('adminRole') + '</h3><a class="btn pri block" href="admin.html">' + icon('upload') + t('uploadPage') + '</a></div>' +
    '<div class="panel"><h3>🔑 ' + t('resetDealerT') + '</h3><p class="small muted">' + t('resetDealerB') + '</p><select class="inp" id="rstdealer"><option value="">' + t('chooseDealer') + '</option>' + dealerOpts + '</select><button class="btn block" data-act="admin-reset">' + t('resetBtn') + '</button></div>' +
    '<div class="panel"><h3>👁️ ' + t('viewAs') + '</h3><p class="small muted">' + t('viewAsB') + '</p><select class="inp" id="asdealer"><option value="">' + t('chooseDealer') + '</option>' + dealerOpts + '</select><button class="btn pri block" data-act="open-as">' + t('openAs') + '</button></div>';
  else if (!SESSION.viaAdmin) h += '<div class="panel form"><h3>' + t('changePw') + '</h3><label class="f">' + t('curPw') + '<input class="inp" type="password" id="pw0" autocomplete="current-password"></label><label class="f">' + t('newPw') + '<input class="inp" type="password" id="pw1" autocomplete="new-password" placeholder="' + esc(t('pwRule')) + '"></label><label class="f">' + t('newPw2') + '<input class="inp" type="password" id="pw2" autocomplete="new-password"></label><button class="btn pri block" data-act="pw-change">' + t('saveBtn') + '</button><div id="pwmsg"></div></div>';
  return h + '<div class="panel">' + contactRow() + '</div><button class="btn block danger big" data-act="logout">' + t('logout') + '</button><p class="foot">v' + APP_V + ' · ' + t('stockUpdated') + ': ' + (STOCK ? dateTimeL(STOCK.publishedAt) : '—') + '</p></div>';
}

/* ---------- 💧 WATER SOUNDS (made inside the app, no files to download) ----------
   drop    : one water drop "plink"              – every normal tap
   drip    : two drops                            – menu / product opened
   splash  : pure water splash + droplets         – unit added to the basket
   wave    : big splash, water rush and drops     – order sent
   bubbles : soft rising bubbles                  – welcome greeting
   Each sound is rendered once into a buffer (OfflineAudioContext) and then plays instantly. */
const soundOn = () => LS.get('tapSound', true);
const SND = {}; let sndBusy = false, lastTap = 0;
function rnd(a, b) { return a + Math.random() * (b - a); }
function noiseBuf(ctx, sec) { const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * sec), ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
function env(ctx, g, t0, peak, att, dec) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + att); g.gain.exponentialRampToValueAtTime(0.0001, t0 + att + dec); }
function nz(ctx, out, nb, t0, type, f0, f1, q, peak, att, dec, pan) {
  const s = ctx.createBufferSource(); s.buffer = nb; const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t0); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t0 + att + dec);
  const g = ctx.createGain(); env(ctx, g, t0, peak, att, dec);
  let last = g; if (pan != null && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); last = p; }
  s.connect(f); f.connect(g); last.connect(out); s.start(t0, Math.random() * 0.4); s.stop(t0 + att + dec + 0.05);
}
/* a water drop / bubble: a short tone whose pitch rises quickly (that is how real drops and bubbles sound) */
function drop(ctx, out, t0, f, peak, rise, len, pan) {
  const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f, t0); o.frequency.exponentialRampToValueAtTime(f * (rise || 1.9), t0 + (len || 0.05) * 0.7);
  const g = ctx.createGain(); env(ctx, g, t0, peak, 0.002, len || 0.05);
  let last = g; if (pan != null && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); last = p; }
  o.connect(g); last.connect(out); o.start(t0); o.stop(t0 + (len || 0.05) + 0.03);
}
function plink(ctx, out, nb, t0, f, peak) {            /* one clean water drop with a soft echo */
  nz(ctx, out, nb, t0, 'highpass', 5000, 5000, 0.7, peak * 0.12, 0.001, 0.008);
  drop(ctx, out, t0, f, peak, 2.1, 0.075);
  drop(ctx, out, t0 + 0.085, f * 1.02, peak * 0.22, 2.1, 0.06);
  drop(ctx, out, t0 + 0.17, f * 1.03, peak * 0.08, 2.1, 0.05);
}
function splashCore(ctx, out, nb, t0, size) {          /* water only: splash body + spray + droplets + small bubbles */
  nz(ctx, out, nb, t0, 'bandpass', 2400, 700, 0.7, 0.5 * size, 0.006, 0.26 + 0.12 * size);
  nz(ctx, out, nb, t0 + 0.004, 'highpass', 4200, 2800, 0.6, 0.13 * size, 0.008, 0.22);
  for (let k = 0; k < Math.round(12 * size); k++) drop(ctx, out, t0 + rnd(0.05, 0.55 * size), rnd(800, 2600), rnd(0.04, 0.12), rnd(1.6, 2.2), rnd(0.03, 0.06), rnd(-0.6, 0.6));
  for (let k = 0; k < Math.round(4 * size); k++) drop(ctx, out, t0 + rnd(0.15, 0.6 * size), rnd(350, 700), rnd(0.05, 0.09), 1.5, 0.07, rnd(-0.4, 0.4));
}
const RECIPES = {
  drop: { sec: 0.35, build(ctx, out) { const nb = noiseBuf(ctx, 0.5); plink(ctx, out, nb, 0, rnd(1150, 1350), 0.8); } },
  drip: { sec: 0.55, build(ctx, out) { const nb = noiseBuf(ctx, 0.5); plink(ctx, out, nb, 0, 1450, 0.75); plink(ctx, out, nb, 0.16, 1020, 0.7); } },
  splash: { sec: 0.85, build(ctx, out) { const nb = noiseBuf(ctx, 1.2); splashCore(ctx, out, nb, 0, 1); } },
  wave: { sec: 1.9, build(ctx, out) {
    const nb = noiseBuf(ctx, 2.2);
    splashCore(ctx, out, nb, 0, 1.4); splashCore(ctx, out, nb, 0.14, 1.1);
    nz(ctx, out, nb, 0.05, 'lowpass', 1400, 380, 0.6, 0.22, 0.12, 1.25);                 /* water rushing and settling */
    for (let k = 0; k < 18; k++) drop(ctx, out, rnd(0.5, 1.7), rnd(700, 2400), rnd(0.03, 0.08), rnd(1.6, 2.2), rnd(0.03, 0.06), rnd(-0.7, 0.7));
  } },
  bubbles: { sec: 1.2, build(ctx, out) {
    const nb = noiseBuf(ctx, 1.4); nz(ctx, out, nb, 0, 'bandpass', 900, 600, 0.6, 0.05, 0.2, 0.9);
    for (let k = 0; k < 12; k++) drop(ctx, out, 0.04 + k * 0.075 + rnd(-0.02, 0.02), rnd(320, 520) * (1 + k * 0.07), rnd(0.12, 0.2), 1.7, rnd(0.06, 0.09), rnd(-0.5, 0.5));
  } }
};
async function getSound(name) {
  if (SND[name]) return SND[name];
  const r = RECIPES[name]; const Off = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!Off) return null;
  const ctx = new Off(2, Math.ceil(44100 * r.sec), 44100); const master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
  r.build(ctx, master); const buf = await ctx.startRendering();
  /* normalise: every sound reaches the same clear level (peak) – not too soft, never clipping */
  const target = { drop: 0.6, drip: 0.6, splash: 0.75, wave: 0.8, bubbles: 0.6 }[name] || 0.7; let pk = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) { const v = Math.abs(d[i]); if (v > pk) pk = v; } }
  if (pk > 0) { const k = target / pk; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; } }
  SND[name] = buf; return buf;
}
async function play(name, vol) {
  if (!soundOn()) return; const ac = audioCtx(); if (!ac) return;
  try { const b = await getSound(name); if (!b || ac.state !== 'running') return; const s = ac.createBufferSource(); s.buffer = b; const g = ac.createGain(); g.gain.value = vol == null ? 1 : vol; s.connect(g); g.connect(ac.destination); s.start(); } catch (e) { }
}
function warmSounds() { if (sndBusy) return; sndBusy = true; ['drop', 'drip', 'splash', 'wave', 'bubbles'].reduce((p, n) => p.then(() => getSound(n)), Promise.resolve()).catch(() => { }); }
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function splashAt(x, y) {
  if (REDUCED) return;
  const el = document.createElement('span'); el.className = 'splash'; el.style.left = x + 'px'; el.style.top = y + 'px';
  el.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
  document.body.appendChild(el); setTimeout(() => el.remove(), 700);
}
document.addEventListener('pointerdown', e => {
  const tgt = e.target.closest('button,a,select,[data-nav],[data-act],.card,label,#welcome');
  if (!tgt || e.button > 0) return;
  audioCtx(); warmSounds(); splashAt(e.clientX, e.clientY);
  if (tgt.closest('[data-act="inc"],[data-act="m-add"],[data-act="send"],[data-act="menu"],[data-act="item"]')) return;   /* these play their own water sound */
  const now = Date.now(); if (now - lastTap < 120) return; lastTap = now; play('drop', 0.6);
}, { passive: true });

/* ---------- offer alerts (sound + message when new offers are published) ---------- */
let AC = null;
function audioCtx() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { } return AC; }
function ping() {
  const ac = audioCtx(); if (!ac || ac.state !== 'running') return;
  [[880, 0], [1320, 0.16], [1760, 0.32]].forEach(([f, d]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ac.currentTime + d); g.gain.exponentialRampToValueAtTime(0.3, ac.currentTime + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d + 0.45); o.connect(g); g.connect(ac.destination); o.start(ac.currentTime + d); o.stop(ac.currentTime + d + 0.5); });
  try { navigator.vibrate && navigator.vibrate([150, 70, 150]); } catch (e) { }
}
function checkOfferAlerts() {
  if (!SESSION || OWNER || !DATA) return;
  const ids = [...OFFERS.values()].map(o => o.id); const key = 'seenOffers.' + SESSION.code; const seen = LS.get(key, null);
  LS.set(key, ids); if (seen === null) return;
  const fresh = ids.filter(id => !seen.includes(id)); if (!fresh.length) return;
  S.modal = { type: 'offers', n: fresh.length }; if (LS.get('alerts', false)) ping();
  try { if (window.Notification && Notification.permission === 'granted' && document.hidden) new Notification('SARCO', { body: t('newOffersB', { n: fresh.length }), icon: 'icon-192.png' }); } catch (e) { }
}


/* ---------- 🌊 welcome greeting from Sarfaraaz (every time the app is opened; not again within 30 minutes) ---------- */
function showWelcome(force) {
  if (!SESSION || OWNER || (SESSION.mustReset && !SESSION.viaAdmin) || document.getElementById('welcome')) return;
  const last = LS.get('welcomeAt', 0); if (!force && Date.now() - last < 30 * 60000) return;
  LS.set('welcomeAt', Date.now());
  const d = me(); const name = d ? d.name : '';
  const el = document.createElement('div'); el.id = 'welcome'; el.className = 'wel'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = '<div class="wel-card"><img class="av" src="sarfaraaz.jpg" alt="Sarfaraaz Khan" width="92" height="92"><p class="wel-hi">' + t('welcomeT') + (name ? (LANG === 'ar' ? '،' : ',') : '') + '</p>' + (name ? '<h1>' + esc(name) + '</h1>' : '<h1>🌊</h1>') +
    '<p class="wel-msg">' + t('welcomeMsg') + ' 🤲</p><p class="wel-sign">— ' + t('welcomeSign') + ' · SARCO</p><button class="btn pri big block" data-act="wel-close">' + t('welcomeGo') + '</button></div>';
  document.body.appendChild(el); play('bubbles', 0.8);
  clearTimeout(showWelcome.tm); showWelcome.tm = setTimeout(closeWelcome, 9000);
}
function closeWelcome() { const el = document.getElementById('welcome'); if (!el) return; el.classList.add('bye'); setTimeout(() => el.remove(), 400); }

/* ====================================================================
   SHELL: header, drawer menu, bottom bar, modal
   ==================================================================== */
function parseRoute() {
  let h = (location.hash || '').replace(/^#/, ''); try { h = decodeURIComponent(h); } catch (e) { }
  if (h === 'admin' || h === 'upload') { location.href = 'admin.html'; return; }
  let r = h || 'home', arg = '';
  const m = h.match(/^(products|offers|order|sheet)-(.+)$/); if (m) { r = m[1]; arg = m[2]; }
  if (!['home', 'products', 'offers', 'basket', 'checkout', 'account', 'order', 'sheet'].includes(r)) r = 'home';
  if ((r === 'products' || r === 'offers') && arg && !GROUP_ICON[arg]) arg = '';
  if (r + '|' + arg !== S.route + '|' + S.arg) S.shown = PAGE;
  S.route = r; S.arg = arg;
}
/* every menu / bottom-bar tap goes through here: it always works, even when you are already on that page */
function nav(h) {
  S.modal = null; S.drawer = false; document.body.classList.remove('lock');
  if ((location.hash || '#home') === '#' + h) { render(); window.scrollTo(0, 0); }
  else location.hash = h;
}
function header() {
  const bc = basketCount(); const lang = LANGS.find(l => l[0] === LANG);
  return '<header class="top"><div class="wrap bar"><button class="ib" data-act="menu" aria-label="' + esc(t('menu')) + '">' + icon('menu') + '</button>' +
    '<button class="logo" data-nav="home" aria-label="' + esc(t('home')) + '"><img src="logo.jpg" alt="AL SEEB TECHNICAL EST. (SARCO) LLC" height="34"></button><span class="sp"></span>' +
    '<button class="ib lang" data-act="lang" aria-label="Language">' + icon('globe') + '<span>' + lang[0].toUpperCase() + '</span></button>' +
    '<button class="ib bk" data-nav="basket" aria-label="' + esc(t('basket')) + '">' + icon('basket') + (bc ? '<i class="badge">' + bc + '</i>' : '') + '</button></div></header>';
}
function roleBar() {
  if (isGuest()) return '<div class="rolebar"><div class="wrap"><span>👀 ' + t('guestBar') + '</span><button data-act="to-login">' + t('signIn') + '</button></div></div>';
  if (SESSION && SESSION.viaAdmin) return '<div class="rolebar"><div class="wrap"><span>👁️ ' + t('asDealer', { n: esc(me() ? me().name : SESSION.code) }) + '</span><button data-act="back-admin">' + t('backAdmin') + '</button></div></div>';
  if (OWNER) return '<div class="rolebar adm"><div class="wrap"><span>👤 ' + t('adminRole') + '</span><a href="admin.html">' + t('uploadPage') + '</a></div></div>';
  return '';
}
function drawer() {
  if (!S.drawer) return '';
  const cnt = {}; ITEMS.forEach(i => { cnt[i.g] = (cnt[i.g] || 0) + 1; }); const d = me(); const bc = basketCount();
  const row = (to, ic, label, n, cls) => '<button class="dr-row' + (cls ? ' ' + cls : '') + '" data-nav="' + to + '">' + icon(ic) + '<span>' + esc(label) + '</span>' + (n != null ? '<small>' + n + '</small>' : '') + '</button>';
  return '<div class="dr-bg" data-act="menu-close"></div><aside class="drawer" role="dialog" aria-label="' + esc(t('menu')) + '"><div class="dr-head"><img src="logo.jpg" alt="SARCO" height="30"><button class="ib" data-act="menu-close" aria-label="Close">' + icon('x') + '</button></div>' +
    '<div class="dr-user">' + icon('user') + '<div><b>' + esc(OWNER ? 'Sarfaraaz Khan' : d ? d.name : isGuest() ? t('guestHi') : '') + '</b><small dir="ltr">' + esc(OWNER ? SESSION.code : d ? d.code : '') + '</small></div></div>' +
    '<nav class="dr-list">' + row('home', 'home', t('home')) + (OFFERS.size ? row('offers', 'tag', t('specialOffers'), OFFERS.size, 'hot') : '') + row('products', 'grid', t('allProducts'), ITEMS.length) +
    '<p class="dr-sec">' + t('categories') + '</p>' + GROUPS.filter(([g]) => cnt[g]).map(([g, ic]) => row('products-' + g, ic, gName(g), cnt[g])).join('') +
    '<p class="dr-sec">' + t('account') + '</p>' + row('basket', 'basket', t('basket'), bc || null) + row('account', 'user', t('account')) + '</nav>' +
    '<div class="dr-foot"><a class="btn" href="tel:' + PHONE + '">' + icon('call') + t('call') + '</a><a class="btn wa" href="' + waLink('Hello Mr. Sarfaraaz, I need help with an order.') + '" target="_blank" rel="noopener">' + icon('chat') + 'WhatsApp</a></div></aside>';
}
function bottomBar() {
  const r = S.route, bc = basketCount();
  const on = k => (r === k || (k === 'basket' && (r === 'checkout' || r === 'order')) || (k === 'products' && r === 'offers')) ? ' on' : '';
  return '<nav class="bnav">' + [['home', 'home'], ['products', 'grid'], ['basket', 'basket'], ['account', 'user']].map(([k, ic]) => '<button class="' + on(k).trim() + '" data-nav="' + k + '">' + icon(ic) + '<span>' + t(k) + '</span>' + (k === 'basket' && bc ? '<i class="badge">' + bc + '</i>' : '') + '</button>').join('') + '</nav>';
}
function floaters() {
  const r = S.route, n = basketCount(); let h = '';
  if (n && (r === 'home' || r === 'products' || r === 'offers')) h += '<button class="cobar" data-nav="basket">' + icon('basket') + '<b>' + t(n === 1 ? 'itemN' : 'itemsN', { n }) + '</b><span>' + t('goCheckout') + ' →</span></button>';
  if (!OWNER && (r === 'home' || r === 'products' || r === 'offers')) h += '<a class="wafab' + (n && (r === 'home' || r === 'products' || r === 'offers') ? ' up' : '') + '" href="' + waLink('Hello Mr. Sarfaraaz, I need help with an order.') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon('chat') + '</a>';
  return h;
}
function modalHtml() {
  const m = S.modal; if (!m) return '';
  let inner;
  if (m.type === 'item') inner = itemModal();
  else if (m.type === 'lang') inner = '<h2>' + t('chooseLang') + '</h2><div class="langs big">' + LANGS.map(([k, f, n]) => '<button class="' + (LANG === k ? 'on' : '') + '" data-act="set-lang" data-v="' + k + '">' + f + ' ' + n + '</button>').join('') + '</div>';
  else if (m.type === 'offers') inner = '<div class="center"><div class="tick off">' + icon('tag') + '</div><h2>' + t('newOffersT') + '</h2><p>' + t('newOffersB', { n: m.n }) + '</p><button class="btn pri big block" data-nav="offers">' + icon('tag') + '<span>' + t('seeOffers') + '</span></button></div>';
  else inner = '<h2>' + esc(m.title) + '</h2><div class="row"><button class="btn pri" data-act="yes">' + t('yes') + '</button><button class="btn" data-act="close">' + t('cancel') + '</button></div>';
  return '<div class="m-bg" data-act="bg"><div class="modal" role="dialog" aria-modal="true"><button class="mx" data-act="close" aria-label="Close">' + icon('x') + '</button>' + inner + '</div></div>';
}
function renderModal() {
  const box = $('#modal'); if (!box) return;
  box.innerHTML = modalHtml(); document.body.classList.toggle('lock', !!(S.modal || S.drawer));
}
const closeModal = () => { S.modal = null; renderModal(); };

function view() {
  if (S.loading && !STOCK) return '<div class="wrap"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>';
  switch (S.route) {
    case 'products': case 'offers': return listView();
    case 'basket': return basketView();
    case 'checkout': return checkoutView();
    case 'account': return accountView();
    case 'order': return orderView(S.arg);
    case 'sheet': return sheetView(S.arg);
    default: return homeView();
  }
}
function render() {
  try {
    parseRoute(); applyLang();
    const root = $('#root');
    if (SESSION && SESSION.mustReset && !SESSION.viaAdmin && SESSION.role === 'dealer') { root.innerHTML = resetView() + '<div id="modal"></div><div class="toasts" id="toasts"></div>'; return; }
    if (!SESSION && !S.wantLogin) { SESSION = { role: 'guest', code: 'GUEST' }; OWNER = false; LS.set('session', SESSION); loadProfile(); loadBasket(); }
    if (!SESSION) { root.innerHTML = loginView() + '<div id="modal"></div><div class="toasts" id="toasts"></div>'; return; }
    let h = header() + roleBar();
    if (!S.online || (!S.fresh && !S.loading && STOCK)) h += '<div class="offline"><div class="wrap">' + t('offline') + (S.syncedAt ? ' (' + dateTimeL(S.syncedAt) + ')' : '') + '</div></div>';
    h += '<main id="main">' + view() + '</main>' + floaters() + bottomBar() + '<div id="drawer">' + drawer() + '</div><div id="modal">' + modalHtml() + '</div><div class="toasts" id="toasts"></div>';
    root.innerHTML = h;
    document.body.classList.toggle('lock', !!(S.modal || S.drawer));
    if (S.route === 'products' || S.route === 'offers') { renderResults(); const on = document.querySelector('#chips .chip.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' }); if (S.focusQ) { S.focusQ = false; const q = $('#q'); if (q) q.focus(); } }
  } catch (err) {
    console.error(err);
    $('#root').innerHTML = '<div class="wrap"><div class="empty"><b>Something went wrong.</b><p>' + esc(err && err.message) + '</p><button class="btn pri" onclick="location.hash=\'home\';location.reload()">Reload</button></div></div>';
  }
}
function refreshCards() { const y = window.scrollY; if (S.route === 'products' || S.route === 'offers') { renderResults(); const fl = document.querySelectorAll('.cobar,.wafab'); fl.forEach(x => x.remove()); $('#main').insertAdjacentHTML('afterend', floaters()); updateBadges(); } else render(); window.scrollTo(0, y); }
function updateBadges() { const bc = basketCount(); document.querySelectorAll('.ib.bk, .bnav [data-nav="basket"]').forEach(b => { let i = b.querySelector('.badge'); if (!bc) { if (i) i.remove(); return; } if (!i) { i = document.createElement('i'); i.className = 'badge'; b.appendChild(i); } i.textContent = bc; }); }

/* ====================================================================
   ACTIONS (one place for every tap)
   ==================================================================== */
const ACT = {
  'wel-close': () => closeWelcome(),
  snd: () => { LS.set('tapSound', !soundOn()); render(); },
  menu: () => { play('drip', 0.8); S.drawer = true; $('#drawer').innerHTML = drawer(); document.body.classList.add('lock'); },
  'menu-close': () => { S.drawer = false; $('#drawer').innerHTML = ''; document.body.classList.toggle('lock', !!S.modal); },
  lang: () => { S.modal = { type: 'lang' }; renderModal(); },
  'set-lang': a => { LANG = a.dataset.v; LS.set('lang', LANG); S.modal = null; render(); },
  'go-search': () => { S.focusQ = true; nav('products'); },
  'clear-q': () => { S.q = ''; S.shown = PAGE; const q = $('#q'); if (q) { q.value = ''; q.focus(); } const x = $('.sx'); if (x) x.remove(); renderResults(); },
  tog: a => { const k = a.dataset.v; S[k] = !S[k]; S.shown = PAGE; a.classList.toggle('on', S[k]); a.innerHTML = (S[k] ? icon('check') : '') + (k === 'instock' ? t('inStockOnly') : t('activeOffers')); renderResults(); },
  'reset-f': () => { S.q = ''; S.instock = false; S.onlyOffers = false; S.brand = 'all'; S.sort = 'rec'; render(); },
  more: () => { S.shown += PAGE; renderResults(); },
  item: a => { play('drip', 0.7); S.modal = { type: 'item', code: a.dataset.code, qty: 1 }; renderModal(); },
  inc: a => { const had = inBasketQty(a.dataset.code); if (addToBasket(a.dataset.code, 1)) { play('splash'); if (!had) toast('💧 ' + t('added')); } refreshCards(); },
  dec: a => { const i = S.basket.findIndex(l => l.code === a.dataset.code); if (i < 0) return; if (S.basket[i].qty > 1) S.basket[i].qty -= 1; else S.basket.splice(i, 1); saveBasket(); refreshCards(); },
  'm-dec': () => { S.modal.qty = Math.max(1, (parseInt(($('#mqty') || {}).value, 10) || 1) - 1); renderModal(); },
  'm-inc': () => { const it = BY.get(S.modal.code); const cur = parseInt(($('#mqty') || {}).value, 10) || 1; if (cur >= capOf(it) - inBasketQty(it.code)) { toast(t('maxReached')); return; } S.modal.qty = cur + 1; renderModal(); },
  'm-add': () => { const q = parseInt(($('#mqty') || {}).value, 10) || 1; if (addToBasket(S.modal.code, q)) { play('splash'); toast('💧 ' + t('added')); } S.modal = null; refreshCards(); renderModal(); },
  close: closeModal, bg: (a, e) => { if (e.target === a) closeModal(); },
  yes: () => { const f = S._yes; S.modal = null; if (f) f(); render(); },
  'b-dec': a => { const i = +a.dataset.i; if (S.basket[i].qty <= 1) return; setQty(i, S.basket[i].qty - 1); render(); },
  'b-inc': a => { const i = +a.dataset.i; setQty(i, S.basket[i].qty + 1); render(); },
  'b-rm': a => { S.basket.splice(+a.dataset.i, 1); saveBasket(); render(); },
  'b-clear': () => { S._yes = () => { S.basket = []; saveBasket(); }; S.modal = { type: 'confirm', title: t('emptyQ') }; renderModal(); },
  accept: () => { const c = computeOrder(S.basket, BY, OFFERS); S.basket = c.lines.filter(l => l.qty > 0).map(l => ({ code: l.code, wh: 'ALL', qty: l.qty, priceAtAdd: l.unitEx, offerAtAdd: l.offerId || null })); saveBasket(); render(); },
  send: () => sendOrder(), pdf: () => downloadSheet(S.lastOrder), 'sheet-dl': () => downloadSheet(S.sheetOrder),
  'new-order': () => { S.lastOrder = null; nav('products'); },
  login: () => doLogin(),
  guest: () => { S.wantLogin = false; SESSION = { role: 'guest', code: 'GUEST' }; OWNER = false; LS.set('session', SESSION); loadProfile(); loadBasket(); if (DATA) applyData(DATA); nav('home'); },
  'to-login': () => { saveBasket(); S.wantLogin = true; SESSION = null; OWNER = false; LS.set('session', null); S.basket = []; S.modal = null; location.hash = 'home'; render(); },
  logout: () => { const n = basketCount(); if (n && !confirm(t('keepBasketQ', { n }))) return; saveBasket(); S.wantLogin = true; SESSION = null; OWNER = false; LS.set('session', null); LS.del('adm.prices'); if (DATA) applyData(DATA); S.basket = []; S.profile = {}; S.lastOrder = null; S.note = ''; S.q = ''; location.hash = 'home'; render(); },
  'pw-change': () => changePw(), 'reset-save': () => saveReset(),
  'reset-continue': () => { SESSION.mustReset = false; LS.set('session', SESSION); S.resetSent = null; nav('home'); showWelcome(true); },
  'admin-reset': () => { const c = ($('#rstdealer') || {}).value; if (!c) { toast(t('chooseDealer'), true); return; } location.href = 'admin.html#reset-' + c; },
  'open-as': () => { const c = ($('#asdealer') || {}).value; if (!c) { toast(t('chooseDealer'), true); return; } SESSION = { role: 'dealer', code: c, viaAdmin: true }; OWNER = false; LS.set('session', SESSION); applyData(DATA); loadProfile(); loadBasket(); S.lastOrder = null; nav('home'); },
  'back-admin': () => { SESSION = { role: 'admin', code: 'E32114' }; OWNER = true; LS.set('session', SESSION); applyData(DATA); loadProfile(); loadBasket(); S.lastOrder = null; nav('account'); },
  'alerts-on': async () => { audioCtx(); ping(); try { if (window.Notification && Notification.permission === 'default') await Notification.requestPermission(); } catch (e) { } LS.set('alerts', true); toast(t('alertsOk')); render(); },
  'alerts-test': () => { audioCtx(); ping(); }
};
let qTimer = 0;
const INPUT = {
  sort: el => { S.sort = el.value; S.shown = PAGE; renderResults(); },
  brand: el => { S.brand = el.value; S.shown = PAGE; renderResults(); },
  'm-qty': el => { const v = parseInt(el.value, 10); if (v > 0) S.modal.qty = v; },
  'b-qty': el => { setQty(+el.dataset.i, el.value); render(); },
  prof: el => {
    S.profile[el.dataset.k] = el.value; LS.set(profKey(), S.profile);
    if (el.dataset.k === 'wa') { const wh = $('#wahint'); if (wh) wh.textContent = normWa(el.value) ? '' : t('waBad'); }
    const b = $('[data-act="send"]'); if (b) { const c = computeOrder(S.basket, BY, OFFERS); b.disabled = !(profileReady() && !c.issues.length && c.qty > 0); const hn = $('#readyhint'); if (hn) hn.textContent = profileReady() ? t('sendHint') : t('fillHint'); }
  },
  note: el => { S.note = el.value; }
};
const LIVE = ['m-qty', 'prof', 'note'];

document.addEventListener('click', e => {
  if (e.target.closest && e.target.closest('#welcome')) { closeWelcome(); return; }   /* tap anywhere closes the greeting */
  const n = e.target.closest('[data-nav]');
  if (n) { e.preventDefault(); nav(n.dataset.nav); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const fn = ACT[a.dataset.act]; if (!fn) return;
  if (a.dataset.act === 'bg') { fn(a, e); return; }
  e.preventDefault();
  try { const r = fn(a, e); if (r && r.catch) r.catch(err => { console.error(err); toast('Error: ' + err.message, true); }); } catch (err) { console.error(err); toast('Error: ' + err.message, true); }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.classList && el.classList.contains('en')) { const v = el.value, c = v.replace(/[^\x20-\x7E]/g, ''); if (c !== v) { el.value = c; toast('Please use English letters only.'); } }
  if (el.id === 'lu') { const w = $('#dcwrap'); if (w) w.classList.toggle('hide', !ADMIN_USERS.includes(el.value.trim().toUpperCase())); }
  if (el.id === 'q') {
    S.q = el.value; S.shown = PAGE;
    const box = el.parentNode; let x = box.querySelector('.sx');
    if (S.q && !x) box.insertAdjacentHTML('beforeend', '<button class="sx" data-act="clear-q" aria-label="' + esc(t('clear')) + '">' + icon('x') + '</button>'); else if (!S.q && x) x.remove();
    clearTimeout(qTimer); qTimer = setTimeout(renderResults, 120); return;
  }
  const d = el.closest && el.closest('[data-input]'); if (d && LIVE.includes(d.dataset.input)) INPUT[d.dataset.input](d);
});
document.addEventListener('change', e => { const el = e.target.closest('[data-input]'); if (!el) return; const k = el.dataset.input; if (INPUT[k] && (!LIVE.includes(k) || el.tagName === 'SELECT' || el.type === 'date')) INPUT[k](el); });
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'q') { e.target.blur(); return; }
  if (e.key === 'Enter' && e.target.id === 'rp2') { saveReset(); return; }
  if (e.key === 'Enter' && (e.target.id === 'lp' || e.target.id === 'lu' || e.target.id === 'ld')) { if (e.target.id === 'lu') { const p = $('#lp'); if (p) p.focus(); } else doLogin(); return; }
  if (e.key === 'Escape' && document.getElementById('welcome')) { closeWelcome(); return; }
  if (e.key === 'Escape') { if (S.modal) closeModal(); else if (S.drawer) ACT['menu-close'](); }
});
document.addEventListener('pointerdown', () => audioCtx(), { once: true, passive: true });
window.addEventListener('hashchange', () => { S.modal = null; S.drawer = false; render(); window.scrollTo(0, 0); });
window.addEventListener('online', () => { S.online = true; loadData(false); });
window.addEventListener('offline', () => { S.online = false; render(); });
/* new day in Oman -> offers that ended disappear by themselves */
function dayCheck() { if (DATA && muscatToday() !== TODAY) { applyData(DATA); softRender(); } }
document.addEventListener('visibilitychange', () => { if (!document.hidden) { dayCheck(); loadData(false); } });
setInterval(() => { dayCheck(); if (!document.hidden && navigator.onLine) loadData(false); }, 90000);

/* ---------- start: show the saved copy at once, then refresh from the server ---------- */
(function start() {
  const c = LS.get('data', null);
  if (c && c.stock) { applyData(c); S.syncedAt = LS.get('syncedAt', null); S.loading = false; }
  render();
  if (DEALERS.length) showWelcome(false); else S.welcomePending = true;   /* first open: greet once the dealer list (name) is loaded */
  loadData(true);
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => { });
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloaded || S.route === 'checkout' || S.route === 'order') return; reloaded = true; location.reload(); });
  }
})();
