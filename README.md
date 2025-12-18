# Egeli Betty - Ege Mutfağı Tarifleri

Sıcacık, ev yapımı Ege mutfağı tarifleri paylaşım sitesi. Annenin elinden çıkmış gibi sıcak ve samimi bir deneyim.

## 🚀 Özellikler

- **Herkese Açık Tarif Görüntüleme**: Tüm tarifler herkes tarafından görüntülenebilir
- **Admin-Only Tarif Ekleme**: Sadece belirlenen admin kullanıcı tarif ekleyebilir/düzenleyebilir
- **Kategori Filtreleme**: Zeytinyağlılar, Hamur İşi, Tatlılar vb. kategorilere göre filtreleme
- **Arama Özelliği**: Tarif başlığı ve açıklamasında arama yapabilme
- **Malzeme Listesi**: Checkbox'lı malzeme listesi (yaparken işaretleme için)
- **Adım Adım Talimatlar**: Numaralandırılmış yapılış adımları
- **WhatsApp Paylaşımı**: Tarifleri WhatsApp üzerinden paylaşma
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS (Özel Ege temalı renkler)
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod

## 📋 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAIL=your_mother_email@example.com
```

### 3. Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. SQL Editor'de `supabase/schema.sql` dosyasındaki SQL'i çalıştırın
4. Storage'da `recipe-images` bucket'ının oluşturulduğundan emin olun

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
egeli-betty/
├── app/
│   ├── admin/
│   │   └── yeni-tarif/     # Admin tarif ekleme sayfası (wizard form)
│   ├── giris/              # Giriş sayfası
│   ├── tarif/
│   │   └── [slug]/         # Tarif detay sayfası
│   ├── globals.css         # Global stiller ve fontlar
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Ana sayfa
├── components/
│   ├── CategoryPills.tsx   # Kategori filtreleme
│   ├── Footer.tsx          # Footer bileşeni
│   ├── Header.tsx          # Header bileşeni
│   ├── IngredientsList.tsx # Malzeme listesi (checkbox'lı)
│   ├── InstructionsList.tsx # Yapılış adımları
│   ├── RecipeCard.tsx      # Tarif kartı
│   ├── SearchBar.tsx       # Arama çubuğu
│   └── ShareButton.tsx     # WhatsApp paylaşım butonu
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   └── server.ts       # Server Supabase client
│   └── utils.ts            # Yardımcı fonksiyonlar
├── middleware.ts           # Auth middleware (admin kontrolü)
├── supabase/
│   └── schema.sql          # Veritabanı şeması
└── tailwind.config.ts      # Tailwind özel konfigürasyonu
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: `#7D9D5B` (Zeytin Yeşili)
- **Secondary**: `#A8DADC` (Yumuşak Mavi)
- **Background**: `#FAF9F6` (Krem/Beyazımsı)
- **Text**: `#4A403A` (Koyu Kahverengi)
- **Surface**: `#FFFFFF` (Beyaz)

### Fontlar
- **Başlıklar**: Playfair Display
- **Gövde Metni**: Nunito

## 🔐 Authentication

- Supabase Auth kullanılarak Magic Link ile giriş yapılır
- Sadece `ADMIN_EMAIL` environment variable'ında belirtilen e-posta adresine sahip kullanıcı admin sayfalarına erişebilir
- Middleware tüm `/admin` rotalarını korur

## 📝 Admin Özellikleri

Admin kullanıcı:
- `/admin/yeni-tarif` sayfasına erişebilir
- 4 adımlı wizard form ile tarif ekleyebilir:
  1. Genel Bilgiler (Başlık, Açıklama, Kategori, Süre, Porsiyon)
  2. Malzemeler (Dinamik liste)
  3. Yapılış Adımları (Dinamik liste)
  4. Fotoğraf Yükleme (İsteğe bağlı)

## 🗄️ Veritabanı Şeması

`recipes` tablosu:
- `id`: UUID (Primary Key)
- `title`: TEXT
- `slug`: TEXT (Unique)
- `description`: TEXT
- `category`: TEXT
- `prep_time`: INTEGER
- `servings`: INTEGER
- `ingredients`: JSONB (string array)
- `steps`: JSONB (string array)
- `image_url`: TEXT (nullable)
- `user_email`: TEXT
- `created_at`: TIMESTAMP

## 🚢 Deployment

### Vercel

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınızla giriş yapın
3. Yeni proje oluşturun ve GitHub repo'nuzu bağlayın
4. Environment variables'ları ekleyin
5. Deploy edin

## 📄 Lisans

Bu proje kişisel kullanım içindir.

## 💝 Notlar

- Tüm UI metinleri Türkçe'dir
- Ton sıcak, samimi ve annenin elinden çıkmış gibi tasarlanmıştır
- Mobil-first yaklaşım ile responsive tasarım uygulanmıştır

