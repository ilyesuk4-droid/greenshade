# Velum Commerce Hub

========================================================
  VELUM — FULL LOVABLE PROMPT (React + Supabase)
  نسخ هذا النص كاملاً وألصقه في Lovable
========================================================

Build a complete, production-ready Arabic-language single-product e-commerce store using React + Tailwind CSS + Supabase for a supplement brand called VELUM.

=== BRAND IDENTITY ===
Name: VELUM
Tagline: طبيعي. فعّال. موثوق.
Colors:
  - Gold (primary):   #C9A84C
  - Black (secondary): #1A1A1A
  - White (accent):   #FFFFFF
  - Background:       #F9F7F2 (warm off-white)
Font: Google Fonts "Cairo" for all Arabic text. Apply dir="rtl" globally.

=== PRODUCT INFO ===
Name: VELUM
Subtitle: تركيبة بريبيوتك ومضادات الأكسدة
Description: مكمل غذائي فريد يجمع بين فاكهة التنين والرمان وبذور الكتان لدعم صحة الجهاز الهضمي والأمعاء. غني بمضادات الأكسدة والألياف الطبيعية.
Details: 60 كبسولة • نباتي 100% • خالٍ من GMO • بريبيوتيك طبيعي
Default Price: 2500 DZD

=== SUPABASE SETUP ===
Create the following Supabase tables:

1. TABLE: settings
   - id: integer (primary key, default 1)
   - price: integer (default 2500)
   - phone: text (default '0555000000')
   - facebook_url: text (default 'https://facebook.com/velum')
   - instagram_url: text (default 'https://instagram.com/velum')
   - whatsapp_clicks: integer (default 0)
   - promo_code: text (default 'VELUM10')
   - promo_discount: integer (default 10) — percentage discount
   - promo_active: boolean (default true)
   Initialize with one row (id=1).

2. TABLE: orders
   - id: uuid (primary key, default gen_random_uuid())
   - created_at: timestamptz (default now())
   - customer_name: text (not null)
   - customer_phone: text (not null)
   - wilaya: text (not null)
   - quantity: integer (not null)
   - unit_price: integer (not null)
   - total_price: integer (not null)
   - promo_code_used: text (nullable)
   - discount_applied: integer (default 0)
   - status: text (default 'pending') — values: pending | confirmed | shipped | delivered | cancelled
   - notes: text (nullable)

Use Supabase client (supabase-js) throughout. Load env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

=== ROUTING ===
/ → Landing page (public)
/admin → Admin dashboard (password protected)

=== PAGE 1: LANDING PAGE ===

