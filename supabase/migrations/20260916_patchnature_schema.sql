-- ==========================================================
-- PatchNature Database Schema Migration
-- ==========================================================

-- 1. Table: settings (Singleton id=1)
DROP TABLE IF EXISTS public.settings CASCADE;

CREATE TABLE public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  phone text NOT NULL DEFAULT '0775691557',
  email text NOT NULL DEFAULT 'contact.patchnature@gmail.com',
  facebook_url text NOT NULL DEFAULT 'https://facebook.com/PatchNature',
  instagram_url text NOT NULL DEFAULT 'https://instagram.com/patch_nature',
  show_inquiry_form boolean NOT NULL DEFAULT true,
  logo_url text,
  hero_image_url text,
  secondary_image_url text,
  CONSTRAINT settings_singleton CHECK (id = 1)
);

INSERT INTO public.settings (id, phone, email, facebook_url, instagram_url, show_inquiry_form)
VALUES (1, '0775691557', 'contact.patchnature@gmail.com', 'https://facebook.com/PatchNature', 'https://instagram.com/patch_nature', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Table: inquiries (Demandes de renseignements & échantillons B2B)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  organization_name text,
  phone text NOT NULL,
  email text,
  wilaya text NOT NULL,
  indicative_quantity integer,
  message text,
  status text NOT NULL DEFAULT 'nouveau'
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for settings (public read, authenticated/anon update with pin gate)
DROP POLICY IF EXISTS "settings_select_all" ON public.settings;
CREATE POLICY "settings_select_all" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "settings_update_all" ON public.settings;
CREATE POLICY "settings_update_all" ON public.settings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "settings_insert_all" ON public.settings;
CREATE POLICY "settings_insert_all" ON public.settings FOR INSERT WITH CHECK (true);

-- Policies for inquiries (public insert, public select/update/delete for dashboard)
DROP POLICY IF EXISTS "inquiries_insert_all" ON public.inquiries;
CREATE POLICY "inquiries_insert_all" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "inquiries_select_all" ON public.inquiries;
CREATE POLICY "inquiries_select_all" ON public.inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "inquiries_update_all" ON public.inquiries;
CREATE POLICY "inquiries_update_all" ON public.inquiries FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "inquiries_delete_all" ON public.inquiries;
CREATE POLICY "inquiries_delete_all" ON public.inquiries FOR DELETE USING (true);

-- 4. Enable Realtime on settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
