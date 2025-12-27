# Vercel Environment Variables Kurulumu

## 📋 Eklenecek Environment Variables

Vercel Dashboard'da **Settings** → **Environment Variables** bölümüne gidin ve şu değişkenleri ekleyin:

### 1. Google Analytics ID (YENİ)

```
Key: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX (Google Analytics 4 Measurement ID)
Environment: Production, Preview, Development (All)
```

**Nasıl alınır:**
1. [Google Analytics](https://analytics.google.com) hesabınıza gidin
2. Yeni bir GA4 property oluşturun (veya mevcut olanı kullanın)
3. **Admin** → **Data Streams** → **Web** → Measurement ID'yi kopyalayın
4. Format: `G-XXXXXXXXXX` şeklinde olmalı

### 2. Site URL (YENİ)

```
Key: NEXT_PUBLIC_SITE_URL
Value: https://egelibetty.com.tr
Environment: Production, Preview, Development (All)
```

### 3. Mevcut Variables (Kontrol Edin)

Aşağıdaki variables zaten var mı kontrol edin:

```
NEXT_PUBLIC_SUPABASE_URL=https://yjqglyhhqnubaedaddwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KaUtTXSYRzRMzl3ZQT2fFg_byVIvbax
```

## ✅ Kontrol Listesi

- [ ] `NEXT_PUBLIC_GA_ID` eklendi
- [ ] `NEXT_PUBLIC_SITE_URL` eklendi
- [ ] `NEXT_PUBLIC_SUPABASE_URL` mevcut
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` mevcut
- [ ] Tüm variables "All Environments" için ayarlandı
- [ ] Yeni bir deployment başlatıldı (Redeploy)

## 🔄 Redeploy

Environment variables ekledikten sonra:

1. Vercel Dashboard'da **Deployments** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. Build tamamlanana kadar bekleyin

## 📊 Google Analytics Kurulumu

### GA4 Property Oluşturma

1. [Google Analytics](https://analytics.google.com) → **Admin** → **Create Property**
2. Property adı: "Egeli Betty"
3. Time zone: Türkiye (GMT+3)
4. Currency: TRY
5. **Data Streams** → **Add stream** → **Web**
6. Website URL: `https://egelibetty.com.tr`
7. Stream name: "Egeli Betty Web"
8. Measurement ID'yi kopyalayın (G-XXXXXXXXXX formatında)

### Enhanced Measurement

GA4'te otomatik olarak şunlar track edilir:
- Page views
- Scrolls
- Outbound clicks
- Site search
- Video engagement
- File downloads

### Custom Events (Opsiyonel - Gelecekte)

İleride şu event'leri ekleyebilirsiniz:
- `recipe_view` - Tarif görüntüleme
- `recipe_search` - Tarif arama
- `category_filter` - Kategori filtreleme
- `share_recipe` - Tarif paylaşma

## 🧪 Test

Deployment tamamlandıktan sonra:

1. `https://egelibetty.com.tr` adresini açın
2. Browser console'u açın (F12)
3. Network tab'ında `gtag/js` isteğini kontrol edin
4. Google Analytics → **Realtime** bölümünde ziyaretçi görünmeli

## 📝 Notlar

- Environment variables değişiklikleri için yeni deployment gerekir
- Google Analytics verileri 24-48 saat içinde tam olarak görünmeye başlar
- Realtime reports anında çalışır
- Production ve Preview environment'lar için ayrı GA4 property kullanabilirsiniz

