"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Tarih formatlama fonksiyonu
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}



interface CarouselSlide {
  id: string
  title: string
  subtitle?: string
  description: string
  image: string
  date: string
  category: string
  link: string
  featured?: boolean
}

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  // Mount effect to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10s
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (!slides.length) return null

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-red-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-blue-600/20 to-purple-600/20 animate-pulse"></div>
        {isMounted && [...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Background Image with Ultra Modern Effects */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={currentSlideData.image}
            alt={currentSlideData.title}
            fill
            className={`object-cover transition-all duration-1000 ease-out transform ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
            priority
          />
          {/* Multi-layer Modern Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-blue-900/30" />
          
          {/* Animated Geometric Shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 border border-red-500/30 rotate-12 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        </div>
      </div>

      {/* Ultra Modern Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl">
            {/* Modern Category and Date */}
            <div className={`mb-6 flex items-center gap-6 transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-75 blur-sm"></div>
                <Badge className="relative bg-white/10 backdrop-blur-md text-white border-white/20 text-sm font-bold px-4 py-2">
                  {currentSlideData.category}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-white/90 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{formatDate(currentSlideData.date)}</span>
              </div>
            </div>

            {/* Ultra Modern Subtitle */}
            {currentSlideData.subtitle && (
              <div className={`mb-4 transform transition-all duration-1000 delay-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-red-200 font-bold tracking-wide">
                  {currentSlideData.subtitle}
                </p>
              </div>
            )}

            {/* Epic Main Title */}
            <div className={`mb-8 transform transition-all duration-1000 delay-700 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-r from-white via-blue-100 to-red-100 bg-clip-text text-transparent drop-shadow-2xl">
                  {currentSlideData.title.split(' ').slice(0, 3).join(' ')}
                </span>
                <span className="block text-white/90 mt-2">
                  {currentSlideData.title.split(' ').slice(3).join(' ')}
                </span>
              </h1>
              <div className="mt-4 h-1 w-32 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></div>
            </div>

            {/* Modern Description */}
            <div className={`mb-10 transform transition-all duration-1000 delay-900 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed font-medium bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                {currentSlideData.description}
              </p>
            </div>

            {/* Ultra Modern CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-1100 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-sm transition-all duration-300 animate-pulse"></div>
                <Button size="lg" asChild className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-2xl px-8 py-4 font-bold text-lg shadow-2xl">
                  <Link href={currentSlideData.link}>
                    Devamını Oku
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 rounded-2xl px-8 py-4 font-bold text-lg">
                Daha Fazla Bilgi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Modern Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-30 group"
            aria-label="Önceki slayt"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-red-600 rounded-full opacity-75 group-hover:opacity-100 blur-md transition-all duration-300"></div>
              <div className="relative p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-white/20 transition-all duration-300">
                <ChevronLeft className="h-6 w-6" />
              </div>
            </div>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-30 group"
            aria-label="Sonraki slayt"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur-md transition-all duration-300"></div>
              <div className="relative p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-white/20 transition-all duration-300">
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </button>
        </>
      )}

      {/* Ultra Modern Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`group relative transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 h-3'
                  : 'w-3 h-3'
              }`}
              aria-label={`Slayt ${index + 1}'e git`}
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-red-500 to-blue-500'
                  : 'bg-white/40 group-hover:bg-white/60'
              }`}></div>
              {index === currentSlide && (
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 to-blue-500/50 rounded-full blur-sm animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Ultra Modern Progress Bar */}
      {isAutoPlaying && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-red-500 transition-all duration-300 relative overflow-hidden" 
            style={{ 
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Ultra Modern Slide Counter */}
      <div className="absolute top-8 right-8 z-30">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
          <span className="text-white font-bold text-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">
              {String(currentSlide + 1).padStart(2, '0')}
            </span>
            <span className="text-white/60 mx-2">/</span>
            <span className="text-white/80">
              {String(slides.length).padStart(2, '0')}
            </span>
          </span>
        </div>
      </div>
      
      {/* Modern Floating Elements */}
      <div className="absolute top-1/4 left-8 z-10 w-2 h-20 bg-gradient-to-b from-red-500/30 to-blue-500/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-12 z-10 w-16 h-2 bg-gradient-to-r from-blue-500/30 to-red-500/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      

    </div>
  )
}
