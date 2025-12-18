# Egeli Betty - Kurulum Rehberi

## Hızlı Başlangıç

### 1. Projeyi Klonlayın ve Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Projesi Oluşturun

1. [Supabase](https://supabase.com) hesabı oluşturun veya giriş yapın
2. "New Project" butonuna tıklayın
3. Proje bilgilerini doldurun ve oluşturun
4. Proje oluşturulduktan sonra:
   - **Settings** > **API** bölümünden `URL` ve `anon public` key'i kopyalayın

### 3. Environment Variables Ayarlayın

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_EMAIL=your-mother-email@example.com
```

### 4. Veritabanı Şemasını Oluşturun

1. Supabase Dashboard'da **SQL Editor**'e gidin
2. `supabase/schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'de yapıştırın ve **Run** butonuna tıklayın
4. Başarılı olduğunu doğrulayın

### 5. Storage Bucket Oluşturun

1. Supabase Dashboard'da **Storage** bölümüne gidin
2. **New bucket** butonuna tıklayın
3. Bucket adı: `recipe-images`
4. **Public bucket** seçeneğini işaretleyin
5. **Create bucket** butonuna tıklayın

**Not:** SQL şeması bucket'ı otomatik oluşturur, ancak manuel kontrol etmek isterseniz yukarıdaki adımları takip edebilirsiniz.

### 6. Authentication Ayarları

1. Supabase Dashboard'da **Authentication** > **URL Configuration** bölümüne gidin
2. **Redirect URLs** kısmına şunu ekleyin:
   ```
   http://localhost:3000/auth/callback
   ```
3. Production için de ekleyin (örnek):
   ```
   https://your-domain.com/auth/callback
   ```

### 7. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## İlk Giriş

1. Ana sayfada footer'daki **Giriş** linkine tıklayın
2. Admin e-posta adresini girin (`ADMIN_EMAIL` environment variable'ında belirttiğiniz)
3. E-postanızı kontrol edin ve giriş bağlantısına tıklayın
4. Otomatik olarak `/admin/yeni-tarif` sayfasına yönlendirileceksiniz

## İlk Tarifi Ekleme

1. `/admin/yeni-tarif` sayfasında wizard form'u doldurun:
   - **Adım 1**: Genel bilgiler (başlık, açıklama, kategori, süre, porsiyon)
   - **Adım 2**: Malzemeler (dinamik liste)
   - **Adım 3**: Yapılış adımları (dinamik liste)
   - **Adım 4**: Fotoğraf (isteğe bağlı)
2. **Tarifi Kaydet** butonuna tıklayın
3. Tarif otomatik olarak ana sayfada görünecektir

## Sorun Giderme

### "Yetkiniz yok" hatası alıyorum
- `ADMIN_EMAIL` environment variable'ının doğru ayarlandığından emin olun
- Giriş yaptığınız e-posta adresinin `ADMIN_EMAIL` ile tam olarak eşleştiğinden emin olun

### Fotoğraf yüklenmiyor
- Supabase Storage'da `recipe-images` bucket'ının oluşturulduğundan emin olun
- Bucket'ın public olduğundan emin olun
- Storage policies'in doğru ayarlandığından emin olun (SQL şeması bunları otomatik oluşturur)

### Veritabanı bağlantı hatası
- `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` değerlerinin doğru olduğundan emin olun
- Supabase projenizin aktif olduğundan emin olun

## Production Deployment

### Vercel

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınızla giriş yapın
3. **New Project** > GitHub repo'nuzu seçin
4. Environment variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
5. **Deploy** butonuna tıklayın
6. Deployment tamamlandıktan sonra Supabase Dashboard'da production URL'inizi redirect URLs'e ekleyin

## Güvenlik Notları

- `ADMIN_EMAIL` environment variable'ını asla commit etmeyin (`.gitignore` içinde)
- Supabase RLS (Row Level Security) policies aktif
- Middleware tüm admin rotalarını korur
- Storage policies sadece authenticated kullanıcılara upload izni verir

