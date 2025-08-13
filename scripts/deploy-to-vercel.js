#!/usr/bin/env node

/**
 * Vercel Deployment Script'i
 * MongoDB verilerinizi Vercel'de çalıştırmak için
 */

const { execSync } = require('child_process');

console.log('🚀 Vercel Deployment Script\'i');
console.log('==============================\n');

// Environment variables template - MongoDB URI'nizi kullanarak
const envVars = {
  // MongoDB - Mevcut Atlas hesabınız
  MONGODB_URI: 'mongodb+srv://sendika-admin:admin123@cluster0.tod7eit.mongodb.net/sendika-website?retryWrites=true&w=majority',
  
  // NextAuth
  NEXTAUTH_URL: 'https://your-project-name.vercel.app',
  NEXTAUTH_SECRET: 'your-32-character-secret-key-here',
  
  // JWT
  JWT_SECRET: 'your-32-character-jwt-secret-here',
  
  // Site
  NEXT_PUBLIC_SITE_NAME: 'Birlik-Sen',
  NEXT_PUBLIC_SITE_URL: 'https://your-project-name.vercel.app',
  ADMIN_ACCESS: 'true',
  NEXT_PUBLIC_UPLOAD_KEY: 'your-secure-upload-key',
  
  // Admin - Mevcut bilgileriniz
  ADMIN_EMAIL: 'admin@sendika.com',
  ADMIN_PASSWORD: 'admin123',
  
  // Cloudinary (isteğe bağlı)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'your_cloud_name',
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'union_public',
  CLOUDINARY_API_KEY: 'your_api_key',
  CLOUDINARY_API_SECRET: 'your_api_secret',
  
  // Email (isteğe bağlı)
  RESEND_API_KEY: 're_your_api_key',
  CONTACT_TO: 'info@sendika.com'
};

async function deployToVercel() {
  try {
    console.log('📋 Deployment Adımları:');
    console.log('1. Vercel CLI kurulumu');
    console.log('2. Vercel hesabına giriş');
    console.log('3. Proje bağlantısı');
    console.log('4. Environment variables ekleme');
    console.log('5. Production deploy\n');
    
    // Vercel CLI kontrolü
    console.log('🔍 Vercel CLI kontrol ediliyor...');
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      console.log('✅ Vercel CLI zaten kurulu');
    } catch (error) {
      console.log('📦 Vercel CLI kuruluyor...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }
    
    // Vercel login kontrolü
    console.log('\n🔐 Vercel hesabına giriş kontrol ediliyor...');
    try {
      execSync('vercel whoami', { stdio: 'ignore' });
      console.log('✅ Vercel hesabına giriş yapıldı');
    } catch (error) {
      console.log('🔐 Vercel hesabına giriş yapın...');
      execSync('vercel login', { stdio: 'inherit' });
    }
    
    // Proje bağlantısı
    console.log('\n📁 Vercel projesi bağlanıyor...');
    execSync('vercel link', { stdio: 'inherit' });
    
    // Environment variables ekleme
    console.log('\n🔧 Environment Variables ekleniyor...');
    console.log('⚠️  Bu adımda her variable için değer girmeniz gerekecek\n');
    
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`📝 ${key}: ${value}`);
    });
    
    console.log('\n📋 Environment Variables\'ları manuel olarak ekleyin:');
    console.log('1. Vercel Dashboard\'a gidin');
    console.log('2. Proje > Settings > Environment Variables');
    console.log('3. Yukarıdaki değerleri ekleyin');
    console.log('4. Production environment\'ı seçin');
    
    // Deploy
    console.log('\n🚀 Production deploy başlatılıyor...');
    console.log('⚠️  Environment variables ekledikten sonra bu komutu çalıştırın');
    console.log('Komut: vercel --prod');
    
    const deploy = await askQuestion('\nŞimdi deploy edilsin mi? (y/n): ');
    if (deploy.toLowerCase() === 'y') {
      execSync('vercel --prod', { stdio: 'inherit' });
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('\n🔧 Manuel deployment için:');
    console.log('1. vercel login');
    console.log('2. vercel link');
    console.log('3. Vercel dashboard\'da environment variables ekleyin');
    console.log('4. vercel --prod');
  }
}

// Kullanıcıdan input alma
function askQuestion(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Script çalıştır
if (require.main === module) {
  deployToVercel();
}

module.exports = { envVars, deployToVercel };
