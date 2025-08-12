"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle"
import { Container } from "./Container"

type MenuItem = {
  title: string
  href: string
  url?: string
  target?: string
  icon?: string
  visible?: boolean
  children?: MenuItem[]
}

const staticNavigationItems = [
  {
    name: "Yönetim",
    href: "/yonetim",
    isDropdown: true,
    dropdownItems: [
      { name: "Yönetim Kurulu", href: "/yonetim" },
      { name: "Merkez Yönetim Kurulu", href: "/yonetim/merkez-yonetim-kurulu" },
      { name: "Merkez Denetleme Kurulu", href: "/yonetim/merkez-denetleme-kurulu" },
      { name: "Merkez Disiplin Kurulu", href: "/yonetim/merkez-disiplin-kurulu" },
    ]
  },
  {
    name: "Bilgi Belge",
    href: "/bilgi-belge",
    isDropdown: true,
    dropdownItems: [
      { name: "Bilgi Belge", href: "/bilgi-belge" },
      { name: "Tüzük", href: "/tuzuk" },
      { name: "Kanun", href: "/bilgi-belge#kanun" },
    ]
  },
  { name: "Üyelik Formu", href: "/uyelik-formu" },
  { name: "KAMU-AR", href: "/kamu-ar" },
  { name: "Neden Kültür Sanat-İş", href: "/kultur-sanat-is" },
  {
    name: "Basın Yayın",
    href: "/basin-yayin",
    isDropdown: true,
    dropdownItems: [
      { name: "Basın ve Yayın", href: "/basin-yayin" },
      { name: "Foto Galeri", href: "/galeri" },
      { name: "Afiş", href: "/basin-yayin/afis" },
      { name: "Video", href: "/basin-yayin/video" },
      { name: "Broşür", href: "/basin-yayin/brosur" },
      { name: "Rapor", href: "/basin-yayin/rapor" },
      { name: "Çalışma Takvimi", href: "/basin-yayin/takvim" },
    ]
  },
  { 
    name: "Konfederasyon", 
    href: "#",
    isDropdown: true,
    dropdownItems: [
      { name: "Birleşik Kamu İş", href: "https://www.birlesikkamuis.org.tr/", external: true },
      { name: "Büro-İş", href: "https://www.burois.org.tr/", external: true },
      { name: "Eğitim-İş", href: "https://www.egitimis.org.tr/", external: true },
      { name: "Genel Sağlık-İş", href: "https://www.genelsaglikis.org.tr/", external: true },
      { name: "Güven Haber-Sen", href: "https://www.guvenhabersen.org/", external: true },
      { name: "Tarım Orman-İş", href: "https://www.tarimorman-is.org/", external: true },
      { name: "Tapu Çevre Yol-İş", href: "https://www.tapucevreyolis.org.tr/", external: true },
      { name: "Tüm Yerel-Sen", href: "https://www.tumyerelsen.org/", external: true },
      { name: "Ulaşım-İş", href: "https://www.ulasimissendikasi.org/", external: true },
      { name: "Enerji-İş", href: "https://enerji-is.org/", external: true },
    ]
  },
  { name: "İletişim", href: "/iletisim" },
  { name: "Etkinlikler", href: "/etkinlikler" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [menuItems, setMenuItems] = React.useState<any[]>(staticNavigationItems)
  const [siteData, setSiteData] = React.useState<any>(null)

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/site-data', { cache: 'no-store' })
        const json = await res.json()
        if (json.success) {
          setSiteData(json.data)
          const apiMenu: MenuItem[] = json.data?.menu || []
          if (Array.isArray(apiMenu) && apiMenu.length > 0) {
            // Admin panelinden gelen menü öğelerini kullan
            const dynamicItems = apiMenu
              .filter((it) => it.visible !== false && it.title && it.url)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((it) => ({ 
                name: it.title, 
                href: it.url || it.href || '/',
                target: it.target || '_self'
              }))
            
            // Dinamik menü öğelerini kullan, ancak dropdown özelliklerini korumak için statik menüyü birleştir
            const mergedItems = staticNavigationItems.map(staticItem => {
              const dynamicMatch = dynamicItems.find(dynamicItem => dynamicItem.name === staticItem.name)
              if (dynamicMatch) {
                // Dinamik item varsa onu kullan ama dropdown özelliklerini koru
                return {
                  ...staticItem,
                  href: dynamicMatch.href,
                  target: dynamicMatch.target
                }
              }
              return staticItem
            })
            
            // Sadece dinamik itemlardan statik menüde olmayanları ekle
            const uniqueDynamicItems = dynamicItems.filter(dynamicItem => 
              !staticNavigationItems.some(staticItem => staticItem.name === dynamicItem.name)
            )
            
            setMenuItems([...mergedItems, ...uniqueDynamicItems])
          } else {
            // API'den menü gelmezse statik menüyü kullan
            setMenuItems(staticNavigationItems)
          }
        } else {
          // API başarısızsa statik menüyü kullan
          setMenuItems(staticNavigationItems)
        }
      } catch (error) {
        console.error('Menu loading error:', error)
        // Hata durumunda statik menüyü kullan
        setMenuItems(staticNavigationItems)
      }
    }
    load()
  }, [])


  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/20 shadow-sm">
      <Container>
        {/* Üst Bölüm - Yeniden Düzenlenmiş Layout */}
        <div className="flex h-16 items-center justify-between py-2">
          {/* Sol Taraf - Logo ve Site Adı */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4 group">
              {/* Kültür Sanat İş Logosu */}
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/kultur.png"
                  alt="Kültür Sanat İş"
                  width={48}
                  height={48}
                  className="rounded-full shadow-md"
                />
              </div>
              
              {/* Atatürk Logosu */}
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo-png-beyaz.png"
                  alt="Atatürk"
                  width={48}
                  height={48}
                  className="rounded-full shadow-md"
                />  
              </div>
            </Link>
            
            {/* Site Başlığı */}
            <Link href="/" className="hidden lg:block group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
                {siteData?.settings?.siteName || "Kültür-İş"}
              </h1>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                {siteData?.settings?.siteDescription || "Kültür Sanat İş"}
              </p>
            </Link>
          </div>

          {/* Orta - Atatürk'ün Sözü - Kayan Yazı */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative overflow-hidden h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <div className="flex items-center h-full px-4">
                <div className="animate-marquee whitespace-nowrap text-white font-medium text-sm">
                  "Benim naçiz vücudum elbet bir gün toprak olacaktır, ancak Türkiye Cumhuriyeti ilelebet payidar kalacaktır." - Mustafa Kemal Atatürk
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Atatürk ve Controls */}
          <div className="flex items-center space-x-4">
            {/* Atatürk Görseli */}
            <div className="hidden lg:block relative">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg">
                <Image
                  src="/ataturk.png"
                  alt="Mustafa Kemal Atatürk"
                  width={60}
                  height={60}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Modern Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Atatürk'ün Sözü - Mobile */}
                  <div className="lg:hidden mb-4">
                    <div className="relative overflow-hidden h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      <div className="flex items-center h-full px-4">
                        <div className="animate-marquee whitespace-nowrap text-white font-medium text-xs">
                          "Benim naçiz vücudum elbet bir gün toprak olacaktır, ancak Türkiye Cumhuriyeti ilelebet payidar kalacaktır." - M.K. Atatürk
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ana Sayfa Linki - Mobil */}
                  <Link
                    href="/"
                    className="text-sm font-medium transition-colors hover:text-red-600 py-2 px-2 rounded-md hover:bg-red-50 bg-red-100 text-red-700"
                    onClick={() => setIsOpen(false)}
                  >
                    🏠 Ana Sayfa
                  </Link>
                  
                  {menuItems.map((item) => {
                    if (item.isDropdown) {
                      return (
                        <div key={item.name} className="space-y-2">
                          <div className="font-medium text-sm text-muted-foreground px-2">
                            {item.name}
                          </div>
                          <div className="pl-4 space-y-2">
                            {item.dropdownItems?.map((dropdownItem: { name: string; href: string; external?: boolean }) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="flex items-center justify-between text-sm hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-muted"
                                onClick={() => setIsOpen(false)}
                                {...(dropdownItem.external && {
                                  target: "_blank",
                                  rel: "noopener noreferrer"
                                })}
                              >
                                <span>{dropdownItem.name}</span>
                                {dropdownItem.external ? (
                                  <ExternalLink className="h-4 w-4" />
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={`mobile-${item.name}-${item.href || 'no-href'}`}
                        href={item.href || '/'}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-md hover:bg-muted",
                          pathname === (item.href || '/')
                            ? "text-primary bg-muted"
                            : "text-muted-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Alt Bölüm - Modern Navigasyon Menüsü */}
        <div className="border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
          <nav className="hidden md:flex items-center justify-center space-x-1 py-2">
            {/* Ana Sayfa Linki - Desktop */}
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-all duration-200 py-2 px-4 rounded-lg relative overflow-hidden group",
                pathname === "/"
                  ? "text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              <span className="relative z-10">Ana Sayfa</span>
              {pathname === "/" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700"></div>
              )}
            </Link>
            
            {menuItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/20 dark:border-slate-700/20 shadow-xl">
                      {item.dropdownItems?.map((dropdownItem: { name: string; href: string; external?: boolean }) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link
                            href={dropdownItem.href}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            {...(dropdownItem.external && {
                              target: "_blank",
                              rel: "noopener noreferrer"
                            })}
                          >
                            <span>{dropdownItem.name}</span>
                            {dropdownItem.external ? (
                              <ExternalLink className="h-3 w-3 ml-2 text-slate-400" />
                            ) : null}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link
                  key={`${item.name}-${item.href || 'no-href'}`}
                  href={item.href || '/'}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 py-2 px-4 rounded-lg relative overflow-hidden group",
                    pathname === (item.href || '/')
                      ? "text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {pathname === (item.href || '/') && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700"></div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </Container>
    </header>
  )
}
