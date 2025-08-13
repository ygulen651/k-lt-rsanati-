# 🚀 Vercel Deployment Rehberi

Bu rehber, Sendika Website projesini Vercel'e başarıyla deploy etmek için adım adım talimatları içerir.

## 📋 Ön Gereksinimler

### 1. Hesap Gereksinimleri
- [Vercel Hesabı](https://vercel.com/signup) (GitHub ile giriş yapabilirsiniz)
- [MongoDB Atlas](https://mongodb.com/atlas) hesabı
- [Cloudinary](https://cloudinary.com) hesabı
- [Resend](https://resend.com) hesabı (e-posta gönderimi için)

### 2. Proje Hazırlığı
- Proje GitHub'da olmalı
- Tüm environment variables hazır olmalı
- MongoDB Atlas cluster kurulmuş olmalı

## 🔧 MongoDB Atlas Kurulumu

### 1. Cluster Oluşturma
1. [MongoDB Atlas](https://mongodb.com/atlas)'a giriş yapın
2. "Build a Database" > "FREE" plan seçin
3. Cloud Provider: AWS, Region: Frankfurt (eu-west-1) seçin
4. Cluster adı: `sendika-cluster` (veya istediğiniz ad)
5. "Create" butonuna tıklayın

### 2. Database Access
1. Sol menüden "Database Access" seçin
2. "Add New Database User" tıklayın
3. Username: `sendika-admin`
4. Password: Güçlü bir şifre oluşturun (kaydedin!)
5. Built-in Role: "Atlas admin" seçin
6. "Add User" tıklayın

### 3. Network Access
1. Sol menüden "Network Access" seçin
2. "Add IP Address" tıklayın
3. "Allow Access from Anywhere" seçin (0.0.0.0/0)
4. "Confirm" tıklayın

### 4. Connection String
1. "Database" > "Connect" tıklayın
2. "Connect your application" seçin
3. Driver: Node.js, Version: 5.0 or later
4. Connection string'i kopyalayın:
```
mongodb+srv://sendika-admin:YOUR_PASSWORD@sendika-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## ☁️ Cloudinary Kurulumu

### 1. Hesap Oluşturma
1. [Cloudinary](https://cloudinary.com) hesabı oluşturun
2. Dashboard'dan Cloud Name'i not edin

### 2. Upload Preset
1. Settings > Upload > Upload presets
2. "Add upload preset" tıklayın
3. Preset name: `union_public`
4. Signing Mode: "Unsigned"
5. "Save" tıklayın

### 3. API Keys
1. Dashboard'dan API Key ve API Secret'ı not edin

## 📧 Resend Kurulumu

### 1. Hesap Oluşturma
1. [Resend](https://resend.com) hesabı oluşturun
2. API Key'i not edin (re_ ile başlar)

## 🚀 Vercel'e Deploy

### 1. Proje Import
1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" tıklayın
3. GitHub'dan projeyi import edin
4. Repository: `your-username/sendika-website` seçin

### 2. Proje Konfigürasyonu
- Framework Preset: Next.js
- Root Directory: `./` (varsayılan)
- Build Command: `npm run build` (otomatik)
- Output Directory: `.next` (otomatik)
- Install Command: `npm install` (otomatik)

### 3. Environment Variables Ekleme
"Environment Variables" bölümünde aşağıdakileri ekleyin:

#### MongoDB
```
MONGODB_URI=mongodb+srv://sendika-admin:YOUR_PASSWORD@sendika-cluster.xxxxx.mongodb.net/sendika-website?retryWrites=true&w=majority
```

#### NextAuth
```
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-32-character-secret-key-here
```

#### JWT
```
JWT_SECRET=your-32-character-jwt-secret-here
```

#### Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=union_public
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Site Konfigürasyonu
```
NEXT_PUBLIC_SITE_NAME=Birlik-Sen
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
ADMIN_ACCESS=true
NEXT_PUBLIC_UPLOAD_KEY=your-secure-upload-key
```

#### Admin Kullanıcı
```
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
```

#### E-posta
```
RESEND_API_KEY=re_your_resend_api_key
CONTACT_TO=info@yourdomain.com
```

### 4. Deploy
1. "Deploy" butonuna tıklayın
2. Build sürecini bekleyin (2-5 dakika)
3. Başarılı deploy sonrası URL'i not edin

## ✅ Deploy Sonrası Kontrol

### 1. Site Kontrolü
- Ana sayfa yükleniyor mu?
- Responsive tasarım çalışıyor mu?
- Admin paneli erişilebilir mi?

### 2. Admin Paneli
1. `https://your-project.vercel.app/admin/login` adresine gidin
2. Environment'da belirlediğiniz admin bilgileriyle giriş yapın
3. Dashboard yükleniyor mu kontrol edin

### 3. Veritabanı Bağlantısı
1. Admin panelinde herhangi bir işlem yapmayı deneyin
2. Hata mesajları var mı kontrol edin
3. MongoDB Atlas'ta bağlantı loglarını kontrol edin

## 🔍 Sorun Giderme

### Build Hatası
- Environment variables eksik mi?
- TypeScript hataları var mı?
- Dependency sorunları var mı?

### Runtime Hatası
- MongoDB bağlantısı çalışıyor mu?
- Environment variables doğru mu?
- API routes çalışıyor mu?

### Admin Panel Sorunları
- NextAuth konfigürasyonu doğru mu?
- JWT secret doğru mu?
- MongoDB user permissions doğru mu?

## 📞 Destek

Sorun yaşarsanız:
1. Vercel build loglarını kontrol edin
2. MongoDB Atlas connection loglarını kontrol edin
3. Browser console'da hata mesajlarını kontrol edin
4. GitHub'da issue açın

## 🎯 Sonraki Adımlar

Deploy başarılı olduktan sonra:
1. Custom domain ekleyin
2. SSL sertifikası otomatik olarak eklenir
3. Analytics ve monitoring ekleyin
4. Backup stratejisi oluşturun
5. Performance monitoring ekleyin

---

**Not:** Bu rehber sürekli güncellenmektedir. En güncel bilgiler için Vercel ve MongoDB dokümantasyonlarını kontrol edin.
