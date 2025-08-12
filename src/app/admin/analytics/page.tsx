'use client'

import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, Users, Eye, Calendar, MessageSquare, 
  Download, Filter, BarChart3, PieChart, Activity, Clock
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('visitors')

  const stats = [
    {
      title: 'Toplam Ziyaretçi',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Sayfa Görüntüleme',
      value: '45,231',
      change: '+8.2%',
      trend: 'up',
      icon: Eye,
      color: 'green'
    },
    {
      title: 'Etkinlik Katılımı',
      value: '1,234',
      change: '-3.1%',
      trend: 'down',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Yeni Üyeler',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: MessageSquare,
      color: 'orange'
    }
  ]

  const topPages = [
    { page: 'Ana Sayfa', views: 15420, percentage: 34.1 },
    { page: 'Duyurular', views: 8930, percentage: 19.7 },
    { page: 'Etkinlikler', views: 6540, percentage: 14.5 },
    { page: 'Hakkımızda', views: 4320, percentage: 9.6 },
    { page: 'İletişim', views: 3210, percentage: 7.1 }
  ]

  const recentActivities = [
    { action: 'Yeni duyuru yayınlandı', user: 'Admin', time: '5 dakika önce', type: 'create' },
    { action: 'Etkinlik güncellendi', user: 'Moderatör', time: '15 dakika önce', type: 'update' },
    { action: 'Yeni üye kaydı', user: 'Sistem', time: '32 dakika önce', type: 'user' },
    { action: 'Galeri fotoğrafı eklendi', user: 'Editor', time: '1 saat önce', type: 'media' },
    { action: 'Site ayarları değiştirildi', user: 'Admin', time: '2 saat önce', type: 'settings' }
  ]

  const deviceStats = [
    { device: 'Masaüstü', percentage: 45.2, count: 5643 },
    { device: 'Mobil', percentage: 38.7, count: 4832 },
    { device: 'Tablet', percentage: 16.1, count: 2011 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Site performansı ve kullanıcı istatistikleri</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 3 Ay</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          
          <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ziyaretçi Trendi</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('visitors')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedMetric === 'visitors' 
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Ziyaretçi
              </button>
              <button
                onClick={() => setSelectedMetric('pageviews')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedMetric === 'pageviews' 
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Sayfa Görüntüleme
              </button>
            </div>
          </div>
          
          {/* Chart placeholder */}
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Grafik burada görünecek</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Chart.js veya benzeri kütüphane ile</p>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">En Çok Ziyaret Edilen Sayfalar</h3>
          
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{page.page}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{page.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{page.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cihaz Dağılımı</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {deviceStats.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-gray-900 dark:text-white font-medium">{device.device}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{device.percentage}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{device.count.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Son Aktiviteler</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'create' ? 'bg-green-500' :
                  activity.type === 'update' ? 'bg-blue-500' :
                  activity.type === 'user' ? 'bg-purple-500' :
                  activity.type === 'media' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{activity.user}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
              Tüm aktiviteleri görüntüle →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
