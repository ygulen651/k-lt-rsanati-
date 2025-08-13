# ✅ Vercel Environment Variables Checklist

Bu checklist, Vercel'de MongoDB verilerinizin çalışması için gerekli environment variables'ları kontrol etmenizi sağlar.

## 🔧 Vercel Dashboard'da Yapılacaklar

### 1. Proje Seçimi
- [ ] Vercel Dashboard'a gidin
- [ ] Projenizi seçin
- [ ] Settings > Environment Variables'a gidin

### 2. Environment Variables Ekleme

#### MongoDB Bağlantısı (ZORUNLU)
```
Name: MONGODB_URI
Value: mongodb+srv://sendika-admin:admin123@cluster0.tod7eit.mongodb.net/sendika-website?retryWrites=true&w=majority
Environment: Production ✅
```

#### NextAuth (ZORUNLU)
```
Name: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
Environment: Production ✅

Name: NEXTAUTH_SECRET
Value: your-32-character-secret-key-here
Environment: Production ✅
```

#### JWT (ZORUNLU)
```
Name: JWT_SECRET
Value: your-32-character-jwt-secret-here
Environment: Production ✅
```

#### Site Konfigürasyonu (ZORUNLU)
```
Name: NEXT_PUBLIC_SITE_NAME
Value: Birlik-Sen
Environment: Production ✅

Name: NEXT_PUBLIC_SITE_URL
Value: https://your-project-name.vercel.app
Environment: Production ✅

Name: ADMIN_ACCESS
Value: true
Environment: Production ✅

Name: NEXT_PUBLIC_UPLOAD_KEY
Value: your-secure-upload-key
Environment: Production ✅
```

#### Admin Kullanıcı (ZORUNLU)
```
Name: ADMIN_EMAIL
Value: admin@sendika.com
Environment: Production ✅

Name: ADMIN_PASSWORD
Value: admin123
Environment: Production ✅
```

### 3. Environment Variables Kontrolü
- [ ] Tüm variables Production'da aktif
- [ ] MONGODB_URI doğru
- [ ] NEXTAUTH_URL doğru (proje URL'iniz)
- [ ] Secrets güçlü (32+ karakter)

## 🧪 Test Adımları

### 1. Deploy Sonrası
- [ ] Build başarılı
- [ ] Site yükleniyor
- [ ] `/test-debug` sayfası çalışıyor

### 2. Debug Sayfası Kontrolü
- [ ] `https://your-project.vercel.app/test-debug` açılıyor
- [ ] MONGODB_URI: ✅ Set
- [ ] VERCEL: ✅ Yes
- [ ] MongoDB Test: Başarılı
- [ ] Site Data: Veri dönüyor

### 3. Ana Sayfa Kontrolü
- [ ] Ana sayfa yükleniyor
- [ ] Misyon/Vizyon/Değerler görünüyor
- [ ] Admin panelindeki veriler geliyor

## 🔍 Sorun Giderme

### Environment Variables Sorunları
```
❌ MONGODB_URI: Not Set
Çözüm: Vercel Dashboard'da ekleyin

❌ VERCEL: No
Çözüm: Vercel'de deploy edildiğinden emin olun

❌ MongoDB Test: Hata
Çözüm: MONGODB_URI'yi kontrol edin
```

### MongoDB Bağlantı Sorunları
```
❌ Network Access Error
Çözüm: MongoDB Atlas'ta 0.0.0.0/0 ekleyin

❌ Authentication Error
Çözüm: Username/password doğru mu kontrol edin

❌ Database Not Found
Çözüm: Database adı doğru mu kontrol edin
```

### Build Sorunları
```
❌ Build Failed
Çözüm: Build loglarını kontrol edin

❌ Environment Variables Not Loaded
Çözüm: Production'da aktif olduğundan emin olun
```

## 📋 Hızlı Kontrol

```bash
# 1. Debug sayfasını açın
https://your-project.vercel.app/test-debug

# 2. Environment variables'ları kontrol edin
# 3. MongoDB test sonuçlarını kontrol edin
# 4. Site data test sonuçlarını kontrol edin
```

## 🎯 Sonraki Adımlar

1. **Environment variables'ları ekleyin** ✅
2. **Deploy edin** ✅
3. **Debug sayfasını test edin** ✅
4. **Ana sayfayı kontrol edin** ✅
5. **Admin panelini test edin** ✅

---

**Not:** Bu checklist'i takip ederek Vercel'de MongoDB verilerinizin çalışmasını sağlayabilirsiniz.
