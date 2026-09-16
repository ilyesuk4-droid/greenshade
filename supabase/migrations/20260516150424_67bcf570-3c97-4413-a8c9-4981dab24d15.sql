ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS content jsonb NOT NULL DEFAULT '{
  "hero_badge": "VELUM SUPPLEMENTS",
  "hero_title": "VELUM",
  "hero_subtitle": "تركيبة بريبيوتك ومضادات الأكسدة",
  "hero_tagline": "طبيعي. فعّال. موثوق.",
  "hero_description": "مكمل غذائي فريد يجمع فاكهة التنين والرمان وبذور الكتان لدعم صحة الجهاز الهضمي والأمعاء.",
  "hero_cta": "اطلب المنتج الآن",
  "product_name": "VELUM",
  "product_short_desc": "تركيبة بريبيوتك",
  "order_title": "احصل على VELUM إلى باب منزلك",
  "order_subtitle": "الدفع عند الاستلام",
  "footer_tagline": "طبيعي. فعّال. موثوق.",
  "footer_copyright": "© 2024 VELUM. جميع الحقوق محفوظة."
}'::jsonb;

ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS price_30 integer NOT NULL DEFAULT 1500;