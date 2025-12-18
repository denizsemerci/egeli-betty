-- Production schema for Egeli Betty
-- Client-side authentication kullanıldığı için RLS policy'leri herkesin insert yapmasına izin veriyor
-- Admin kontrolü client-side'da yapılıyor (betül/123)

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
DROP POLICY IF EXISTS "Only authenticated users can insert recipes" ON public.recipes;
DROP POLICY IF EXISTS "Anyone can insert recipes" ON public.recipes;
DROP POLICY IF EXISTS "Only authenticated users can update recipes" ON public.recipes;
DROP POLICY IF EXISTS "Anyone can update recipes" ON public.recipes;
DROP POLICY IF EXISTS "Only authenticated users can delete recipes" ON public.recipes;
DROP POLICY IF EXISTS "Anyone can delete recipes" ON public.recipes;

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read recipes (public access)
CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes FOR SELECT
  USING (true);

-- Policy: Anyone can insert recipes (admin kontrolü client-side'da yapılıyor)
CREATE POLICY "Anyone can insert recipes"
  ON public.recipes FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update recipes (admin kontrolü client-side'da yapılıyor)
CREATE POLICY "Anyone can update recipes"
  ON public.recipes FOR UPDATE
  USING (true);

-- Policy: Anyone can delete recipes (admin kontrolü client-side'da yapılıyor)
CREATE POLICY "Anyone can delete recipes"
  ON public.recipes FOR DELETE
  USING (true);

-- Create storage bucket for recipe images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Drop existing ones
DROP POLICY IF EXISTS "Recipe images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only admin can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only admin can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only admin can delete recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can delete recipe images" ON storage.objects;

-- Storage policy: Anyone can view images
CREATE POLICY "Recipe images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

-- Storage policy: Anyone can upload images (admin kontrolü client-side'da yapılıyor)
CREATE POLICY "Anyone can upload recipe images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recipe-images');

-- Storage policy: Anyone can update images
CREATE POLICY "Anyone can update recipe images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'recipe-images');

-- Storage policy: Anyone can delete images
CREATE POLICY "Anyone can delete recipe images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'recipe-images');

