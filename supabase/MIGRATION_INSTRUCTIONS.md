# Supabase Migration: Çoklu Fotoğraf Desteği

## 🎯 Ne Yapılacak?

`recipes` tablosuna `images` adında yeni bir TEXT array field ekleniyor. Bu sayede her tarif için birden fazla fotoğraf saklanabilecek.

## 📋 Adımlar

### 1. Supabase Dashboard'a Git

1. [Supabase Dashboard](https://app.supabase.com/) → Projeni seç
2. Sol menüden **SQL Editor**'a tıkla

### 2. Migration SQL'ini Çalıştır

`supabase/add-images-field.sql` dosyasındaki SQL'i kopyala ve SQL Editor'da çalıştır:

```sql
-- Add images column as TEXT array (nullable, defaults to NULL)
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Create index on images array for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_images ON recipes USING GIN (images);

-- Optional: Migrate existing image_url values to images array
UPDATE recipes 
SET images = ARRAY[image_url]::TEXT[]
WHERE image_url IS NOT NULL 
  AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Add comment to column for documentation
COMMENT ON COLUMN recipes.images IS 'Array of image URLs for the recipe. First image is also stored in image_url for backward compatibility.';
```

### 3. Kontrol Et

Migration başarılı olduktan sonra:

1. **Table Editor** → `recipes` tablosuna git
2. `images` column'unun eklendiğini kontrol et
3. Mevcut tariflerde `image_url` değerlerinin `images` array'ine kopyalandığını kontrol et

## ✅ Beklenen Sonuç

- ✅ `recipes` tablosunda `images TEXT[]` column'u var
- ✅ Mevcut tariflerde `images` array'i dolu (eski `image_url` değerleriyle)
- ✅ Yeni tarifler hem `image_url` hem de `images` array'i ile kaydedilecek

## 🔄 Geriye Dönük Uyumluluk

- Eski tarifler (`image_url` var, `images` yok): Çalışmaya devam edecek
- Yeni tarifler (`images` array var): Çoklu fotoğraf desteği ile çalışacak
- Her iki durumda da frontend kodumuz uyumlu çalışıyor

## ⚠️ Önemli Notlar

1. **IF NOT EXISTS**: Migration güvenli, birden fazla kez çalıştırılabilir
2. **GIN Index**: Array field'lar için performans optimizasyonu
3. **Migration Script**: Mevcut `image_url` değerlerini otomatik olarak `images` array'ine kopyalar

## 🐛 Sorun Giderme

### Hata: "column already exists"
- Normal, `IF NOT EXISTS` sayesinde hata vermez
- Devam edebilirsin

### Hata: "permission denied"
- RLS policy'lerini kontrol et
- Admin yetkilerin olduğundan emin ol

### images array boş görünüyor
- Migration script'i tekrar çalıştır
- Veya manuel olarak kontrol et:
```sql
SELECT id, title, image_url, images FROM recipes LIMIT 5;
```

