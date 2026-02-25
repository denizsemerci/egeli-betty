# Sonraki adımlar – Tarifi Kaydet düzeltmesi

## Yerelde yapılan commit

- **Commit:** `fix: Tarifi Kaydet butonunun disabled takılı kalmasını önle (adım 4 + 90sn timeout)`
- **Branch:** `fix/taslaklar-yukleme`
- Bu commit sayesinde: Fotoğraflar adımına (4. adım) her gelindiğinde buton sıfırlanıyor; 90 saniye “yükleniyor” kalırsa da otomatik açılıyor.

## Senin yapman gerekenler

### 1. Push (GitHub’a gönder)

Terminal 403 verdiği için push’u **GitHub Desktop** ile yap:

1. **GitHub Desktop**’ı aç.
2. Repo: **egeli-betty**, branch: **fix/taslaklar-yukleme** olduğundan emin ol.
3. Üstte **“Push origin”** (veya 1 commit ahead yazıyorsa Push) butonuna tıkla.
4. Gerekirse GitHub’da **denizsemerci** hesabıyla giriş yap.

### 2. Vercel deploy

Push’tan sonra Vercel otomatik yeni deploy alacak (birkaç dakika).  
Preview linkinden (veya merge sonrası production’dan) tekrar dene: **Tarifi Kaydet** artık disabled takılmamalı.

### 3. PR #16’yı merge et (isteğe bağlı)

GitHub’da **PR #16** (fix/taslaklar-yukleme → main) açıksa ve testler geçtiyse **“Merge pull request”** ile main’e al. Böylece hem taslaklar hem Tarifi Kaydet düzeltmeleri production’a geçer.

---

**Özet:** GitHub Desktop ile **Push origin** yap → Vercel yeni deploy alsın → Tarifi Kaydet’i tekrar dene.
