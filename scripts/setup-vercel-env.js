#!/usr/bin/env node

/**
 * Vercel Environment Variables Kurulum Script'i
 * Bu script Vercel CLI kullanarak environment variables'ları otomatik olarak ayarlar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Vercel Environment Variables Kurulum Script\'i');
console.log('================================================\n');

// Environment variables template
const envTemplate = {
  // MongoDB
  MONGODB_URI: 'mongodb+srv://username:password@cluster.mongodb.net/sendika-website?retryWrites=true&w=majority',
  
  // NextAuth
  NEXTAUTH_URL: 'https://your-project-name.vercel.app',
  NEXTAUTH_SECRET: 'your-32-character-secret-key-here',
  
  // JWT
  JWT_SECRET: 'your-32-character-jwt-secret-here',
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'your_cloud_name',
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'union_public',
  CLOUDINARY_API_KEY: 'your_api_key',
  CLOUDINARY_API_SECRET: 'your_api_secret',
  
  // Site
  NEXT_PUBLIC_SITE_NAME: 'Birlik-Sen',
  NEXT_PUBLIC_SITE_URL: 'https://your-project-name.vercel.app',
  ADMIN_ACCESS: 'true',
  NEXT_PUBLIC_UPLOAD_KEY: 'your-secure-upload-key',
  
  // Admin
  ADMIN_EMAIL: 'admin@yourdomain.com',
  ADMIN_PASSWORD: 'secure-production-password',
  
  // Email (Resend)
  RESEND_API_KEY: 're_your_api_key',
  CONTACT_TO: 'info@yourdomain.com'
};

// Vercel CLI kurulu mu kontrol et
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Vercel CLI kur
function installVercelCLI() {
  console.log('📦 Vercel CLI kuruluyor...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI başarıyla kuruldu!');
    return true;
  } catch (error) {
    console.error('❌ Vercel CLI kurulumu başarısız:', error.message);
    return false;
  }
}

// Environment variables'ları Vercel'e ekle
function addEnvironmentVariables() {
  console.log('🔧 Environment Variables Vercel\'e ekleniyor...');
  
  Object.entries(envTemplate).forEach(([key, value]) => {
    try {
      console.log(`📝 ${key} ekleniyor...`);
      execSync(`vercel env add ${key} production`, { 
        stdio: ['pipe', 'pipe', 'pipe'],
        input: value
      });
      console.log(`✅ ${key} başarıyla eklendi`);
    } catch (error) {
      console.log(`⚠️  ${key} zaten mevcut veya eklenemedi`);
    }
  });
}

// Ana fonksiyon
async function main() {
  try {
    // Vercel CLI kontrolü
    if (!checkVercelCLI()) {
      console.log('❌ Vercel CLI bulunamadı');
      const install = await askQuestion('Vercel CLI kurulsun mu? (y/n): ');
      if (install.toLowerCase() === 'y') {
        if (!installVercelCLI()) {
          console.log('❌ Vercel CLI kurulumu başarısız. Manuel olarak kurun: npm install -g vercel');
          return;
        }
      } else {
        console.log('❌ Vercel CLI gerekli. Manuel olarak kurun: npm install -g vercel');
        return;
      }
    }

    // Vercel login kontrolü
    console.log('🔐 Vercel hesabınızla giriş yapın...');
    try {
      execSync('vercel whoami', { stdio: 'ignore' });
      console.log('✅ Vercel hesabına giriş yapıldı');
    } catch (error) {
      console.log('❌ Vercel hesabına giriş yapılmadı');
      execSync('vercel login', { stdio: 'inherit' });
    }

    // Proje seçimi
    console.log('📁 Vercel projesi seçiliyor...');
    execSync('vercel link', { stdio: 'inherit' });

    // Environment variables ekleme
    addEnvironmentVariables();

    console.log('\n🎉 Environment Variables başarıyla eklendi!');
    console.log('\n📋 Sonraki adımlar:');
    console.log('1. vercel --prod komutu ile deploy edin');
    console.log('2. Vercel dashboard\'da environment variables\'ları kontrol edin');
    console.log('3. MongoDB Atlas bağlantısını test edin');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('\n🔧 Manuel kurulum için:');
    console.log('1. vercel login');
    console.log('2. vercel link');
    console.log('3. Vercel dashboard\'da environment variables ekleyin');
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
  main();
}

module.exports = { envTemplate, addEnvironmentVariables };
