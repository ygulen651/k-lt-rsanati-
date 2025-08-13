# 🚀 Vercel Deployment - MongoDB Verilerinizi Çalıştırma

Bu rehber, mevcut MongoDB verilerinizi Vercel'de çalıştırmak için hazırlanmıştır.

## ✅ Mevcut Durum

- ✅ MongoDB Atlas hesabınız var
- ✅ Tüm veriler MongoDB'de mevcut
- ✅ Admin paneli çalışıyor
- ✅ Yerel geliştirme çalışıyor

## 🔧 Vercel'de Verilerin Gelmemesi Sorunu

### Sorun:
Vercel'e deploy ettiğinizde MongoDB verileriniz gelmiyor.

### Çözüm:
Environment variables'ları doğru şekilde ayarlamak gerekiyor.

## 🚀 Hızlı Deployment

### 1. Environment Variables Hazırlama

Vercel Dashboard'da şu environment variables'ları ekleyin:

```bash
# MongoDB - Mevcut URI'niz
MONGODB_URI=mongodb+srv://sendika-admin:admin123@cluster0.tod7eit.mongodb.net/sendika-website?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-32-character-secret-key-here

# JWT
JWT_SECRET=your-32-character-jwt-secret-here

# Site
NEXT_PUBLIC_SITE_NAME=Birlik-Sen
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
ADMIN_ACCESS=true
NEXT_PUBLIC_UPLOAD_KEY=your-secure-upload-key

# Admin - Mevcut bilgileriniz
ADMIN_EMAIL=admin@sendika.com
ADMIN_PASSWORD=admin123
```

### 2. Otomatik Deployment Script

```bash
# Deployment script'ini çalıştırın
npm run deploy:vercel
```

### 3. Manuel Deployment

```bash
# Vercel CLI kurun
npm install -g vercel

# Giriş yapın
vercel login

# Projeyi bağlayın
vercel link

# Deploy edin
vercel --prod
```

## 🧪 MongoDB Bağlantı Testi

Deploy sonrası MongoDB bağlantısını test edin:

```bash
# Test API'sini çağırın
GET https://your-project.vercel.app/api/test-mongodb

# Ping testi
POST https://your-project.vercel.app/api/test-mongodb
{
  "action": "ping"
}

# Veri sorgusu testi
POST https://your-project.vercel.app/api/test-mongodb
{
  "action": "query"
}
```

## 🔍 Sorun Giderme

### 1. Environment Variables Kontrolü

Vercel Dashboard'da:
- Proje > Settings > Environment Variables
- Tüm variables'ların Production'da aktif olduğundan emin olun
- MONGODB_URI'nin doğru olduğunu kontrol edin

### 2. MongoDB Atlas Kontrolü

- Network Access'te `0.0.0.0/0` ekli mi?
- Database user permissions doğru mu?
- Connection string doğru mu?

### 3. Vercel Build Logları

- Build sırasında environment variables yükleniyor mu?
- MongoDB bağlantı hatası var mı?

### 4. Runtime Kontrolü

- `/api/test-mongodb` endpoint'i çalışıyor mu?
- Console'da hata mesajları var mı?

## 📋 Deployment Checklist

- [ ] Environment variables eklendi
- [ ] MongoDB URI doğru
- [ ] NextAuth secrets eklendi
- [ ] Admin bilgileri eklendi
- [ ] Build başarılı
- [ ] MongoDB test API çalışıyor
- [ ] Admin paneli erişilebilir
- [ ] Veriler yükleniyor

## 🎯 Sonraki Adımlar

1. **Environment variables'ları ekleyin**
2. **Deploy edin**
3. **MongoDB test API'sini test edin**
4. **Admin panelini kontrol edin**
5. **Verilerin yüklendiğini doğrulayın**

## 📞 Destek

Sorun yaşarsanız:
1. `/api/test-mongodb` endpoint'ini test edin
2. Vercel build loglarını kontrol edin
3. Environment variables'ları kontrol edin
4. MongoDB Atlas bağlantısını test edin

---

**Not:** Bu rehber mevcut MongoDB verilerinizi Vercel'de çalıştırmak için özel olarak hazırlanmıştır.