SECTION 1 — HERO:
- Full-width section with dark background (#1A1A1A) and gold accents
- Large centered product image (use a placeholder amber bottle image or SVG illustration)
- Product name "VELUM" in large Cairo bold, gold color (#C9A84C)
- Subtitle below in white
- Tagline: "طبيعي. فعّال. موثوق."
- Animated CTA button "اطلب الآن" → scrolls to #order section
- Trust badges row: "نباتي 100%", "60 كبسولة", "بدون GMO", "بريبيوتيك طبيعي"

SECTION 2 — LIVE SOCIAL PROOF (top of page, below hero):
- Small animated popup in corner: "أحمد من قسنطينة طلب للتو" — cycle through 5 fake names/cities every 8 seconds using setInterval
- Visitors counter: show a random number between 14–30 "يشاهد هذا المنتج الآن" — updates randomly every 15s

SECTION 3 — COUNTDOWN TIMER:
- Prominent strip: "العرض ينتهي بعد:" with live countdown HH:MM:SS
- Timer resets to 12:00:00 on page load, counts down with setInterval, loops when it hits 0
- Gold background strip, black text

SECTION 4 — BENEFITS:
- 3 cards with icons: "دعم الهضم الصحي", "تقوية المناعة", "طاقة طبيعية"
- Card icons, title, short 2-line description each

SECTION 5 — INGREDIENTS:
- 3 ingredient highlights: Dragon Fruit (فاكهة التنين), Pomegranate (الرمان), Flaxseeds (بذور الكتان)
- Each with icon/illustration, name, and 2-line benefit description

SECTION 6 — HOW TO USE:
- 3 numbered steps horizontally: (1) افتح العلبة (2) تناول كبسولتين (3) مع كأس ماء صباحاً
- Simple icon per step

SECTION 7 — BEFORE/AFTER:
- Two-column layout: قبل الاستخدام vs بعد 30 يوم من الاستخدام
- List of symptoms/improvements with icons (checkmarks vs X marks)

SECTION 8 — TESTIMONIALS:
- 3 cards, each: customer name, wilaya, star rating (5 stars), review text (2–3 lines in Arabic)
- Realistic fake names: سارة م. — تيزي وزو / كريم ب. — الجزائر العاصمة / نور الدين ح. — وهران

SECTION 9 — ORDER SECTION (id="order"):
- Product card showing:
  - Product image
  - Name and description
  - Price loaded live from Supabase settings table (formatted: "2500 دج")
  - Quantity selector (1–10) with + / - buttons
  - Promo code input field with "تطبيق" button
    → On submit: check against settings.promo_code (case-insensitive) and settings.promo_active
    → If valid: show green success message "تم تطبيق الكود! خصم X%" and recalculate total
    → If invalid: show red error "كود الخصم غير صحيح"
  - Total price display (quantity × price - discount)
- ORDER FORM (inline, no redirect to WhatsApp):
  Fields:
    - الاسم الكامل (text, required)
    - رقم الهاتف (tel, required, Algerian format validation)
    - الولاية (select dropdown — all 58 Algerian wilayas list)
    - ملاحظات (textarea, optional)
  Submit button: "تأكيد الطلب" (gold background)
  On submit:
    → Validate all required fields
    → Insert new row into Supabase orders table with all order details
    → Show success modal: "تم استلام طلبك! سيتصل بك فريقنا قريباً. رقم الطلب: #XXXX"
    → Reset form

SECTION 10 — CONTACT (id="contact"):
- Title: "تواصل معنا"
- Phone number displayed prominently (loaded from Supabase settings), with phone icon
- Three social buttons: Facebook (blue), Instagram (gradient pink/orange), WhatsApp (green)
- All links loaded from Supabase settings, open in new tab
- WhatsApp button also increments whatsapp_clicks in Supabase when clicked

SECTION 11 — FOOTER:
- Brand name + tagline
- Social links
- Copyright line: "© 2024 VELUM. جميع الحقوق محفوظة."

=== PAGE 2: ADMIN DASHBOARD (/admin) ===

PASSWORD GATE:
- Full-screen centered login form
- Input for password + "دخول" button
- Default password: "velum2024" (check against hardcoded value or Supabase)
- Store auth state in sessionStorage (cleared when tab closes)
- Show error message if wrong password

AFTER LOGIN — DASHBOARD LAYOUT:
- Sidebar navigation (right side, RTL) with items:
  - لوحة التحكم (home/overview)
  - الطلبات
  - الإعدادات
  - كود الخصم
- Top bar with "VELUM Admin" title and logout button

TAB 1 — OVERVIEW (لوحة التحكم):
- 4 metric cards:
  - إجمالي الطلبات (count of all orders)
  - طلبات اليوم (count of today's orders)
  - إجمالي المبيعات (sum of total_price for confirmed/delivered orders, formatted with دج)
  - نقرات واتساب (whatsapp_clicks from settings)
- Orders by status chart: simple horizontal bar or count badges for pending/confirmed/shipped/delivered/cancelled
- Recent 5 orders table: customer_name, wilaya, quantity, total_price, status, created_at

TAB 2 — ORDERS (الطلبات):
- Full orders table with all columns: الاسم، الهاتف، الولاية، الكمية، السعر الإجمالي، كود الخصم، الحالة، التاريخ
- Status dropdown per row to update order status live in Supabase
- Search/filter by: name, phone, wilaya, status
- Sort by date (newest first by default)

TAB 3 — SETTINGS (الإعدادات):
- Card: تعديل السعر — number input + Save button → updates settings.price in Supabase
- Card: رقم الهاتف — text input + Save button → updates settings.phone
- Card: روابط التواصل — two inputs (Facebook URL, Instagram URL) + Save button
- All changes reflect live on landing page (use React Context or Supabase realtime subscription)
- Show toast notification "تم الحفظ بنجاح ✓" on successful save

TAB 4 — PROMO CODE (كود الخصم):
- Toggle switch: تفعيل / تعطيل كود الخصم → updates settings.promo_active
- Text input: كود الخصم (e.g. "VELUM10") → updates settings.promo_code
- Number input: نسبة الخصم % (1–100) → updates settings.promo_discount
- Live preview: "الكود الحالي: VELUM10 — خصم 10%"
- Save button → update all three fields in Supabase at once
- Usage counter: كم مرة تم استخدام الكود (count of orders where promo_code_used is not null)

=== STATE MANAGEMENT ===
- Use React Context (StoreContext) to hold: price, phone, facebook_url, instagram_url, promo_code, promo_discount, promo_active
- On app load: fetch settings row from Supabase and populate context
- Admin saves update Supabase AND context simultaneously so landing page reflects instantly without reload
- Use Supabase Realtime subscription on settings table as fallback

=== TECH STACK ===
- React 18 + Vite
- Tailwind CSS (RTL plugin)
- React Router v6
- Supabase JS client (@supabase/supabase-js)
- Cairo font from Google Fonts
- All text in Arabic, dir="rtl" on <html>
- Responsive: mobile-first, works perfectly on 375px screens
- No WhatsApp redirect for order form — orders go directly to Supabase

=== DEFAULT VALUES IN SUPABASE settings ROW (id=1) ===
price: 2500
phone: "0555000000"
facebook_url: "https://facebook.com/velum"
instagram_url: "https://instagram.com/velum"
whatsapp_clicks: 0
promo_code: "VELUM10"
promo_discount: 10
promo_active: true

=== ALGERIAN WILAYAS LIST (use for order form dropdown) ===
أدرار، الشلف، الأغواط، أم البواقي، باتنة، بجاية، بسكرة، بشار، البليدة، البويرة، تمنراست، تبسة، تلمسان، تيارت، تيزي وزو، الجزائر، الجلفة، جيجل، سطيف، سعيدة، سكيكدة، سيدي بلعباس، عنابة، قالمة، قسنطينة، المدية، مستغانم، المسيلة، معسكر، ورقلة، وهران، البيض، إليزي، برج بوعريريج، بومرداس، الطارف، تندوف، تيسمسيلت، الوادي، خنشلة، سوق أهراس، تيبازة، ميلة، عين الدفلى، النعامة، عين تيموشنت، غرداية، غليزان، تيميمون، برج باجي مختار، أولاد جلال، بني عباس، عين صالح، عين قزام، تقرت، جانت، المغير، المنيعة

=== IMPORTANT UX DETAILS ===
- Show loading spinner while fetching from Supabase
- All form validation with Arabic error messages
- Smooth scroll behavior for anchor links
- Mobile hamburger menu for landing page nav (if any)
- Admin sidebar collapses to icons on mobile
- Use optimistic UI updates in admin — update UI immediately, then sync to Supabase
- Success/error toasts for all admin actions (bottom-left corner, 3s duration)
- Order success modal includes order ID and "شارك على واتساب" optional button
========================================================
END OF PROMPT
========================================================

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://velum-ecom.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0bd73f26-2f3c-48f9-94b2-c17d85e9e235).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
