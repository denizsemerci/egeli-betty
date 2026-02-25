# Çoklu fotoğraf (Tarifi Kaydet) – Supabase kurulumu

Admin panelinde tarife **birden fazla fotoğraf** ekleyip **Tarifi Kaydet**’e bastığında kayıt olmuyorsa veya “column 'images' does not exist” benzeri bir hata görüyorsan, `recipes` tablosuna `images` sütununun eklenmesi gerekir.

## Ne yapmalısın?

1. **Supabase Dashboard**’a gir: [supabase.com](https://supabase.com) → projeni seç.
2. Sol menüden **SQL Editor**’ı aç.
3. **New query** ile yeni bir sorgu aç.
4. Projedeki **`supabase/add-images-field.sql`** dosyasını aç, içeriğinin **tamamını** kopyala ve SQL Editor’e yapıştır.
5. **Run** (veya Ctrl+Enter / Cmd+Enter) ile çalıştır.
6. Başarılı mesajından sonra admin panelinde tekrar **Tarifi Kaydet**’i dene; çoklu fotoğraflı tarif kaydı çalışmalı.

Bu işlemi **sadece bir kez** yapman yeterli.
