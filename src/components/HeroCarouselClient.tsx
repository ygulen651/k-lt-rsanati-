"use client"

import dynamic from 'next/dynamic'

type CarouselSlide = {
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

const HeroCarousel = dynamic(() => import('./HeroCarousel').then(m => m.HeroCarousel), { ssr: false })

export default function HeroCarouselClient({ slides }: { slides: CarouselSlide[] }) {
  return <HeroCarousel slides={slides} />
}


