# 🚀 Production'a Deploy Etme Rehberi

## ✅ Şu Anda Yapılacaklar

### 1. Main Branch'e Push Et

```bash
git push origin main
```

Bu komut çalıştırıldığında:
- ✅ Vercel otomatik olarak yeni bir deployment başlatacak
- ✅ Build yaklaşık 2-5 dakika sürecek
- ✅ Build başarılı olduğunda `egelibetty.com.tr` domain'inde görünecek

### 2. Vercel Dashboard'da Kontrol Et

1. [Vercel Dashboard](https://vercel.com/dashboard) → Projenize gidin
2. **Deployments** sekmesine bakın
3. Yeni deployment'ın başladığını göreceksiniz
4. Build tamamlanana kadar bekleyin (yeşil checkmark görünene kadar)

### 3. Domain Kontrolü

Build tamamlandıktan sonra:
- ✅ `https://egelibetty.com.tr` adresini açın
- ✅ Değişikliklerin göründüğünü kontrol edin
- ✅ Tarif sayfalarının çalıştığını test edin

## 🔍 Sorun Giderme

### Eğer domain'de hala eski versiyon görünüyorsa:

1. **Browser Cache**: Tarayıcı cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)
2. **DNS Cache**: DNS cache'i temizlenmesi 5-10 dakika sürebilir
3. **Vercel Cache**: Vercel'in CDN cache'i 1-2 dakika içinde güncellenir

### Eğer build hatası varsa:

1. Vercel Dashboard → **Deployments** → Build loglarını kontrol edin
2. Environment variables'ları kontrol edin
3. Hata mesajını okuyun ve düzeltin

## 📝 Notlar

- Vercel otomatik olarak `main` branch'ine push edildiğinde production'a deploy eder
- Preview branch'ler (feature branches) sadece preview URL'lerinde görünür
- Production domain (`egelibetty.com.tr`) sadece `main` branch'ine bağlıdır

