# Git Push Çözüm Rehberi

## 🔐 Authentication Sorunu

Git push yaparken `403 Permission denied` hatası alıyorsunuz. İşte çözüm yolları:

## ✅ Çözüm 1: GitHub Desktop (EN KOLAY)

1. [GitHub Desktop](https://desktop.github.com) indirin ve kurun
2. GitHub hesabınızla giriş yapın
3. Repository'yi açın: `File` → `Add Local Repository` → `/Users/denizsemerci/Desktop/egeli-betty`
4. Değişiklikleri görün
5. Commit mesajı yazın: `"fix: Fix Recipe type definition in seo.ts for build"`
6. **"Push origin"** butonuna tıklayın

## ✅ Çözüm 2: Personal Access Token

### Adım 1: Token Oluştur

1. GitHub'a gidin: https://github.com
2. Sağ üst köşe → **Settings**
3. Sol menüden **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token (classic)**
6. Token bilgileri:
   - **Note**: "Egeli Betty Push"
   - **Expiration**: 90 days (veya istediğiniz süre)
   - **Select scopes**: ✅ **repo** (tüm alt seçenekler)
7. **Generate token** butonuna tıklayın
8. **Token'ı kopyalayın** (bir daha gösterilmeyecek!)

### Adım 2: Token ile Push

Terminal'de:

```bash
cd /Users/denizsemerci/Desktop/egeli-betty
git push origin main
```

İstendiğinde:
- **Username**: `denizsemerci`
- **Password**: Token'ı yapıştırın (şifre değil!)

## ✅ Çözüm 3: Credential Helper Temizleme

Eğer eski credentials cache'lenmişse:

```bash
# macOS Keychain'den eski credentials'ı temizle
git credential-osxkeychain erase
host=github.com
protocol=https
# (Enter iki kez basın)

# Sonra tekrar push deneyin
cd /Users/denizsemerci/Desktop/egeli-betty
git push origin main
```

## ✅ Çözüm 4: SSH Key Kurulumu (İleri Seviye)

### SSH Key Oluştur

```bash
# SSH key oluştur
ssh-keygen -t ed25519 -C "your_email@example.com"

# Public key'i kopyala
cat ~/.ssh/id_ed25519.pub
```

### GitHub'a SSH Key Ekle

1. GitHub → **Settings** → **SSH and GPG keys**
2. **New SSH key**
3. **Title**: "MacBook" (veya istediğiniz isim)
4. **Key**: Kopyaladığınız public key'i yapıştırın
5. **Add SSH key**

### Remote URL'i Değiştir

```bash
cd /Users/denizsemerci/Desktop/egeli-betty
git remote set-url origin git@github.com:denizsemerci/egeli-betty.git
git push origin main
```

## 🎯 Önerilen Yöntem

**GitHub Desktop** en kolay ve güvenli yöntemdir. Özellikle:
- ✅ Otomatik authentication
- ✅ Görsel arayüz
- ✅ Commit history görüntüleme
- ✅ Branch yönetimi kolay

## 📝 Notlar

- Personal Access Token'ları güvenli tutun
- Token'ları düzenli olarak yenileyin
- Public repository'ler için token gerekmez, private için gerekir

## 🆘 Hala Çalışmıyorsa

1. GitHub hesabınızın repository'ye erişim yetkisi olduğundan emin olun
2. Repository'nin private/public durumunu kontrol edin
3. GitHub'da repository ayarlarını kontrol edin

