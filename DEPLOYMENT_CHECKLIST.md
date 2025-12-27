# 🚀 Deployment Checklist - Egeli Betty

Bu checklist, tüm iyileştirmelerin production'a deploy edilmesi için gereken adımları içerir.

## ✅ Adım 1: GitHub Pull Request

- [ ] GitHub'da Pull Request açıldı
- [ ] PR'ı review ettim
- [ ] "Merge pull request" butonuna tıkladım
- [ ] "Confirm merge" ile onayladım
- [ ] Feature branch'i sildim (opsiyonel)

## ✅ Adım 2: Local Repository Güncelleme

Terminal'de şu komutları çalıştırın:

```bash
cd /Users/denizsemerci/Desktop/egeli-betty
git checkout main
git pull origin main
```

- [ ] Main branch'e geçtim
- [ ] Latest changes'i pull ettim

## ✅ Adım 3: Vercel Otomatik Deploy

Vercel otomatik olarak deploy başlatacak:

- [ ] Vercel Dashboard'a gittim
- [ ] **Deployments** sekmesine baktım
- [ ] Yeni deployment başladığını gördüm
- [ ] Build tamamlanana kadar bekledim (2-5 dakika)
- [ ] Build başarılı oldu (yeşil checkmark)

**Eğer build hatası varsa:**
- [ ] Build loglarını kontrol ettim
- [ ] Environment variables'ları kontrol ettim
- [ ] Hataları düzelttim

## ✅ Adım 4: Vercel Environment Variables

Vercel Dashboard → **Settings** → **Environment Variables**:

### Yeni Variables (Ekle)

1. **NEXT_PUBLIC_GA_ID**
   - Key: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX` (Google Analytics Measurement ID)
   - Environment: **All Environments** (Production, Preview, Development)
   - [ ] Eklendi

2. **NEXT_PUBLIC_SITE_URL**
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://egelibetty.com.tr`
   - Environment: **All Environments**
   - [ ] Eklendi

### Mevcut Variables (Kontrol)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` mevcut ve doğru
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` mevcut ve doğru

## ✅ Adım 5: Google Analytics Kurulumu

### GA4 Property Oluşturma

1. [Google Analytics](https://analytics.google.com) hesabınıza gidin
2. **Admin** → **Create Property** (veya mevcut property kullanın)
3. Property bilgileri:
   - Property name: "Egeli Betty"
   - Time zone: Türkiye (GMT+3)
   - Currency: TRY
4. **Data Streams** → **Add stream** → **Web**
5. Stream bilgileri:
   - Website URL: `https://egelibetty.com.tr`
   - Stream name: "Egeli Betty Web"
6. Measurement ID'yi kopyalayın (G-XXXXXXXXXX formatında)
7. Vercel'e ekleyin (Adım 4'te)

- [ ] GA4 property oluşturuldu
- [ ] Measurement ID alındı
- [ ] Vercel'e eklendi

## ✅ Adım 6: Redeploy

Environment variables ekledikten sonra:

1. Vercel Dashboard → **Deployments**
2. En son deployment'ın yanındaki **"..."** menüsü
3. **"Redeploy"** seçeneği
4. Build tamamlanana kadar bekleyin

- [ ] Redeploy başlatıldı
- [ ] Build başarılı oldu

## ✅ Adım 7: Test

### Ana Sayfa Testi

- [ ] `https://egelibetty.com.tr` açılıyor
- [ ] Hero section görünüyor
- [ ] Search bar çalışıyor
- [ ] Category pills çalışıyor
- [ ] Recipe cards görünüyor
- [ ] Responsive tasarım çalışıyor (mobil/tablet/desktop)

### Tarif Detay Sayfası Testi

- [ ] Bir tarife tıkladım
- [ ] Tarif detay sayfası açıldı
- [ ] Görsel görünüyor (veya fallback)
- [ ] Malzemeler listesi görünüyor
- [ ] Yapılış adımları görünüyor
- [ ] WhatsApp paylaş butonu çalışıyor

### SEO Testi

- [ ] Browser'da sayfa kaynağını görüntüledim (View Source)
- [ ] Meta tags görünüyor (`<title>`, `<meta name="description">`)
- [ ] Open Graph tags var (`<meta property="og:...">`)
- [ ] Structured data var (`<script type="application/ld+json">`)
- [ ] `https://egelibetty.com.tr/sitemap.xml` çalışıyor
- [ ] `https://egelibetty.com.tr/robots.txt` çalışıyor

### Google Analytics Testi

1. Browser console'u açın (F12)
2. Network tab'ına gidin
3. Sayfayı yenileyin
4. `gtag/js` isteğini kontrol edin

- [ ] Google Analytics script yükleniyor
- [ ] Google Analytics → **Realtime** → **Overview**'da ziyaretçi görünüyor
- [ ] Page view track ediliyor

### Error Handling Testi

- [ ] Var olmayan bir tarif URL'sine gittim (`/tarif/olmayan-tarif`)
- [ ] 404 sayfası göründü
- [ ] Error mesajı kullanıcı dostu

## ✅ Adım 8: Google Search Console (Opsiyonel ama Önerilen)

1. [Google Search Console](https://search.google.com/search-console) hesabınıza gidin
2. **Add Property** → **URL prefix**
3. URL: `https://egelibetty.com.tr`
4. Verification yöntemi seçin (HTML tag, DNS, vs.)
5. Sitemap ekleyin: `https://egelibetty.com.tr/sitemap.xml`

- [ ] Google Search Console property eklendi
- [ ] Site doğrulandı
- [ ] Sitemap gönderildi

## ✅ Adım 9: Final Kontroller

### Performance

- [ ] Lighthouse test yaptım (Chrome DevTools)
- [ ] Performance score: 90+ (hedef)
- [ ] SEO score: 100 (hedef)
- [ ] Accessibility score: 90+ (hedef)

### Cross-Browser Test

- [ ] Chrome'da test ettim
- [ ] Safari'de test ettim
- [ ] Firefox'ta test ettim (opsiyonel)
- [ ] Mobile browser'da test ettim

### Mobile Responsive

- [ ] iPhone'da test ettim (veya responsive mode)
- [ ] iPad'de test ettim
- [ ] Android'de test ettim (opsiyonel)

## 🎉 Tamamlandı!

Tüm adımlar tamamlandığında:

- ✅ Site production'da çalışıyor
- ✅ SEO optimize edildi
- ✅ Google Analytics çalışıyor
- ✅ Error handling çalışıyor
- ✅ UI/UX iyileştirmeleri aktif

## 📊 Monitoring

İlk 24-48 saat içinde:

- [ ] Google Analytics'te veri görünüyor
- [ ] Vercel Analytics'te trafik görünüyor
- [ ] Hata logları kontrol edildi
- [ ] Performance metrikleri normal

## 🆘 Sorun Giderme

### Build hatası varsa:

1. Vercel Dashboard → **Deployments** → Build loglarını kontrol edin
2. Environment variables'ları kontrol edin
3. Local'de test edin: `npm run build`

### Google Analytics çalışmıyorsa:

1. Browser console'da hata var mı kontrol edin
2. `NEXT_PUBLIC_GA_ID` doğru mu kontrol edin
3. GA4 property aktif mi kontrol edin
4. Realtime reports'u kontrol edin (24 saat gecikme olabilir)

### SEO testi başarısızsa:

1. Meta tags var mı kontrol edin (View Source)
2. Structured data doğru mu kontrol edin
3. Sitemap çalışıyor mu kontrol edin
4. Robots.txt çalışıyor mu kontrol edin

