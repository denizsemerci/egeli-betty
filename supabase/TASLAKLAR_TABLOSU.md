# Taslaklar tablosu (drafts) – Supabase kurulumu

Admin panelindeki **Taslaklar** sayfası `drafts` tablosunu kullanır. "Taslaklar yüklenirken bir hata oluştu" hatası alıyorsan bu tablo henüz oluşturulmamış demektir.

## Ne yapmalısın?

1. **Supabase Dashboard**’a gir: [supabase.com](https://supabase.com) → projeni seç.
2. Sol menüden **SQL Editor**’ı aç.
3. **New query** ile yeni bir sorgu aç.
4. Projedeki **`supabase/add-drafts-table.sql`** dosyasını aç, içeriğinin **tamamını** kopyala ve SQL Editor’e yapıştır.
5. **Run** (veya Ctrl+Enter / Cmd+Enter) ile çalıştır.
6. "Success" mesajını gördükten sonra admin panelindeki Taslaklar sayfasını yenile; hata kaybolmalı ve liste (şimdilik boş) görünmeli.

Bu işlemi projede **sadece bir kez** yapman yeterli. Tablo bir kez oluştuktan sonra taslak kaydetme ve listeleme çalışır.
