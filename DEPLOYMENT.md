# Deployment Rehberi - egelibetty.com.tr

Bu rehber, Egeli Betty uygulamasını `egelibetty.com.tr` domain'inde çalıştırmak için gereken adımları içerir.

## 🚀 Vercel'e Deploy Etme

### 1. Vercel Hesabı Oluşturma

1. [Vercel](https://vercel.com) adresine gidin
2. "Sign Up" ile GitHub hesabınızla giriş yapın (önerilir)

### 2. Projeyi GitHub'a Yükleme

```bash
# Git repository oluştur
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repository oluştur (egeli-betty)
# Sonra:
git remote add origin https://github.com/KULLANICI_ADINIZ/egeli-betty.git
git branch -M main
git push -u origin main
```

### 3. Vercel'de Proje Oluşturma

1. Vercel Dashboard'a gidin
2. "Add New..." > "Project" tıklayın
3. GitHub repository'nizi seçin (`egeli-betty`)
4. "Import" tıklayın

### 4. Environment Variables Ayarlama

Vercel'de proje ayarlarına gidin ve şu environment variables'ları ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=https://yjqglyhhqnubaedaddwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KaUtTXSYRzRMzl3ZQT2fFg_byVIvbax
```

**Önemli:** Production'da bu değerleri güvenli tutun!

### 5. Build Ayarları

Vercel otomatik olarak Next.js'i algılar. Ekstra ayar gerekmez.

### 6. İlk Deploy

1. "Deploy" butonuna tıklayın
2. Build tamamlanana kadar bekleyin (2-3 dakika)
3. Deploy başarılı olduğunda bir URL alacaksınız: `egeli-betty.vercel.app`

## 🌐 Custom Domain Bağlama (egelibetty.com.tr)

### 1. Vercel'de Domain Ayarlama

1. Vercel Dashboard'da projenize gidin
2. "Settings" > "Domains" sekmesine gidin
3. "Add Domain" butonuna tıklayın
4. `egelibetty.com.tr` yazın ve "Add" tıklayın

### 2. DNS Ayarları (METUnic Panel'de)

Vercel size DNS kayıtlarını verecek. METUnic panel'de şu ayarları yapın:

#### Seçenek 1: Nameserver Kullanma (Önerilen)

METUnic panel'de:
1. "Alan Adı Sunucuları" (Domain Name Servers) bölümüne gidin
2. Vercel'in verdiği nameserver'ları ekleyin:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

#### Seçenek 2: DNS Kayıtları (A ve CNAME)

Eğer nameserver değiştirmek istemiyorsanız:

**A Kaydı:**
- Type: A
- Name: @ (veya boş)
- Value: `76.76.21.21` (Vercel'in IP adresi - güncel olanı kontrol edin)

**CNAME Kaydı:**
- Type: CNAME
- Name: www
- Value: `cname.vercel-dns.com.` (nokta ile bitmeli)

### 3. SSL Sertifikası

Vercel otomatik olarak SSL sertifikası sağlar (Let's Encrypt). 
Domain bağlandıktan sonra birkaç dakika içinde aktif olur.

### 4. Domain Doğrulama

1. Vercel Dashboard'da domain'in durumunu kontrol edin
2. "Valid Configuration" görünene kadar bekleyin (5-30 dakika)
3. `https://egelibetty.com.tr` adresini test edin

## ✅ Deployment Sonrası Kontroller

### 1. Uygulama Testi

- [ ] Ana sayfa açılıyor mu?
- [ ] Tarifler görünüyor mu?
- [ ] Admin girişi çalışıyor mu? (`/admin/yeni-tarif`)
- [ ] Görsel yükleme çalışıyor mu?
- [ ] Tarif ekleme çalışıyor mu?

### 2. Supabase Ayarları

Supabase Dashboard'da:
- [ ] CORS ayarlarını kontrol edin
- [ ] Production URL'ini allowed origins'e ekleyin: `https://egelibetty.com.tr`

### 3. Environment Variables Kontrolü

Vercel Dashboard'da:
- [ ] Tüm environment variables doğru mu?
- [ ] Production ve Preview environment'lar için ayrı ayrı ayarlandı mı?

## 🔄 Güncellemeler

Kod güncellediğinizde:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel otomatik olarak yeni deploy başlatır.

## 📝 Notlar

- Vercel ücretsiz planında sınırsız deploy var
- Custom domain ücretsiz
- SSL otomatik
- CDN otomatik (dünya çapında hızlı erişim)
- Analytics mevcut (Vercel Analytics)

## 🆘 Sorun Giderme

### Domain çalışmıyor
1. DNS propagasyonu 24-48 saat sürebilir
2. `nslookup egelibetty.com.tr` ile DNS kayıtlarını kontrol edin
3. Vercel Dashboard'da domain durumunu kontrol edin

### Build hatası
1. Vercel Dashboard'da "Deployments" sekmesine bakın
2. Build loglarını kontrol edin
3. Environment variables'ları kontrol edin

### Supabase bağlantı hatası
1. CORS ayarlarını kontrol edin
2. Environment variables'ları kontrol edin
3. Supabase projenizin aktif olduğundan emin olun

