-- ==========================================================
-- PatchNature Database Schema Migration
-- Unified, Secure & Complete Schema for PatchNature
-- ==========================================================

-- 1. Table: settings (Singleton id=1)
CREATE TABLE IF NOT EXISTS public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  phone text NOT NULL DEFAULT '0775691557',
  email text NOT NULL DEFAULT 'contact.patchnature@gmail.com',
  facebook_url text NOT NULL DEFAULT 'https://facebook.com/PatchNature',
  instagram_url text NOT NULL DEFAULT 'https://instagram.com/patch_nature',
  show_inquiry_form boolean NOT NULL DEFAULT true,
  logo_url text,
  hero_image_url text,
  secondary_image_url text,
  hero_bg_url text,
  cactus_produit_url text,
  hydrogel_separator_url text,
  utilisation_patch_url text,
  pharmacie_pro_url text,
  CONSTRAINT settings_singleton CHECK (id = 1)
);

-- Ensure all dynamic image columns exist (idempotent for existing databases)
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_bg_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS cactus_produit_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hydrogel_separator_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS utilisation_patch_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS pharmacie_pro_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS secondary_image_url text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS show_inquiry_form boolean NOT NULL DEFAULT true;

-- Default settings seed
INSERT INTO public.settings (
  id,
  phone,
  email,
  facebook_url,
  instagram_url,
  show_inquiry_form
)
VALUES (
  1,
  '0775691557',
  'contact.patchnature@gmail.com',
  'https://facebook.com/PatchNature',
  'https://instagram.com/patch_nature',
  true
)
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

-- Clean up any obsolete/open policies
DROP POLICY IF EXISTS "settings_select_all" ON public.settings;
DROP POLICY IF EXISTS "settings_update_all" ON public.settings;
DROP POLICY IF EXISTS "settings_insert_all" ON public.settings;
DROP POLICY IF EXISTS "settings_select_public" ON public.settings;
DROP POLICY IF EXISTS "settings_update_auth" ON public.settings;
DROP POLICY IF EXISTS "settings_insert_auth" ON public.settings;

DROP POLICY IF EXISTS "inquiries_insert_all" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_select_all" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_update_all" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_delete_all" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_insert_public" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_select_auth" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_update_auth" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_delete_auth" ON public.inquiries;

-- === Policies for `settings` (Passcode-gated admin) ===
CREATE POLICY "settings_select_all" ON public.settings
  FOR SELECT
  USING (true);

CREATE POLICY "settings_update_all" ON public.settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "settings_insert_all" ON public.settings
  FOR INSERT
  WITH CHECK (true);

-- === Policies for `inquiries` (Passcode-gated admin) ===
-- Public can submit B2B inquiries (with basic validation)
CREATE POLICY "inquiries_insert_all" ON public.inquiries
  FOR INSERT
  WITH CHECK (
    length(trim(full_name)) > 0 AND
    length(trim(phone)) >= 8 AND
    length(trim(wilaya)) > 0
  );

CREATE POLICY "inquiries_select_all" ON public.inquiries
  FOR SELECT
  USING (true);

CREATE POLICY "inquiries_update_all" ON public.inquiries
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "inquiries_delete_all" ON public.inquiries
  FOR DELETE
  USING (true);

-- 4. Storage Setup for assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('patchnature-assets', 'patchnature-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "assets_select_all" ON storage.objects;
DROP POLICY IF EXISTS "assets_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "assets_update_all" ON storage.objects;
DROP POLICY IF EXISTS "assets_delete_all" ON storage.objects;
DROP POLICY IF EXISTS "assets_public_select" ON storage.objects;
DROP POLICY IF EXISTS "assets_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "assets_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "assets_auth_delete" ON storage.objects;

CREATE POLICY "assets_select_all" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'patchnature-assets');

CREATE POLICY "assets_insert_all" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'patchnature-assets');

CREATE POLICY "assets_update_all" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'patchnature-assets');

CREATE POLICY "assets_delete_all" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'patchnature-assets');

-- 5. Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'inquiries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
  END IF;
END $$;
