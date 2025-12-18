-- Storage bucket oluştur ve policy'leri ayarla

-- Önce bucket'ı oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Mevcut policy'leri temizle
DROP POLICY IF EXISTS "Recipe images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Only authenticated users can delete recipe images" ON storage.objects;

-- Yeni storage policy'leri: Herkes upload edebilir (public bucket)
CREATE POLICY "Recipe images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can upload recipe images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can update recipe images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can delete recipe images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'recipe-images');

