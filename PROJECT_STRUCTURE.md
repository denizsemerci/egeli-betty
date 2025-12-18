# Egeli Betty - Proje Yapısı

## 📁 Dizin Yapısı

```
egeli-betty/
├── app/                          # Next.js App Router
│   ├── admin/
│   │   └── yeni-tarif/
│   │       └── page.tsx         # Admin tarif ekleme wizard formu
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts         # Supabase auth callback handler
│   ├── giris/
│   │   └── page.tsx             # Giriş sayfası (Magic Link)
│   ├── tarif/
│   │   └── [slug]/
│   │       ├── page.tsx         # Tarif detay sayfası
│   │       └── not-found.tsx    # 404 sayfası (tarif bulunamadı)
│   ├── globals.css              # Global CSS ve Tailwind directives
│   ├── layout.tsx               # Root layout (Header + Footer)
│   ├── page.tsx                 # Ana sayfa (Home)
│   └── not-found.tsx            # Genel 404 sayfası
│
├── components/                   # React bileşenleri
│   ├── CategoryPills.tsx        # Kategori filtreleme pill'leri
│   ├── Footer.tsx               # Footer (giriş linki içerir)
│   ├── Header.tsx               # Site başlığı
│   ├── IngredientsList.tsx      # Checkbox'lı malzeme listesi
│   ├── InstructionsList.tsx    # Numaralandırılmış yapılış adımları
│   ├── RecipeCard.tsx          # Tarif kartı (grid item)
│   ├── SearchBar.tsx            # Arama çubuğu
│   └── ShareButton.tsx          # WhatsApp paylaşım butonu
│
├── lib/                         # Yardımcı kütüphaneler
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   └── utils.ts                # Utility fonksiyonlar (slug generation, cn)
│
├── supabase/
│   └── schema.sql              # Veritabanı şeması ve RLS policies
│
├── middleware.ts               # Auth middleware (admin route protection)
├── tailwind.config.ts          # Tailwind özel konfigürasyonu
├── next.config.js              # Next.js konfigürasyonu
├── tsconfig.json               # TypeScript konfigürasyonu
├── package.json                # NPM bağımlılıkları
├── README.md                   # Proje dokümantasyonu
└── SETUP.md                    # Detaylı kurulum rehberi
```

## 🔑 Ana Dosyalar ve Sorumlulukları

### Authentication & Authorization

- **`middleware.ts`**: 
  - Tüm `/admin` rotalarını korur
  - `ADMIN_EMAIL` environment variable ile eşleşen kullanıcıları kontrol eder
  - Yetkisiz erişimleri ana sayfaya yönlendirir

- **`app/auth/callback/route.ts`**: 
  - Supabase Magic Link callback handler
  - Auth code'u session'a çevirir
  - Admin sayfasına yönlendirir

- **`app/giris/page.tsx`**: 
  - Magic Link ile giriş formu
  - E-posta adresine giriş bağlantısı gönderir

### Public Pages

- **`app/page.tsx`**: 
  - Ana sayfa
  - Hero section, kategori filtreleme, tarif grid'i
  - Arama ve kategori filtreleme desteği

- **`app/tarif/[slug]/page.tsx`**: 
  - Tarif detay sayfası
  - Malzeme listesi ve yapılış adımları
  - WhatsApp paylaşım butonu

### Admin Pages

- **`app/admin/yeni-tarif/page.tsx`**: 
  - 4 adımlı wizard form
  - React Hook Form + Zod validation
  - Supabase Storage'a resim yükleme
  - Framer Motion animasyonları

### Components

- **`components/RecipeCard.tsx`**: 
  - Grid layout için tarif kartı
  - Hover animasyonları
  - Responsive tasarım

- **`components/IngredientsList.tsx`**: 
  - Checkbox'lı malzeme listesi
  - Yaparken işaretleme için interaktif

- **`components/InstructionsList.tsx`**: 
  - Numaralandırılmış adımlar
  - Animasyonlu görünüm

### Configuration

- **`tailwind.config.ts`**: 
  - Özel Ege temalı renkler
  - Playfair Display ve Nunito fontları
  - Yumuşak border radius değerleri

- **`lib/supabase/client.ts`**: 
  - Browser-side Supabase client
  - Client components için

- **`lib/supabase/server.ts`**: 
  - Server-side Supabase client
  - Server components ve API routes için

### Database

- **`supabase/schema.sql`**: 
  - `recipes` tablosu şeması
  - RLS (Row Level Security) policies
  - Storage bucket ve policies
  - Index'ler (performans için)

## 🎨 Tasarım Sistemi

### Renkler (Tailwind Config)
- `primary`: `#7D9D5B` - Zeytin yeşili (ana aksiyonlar)
- `secondary`: `#A8DADC` - Yumuşak mavi (vurgular)
- `background`: `#FAF9F6` - Krem/beyazımsı (arka plan)
- `text`: `#4A403A` - Koyu kahverengi (metin)
- `surface`: `#FFFFFF` - Beyaz (kartlar/yüzeyler)

### Fontlar
- **Başlıklar**: Playfair Display (serif, sıcak ve samimi)
- **Gövde Metni**: Nunito (sans-serif, okunabilir)

### Border Radius
- `rounded-2xl`: Standart kartlar ve input'lar
- `rounded-3xl`: Büyük kartlar ve hero section'lar

## 🔐 Güvenlik Katmanları

1. **Middleware**: Route-level protection
2. **RLS Policies**: Database-level protection
3. **Storage Policies**: File upload protection
4. **Environment Variables**: Sensitive data protection

## 📱 Responsive Breakpoints

- Mobile-first yaklaşım
- Tailwind default breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🚀 Performance Optimizations

- Next.js Image component (otomatik optimizasyon)
- Static generation için `generateStaticParams`
- Framer Motion ile smooth animasyonlar
- Lazy loading ve code splitting (Next.js otomatik)

