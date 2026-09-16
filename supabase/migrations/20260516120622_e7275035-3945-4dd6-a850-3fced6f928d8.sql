
CREATE TABLE public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  price integer NOT NULL DEFAULT 2500,
  phone text NOT NULL DEFAULT '0555000000',
  facebook_url text NOT NULL DEFAULT 'https://facebook.com/velum',
  instagram_url text NOT NULL DEFAULT 'https://instagram.com/velum',
  whatsapp_clicks integer NOT NULL DEFAULT 0,
  promo_code text NOT NULL DEFAULT 'VELUM10',
  promo_discount integer NOT NULL DEFAULT 10,
  promo_active boolean NOT NULL DEFAULT true,
  CONSTRAINT settings_singleton CHECK (id = 1)
);

INSERT INTO public.settings (id) VALUES (1);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  wilaya text NOT NULL,
  quantity integer NOT NULL,
  unit_price integer NOT NULL,
  total_price integer NOT NULL,
  promo_code_used text,
  discount_applied integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public storefront (no auth). Admin gate is in-app.
CREATE POLICY "settings_select_all" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_update_all" ON public.settings FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "orders_insert_all" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_all" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_update_all" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
