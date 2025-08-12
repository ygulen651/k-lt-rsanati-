// Basit veri yönetimi - gerçek zamanlı çalışan sistem

// Memory'de veri tutacağız (geliştirme için)
const announcements: Record<string, any>[] = [
  {
    id: '1',
    title: 'Örnek Duyuru 1',
    content: 'Bu bir örnek duyuru içeriğidir.',
    excerpt: 'Örnek duyuru özeti',
    category: 'Genel',
    tags: ['örnek'],
    featuredImage: '',
    status: 'published',
    featured: true,
    publishDate: new Date().toISOString(),
    author: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Örnek Duyuru 2',
    content: 'Bu ikinci örnek duyuru içeriğidir.',
    excerpt: 'İkinci duyuru özeti',
    category: 'Önemli',
    tags: ['örnek', 'önemli'],
    featuredImage: '',
    status: 'published',
    featured: false,
    publishDate: new Date().toISOString(),
    author: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const events: Record<string, any>[] = [
  {
    id: '1',
    title: 'Örnek Etkinlik',
    description: 'Bu bir örnek etkinlik açıklamasıdır.',
    date: '2025-03-15',
    time: '14:00',
    location: 'Sendika Merkezi',
    category: 'Toplantı',
    status: 'published',
    createdAt: new Date().toISOString()
  }
]

// Site verileri
let siteData = {
  hero: {
    title: "SENDİKAMIZIN GÜCÜYLE BİRLİKTE İLERLİYORUZ",
    subtitle: "Birlik ve Dayanışma",
    description: "Kamu çalışanlarının hakları için mücadele ediyoruz"
  },
  mission: {
    mission: "Kamu çalışanlarının haklarını korumak, sosyal ve ekonomik durumlarını iyileştirmek, demokratik ve laik cumhuriyeti desteklemek.",
    vision: "Türkiye'nin en güçlü ve etkili kamu sendikası olmak, çalışanların sesini en yüksek perdeden duyurmak.",
    values: "Adalet, eşitlik, dayanışma, şeffaflık ve demokratik katılım ilkelerimizle hareket ediyoruz."
  }
}

// Duyuru yöneticisi
export const AnnouncementManager = {
  getAll: () => announcements,
  
  getPublished: () => announcements.filter(a => a.status === 'published'),
  
  getById: (id: string) => announcements.find(a => a.id === id),
  
  add: (data: Record<string, any>) => {
    try {
      const newAnnouncement = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      announcements.unshift(newAnnouncement) // En başa ekle
      console.log('Yeni duyuru eklendi:', newAnnouncement.title)
      return true
    } catch (error) {
      console.error('Duyuru ekleme hatası:', error)
      return false
    }
  },
  
  update: (id: string, data: Record<string, any>) => {
    try {
      const index = announcements.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements[index] = {
          ...announcements[index],
          ...data,
          updatedAt: new Date().toISOString()
        }
        console.log('Duyuru güncellendi:', announcements[index].title)
        return true
      }
      return false
    } catch (error) {
      console.error('Duyuru güncelleme hatası:', error)
      return false
    }
  },
  
  delete: (id: string) => {
    try {
      const index = announcements.findIndex(a => a.id === id)
      if (index !== -1) {
        const deleted = announcements.splice(index, 1)[0]
        console.log('Duyuru silindi:', deleted.title)
        return true
      }
      return false
    } catch (error) {
      console.error('Duyuru silme hatası:', error)
      return false
    }
  }
}

// Etkinlik yöneticisi
export const EventManager = {
  getAll: () => events,
  
  getPublished: () => events.filter(e => e.status === 'published'),
  
  getById: (id: string) => events.find(e => e.id === id),
  
  getUpcoming: () => {
    const now = new Date()
    return events.filter(e => new Date(e.date) >= now && e.status === 'published')
  },
  
  add: (data: Record<string, any>) => {
    try {
      const newEvent = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      }
      events.unshift(newEvent)
      console.log('Yeni etkinlik eklendi:', newEvent.title)
      return true
    } catch (error) {
      console.error('Etkinlik ekleme hatası:', error)
      return false
    }
  },
  
  update: (id: string, data: Record<string, any>) => {
    try {
      const index = events.findIndex(e => e.id === id)
      if (index !== -1) {
        events[index] = { ...events[index], ...data }
        console.log('Etkinlik güncellendi:', events[index].title)
        return true
      }
      return false
    } catch (error) {
      console.error('Etkinlik güncelleme hatası:', error)
      return false
    }
  },
  
  delete: (id: string) => {
    try {
      const index = events.findIndex(e => e.id === id)
      if (index !== -1) {
        const deleted = events.splice(index, 1)[0]
        console.log('Etkinlik silindi:', deleted.title)
        return true
      }
      return false
    } catch (error) {
      console.error('Etkinlik silme hatası:', error)
      return false
    }
  }
}

// Site veri yöneticisi
export const SiteDataManager = {
  get: () => siteData,
  
  update: (section: string, data: Record<string, any>) => {
    try {
      if (siteData[section as keyof typeof siteData]) {
        siteData[section as keyof typeof siteData] = { 
          ...siteData[section as keyof typeof siteData], 
          ...data 
        }
        console.log('Site verisi güncellendi:', section)
        return true
      }
      return false
    } catch (error) {
      console.error('Site veri güncelleme hatası:', error)
      return false
    }
  },
  
  updateAll: (data: Record<string, any>) => {
    try {
      siteData = { ...siteData, ...data }
      console.log('Tüm site verisi güncellendi')
      return true
    } catch (error) {
      console.error('Site veri güncelleme hatası:', error)
      return false
    }
  }
}
