import fs from 'fs'
import path from 'path'

// Data directory path
const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Data file paths
const DATA_FILES = {
  announcements: path.join(DATA_DIR, 'announcements.json'),
  events: path.join(DATA_DIR, 'events.json'),
  members: path.join(DATA_DIR, 'members.json'),
  gallery: path.join(DATA_DIR, 'gallery.json'),
  press: path.join(DATA_DIR, 'press.json'),
  documents: path.join(DATA_DIR, 'documents.json'),
  settings: path.join(DATA_DIR, 'settings.json')
}

// Initialize data files if they don't exist
Object.entries(DATA_FILES).forEach(([key, filePath]) => {
  if (!fs.existsSync(filePath)) {
    const initialData = key === 'settings' ? {} : []
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2))
  }
})

// Generic data operations
export class DataManager {
  static readData(type: keyof typeof DATA_FILES): any[] | any {
    try {
      const filePath = DATA_FILES[type]
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading ${type} data:`, error)
      return type === 'settings' ? {} : []
    }
  }

  static writeData(type: keyof typeof DATA_FILES, data: any): boolean {
    try {
      const filePath = DATA_FILES[type]
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error(`Error writing ${type} data:`, error)
      return false
    }
  }

  static addItem(type: keyof typeof DATA_FILES, item: any): boolean {
    try {
      const data = this.readData(type) as any[]
      const newItem = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...item
      }
      data.push(newItem)
      return this.writeData(type, data)
    } catch (error) {
      console.error(`Error adding ${type} item:`, error)
      return false
    }
  }

  static updateItem(type: keyof typeof DATA_FILES, id: string, updates: any): boolean {
    try {
      const data = this.readData(type) as any[]
      const index = data.findIndex(item => item.id === id)
      if (index === -1) return false
      
      data[index] = {
        ...data[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return this.writeData(type, data)
    } catch (error) {
      console.error(`Error updating ${type} item:`, error)
      return false
    }
  }

  static deleteItem(type: keyof typeof DATA_FILES, id: string): boolean {
    try {
      const data = this.readData(type) as any[]
      const filteredData = data.filter(item => item.id !== id)
      return this.writeData(type, filteredData)
    } catch (error) {
      console.error(`Error deleting ${type} item:`, error)
      return false
    }
  }

  static getItem(type: keyof typeof DATA_FILES, id: string): any | null {
    try {
      const data = this.readData(type) as any[]
      return data.find(item => item.id === id) || null
    } catch (error) {
      console.error(`Error getting ${type} item:`, error)
      return null
    }
  }
}

// Specific data managers
export const AnnouncementManager = {
  getAll: () => DataManager.readData('announcements') as any[],
  getPublished: () => {
    const announcements = DataManager.readData('announcements') as any[]
    return announcements.filter(item => item.status === 'published')
  },
  getFeatured: () => {
    const announcements = DataManager.readData('announcements') as any[]
    return announcements.filter(item => item.status === 'published' && item.featured)
  },
  getById: (id: string) => DataManager.getItem('announcements', id),
  add: (announcement: any) => DataManager.addItem('announcements', announcement),
  update: (id: string, updates: any) => DataManager.updateItem('announcements', id, updates),
  delete: (id: string) => DataManager.deleteItem('announcements', id)
}

export const EventManager = {
  getAll: () => DataManager.readData('events') as any[],
  getPublished: () => {
    const events = DataManager.readData('events') as any[]
    return events.filter(item => item.status === 'published')
  },
  getUpcoming: () => {
    const events = DataManager.readData('events') as any[]
    const now = new Date()
    return events.filter(item => 
      item.status === 'published' && 
      new Date(item.date) >= now
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },
  getById: (id: string) => DataManager.getItem('events', id),
  add: (event: any) => DataManager.addItem('events', event),
  update: (id: string, updates: any) => DataManager.updateItem('events', id, updates),
  delete: (id: string) => DataManager.deleteItem('events', id)
}

export const MemberManager = {
  getAll: () => DataManager.readData('members') as any[],
  getActive: () => {
    const members = DataManager.readData('members') as any[]
    return members.filter(item => item.status === 'active')
  },
  getById: (id: string) => DataManager.getItem('members', id),
  add: (member: any) => DataManager.addItem('members', member),
  update: (id: string, updates: any) => DataManager.updateItem('members', id, updates),
  delete: (id: string) => DataManager.deleteItem('members', id)
}

export const GalleryManager = {
  getAll: () => DataManager.readData('gallery') as any[],
  getByCategory: (category: string) => {
    const gallery = DataManager.readData('gallery') as any[]
    return gallery.filter(item => item.category === category)
  },
  add: (item: any) => DataManager.addItem('gallery', item),
  update: (id: string, updates: any) => DataManager.updateItem('gallery', id, updates),
  delete: (id: string) => DataManager.deleteItem('gallery', id)
}

export const SettingsManager = {
  get: () => DataManager.readData('settings'),
  update: (settings: any) => DataManager.writeData('settings', settings),
  getSetting: (key: string) => {
    const settings = DataManager.readData('settings')
    return settings[key]
  },
  setSetting: (key: string, value: any) => {
    const settings = DataManager.readData('settings')
    settings[key] = value
    return DataManager.writeData('settings', settings)
  }
}
