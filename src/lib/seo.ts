import { DefaultSeoProps } from 'next-seo'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Kültür Sanat İş'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ornek-sendika.org'

export const defaultSEO: DefaultSeoProps = {
  title: 'Kültür Sanat İş',
  titleTemplate: `%s | ${siteName}`,
  description: 'Modern ve güçlü bir sendika. Çalışan haklarını koruyoruz, adalet için mücadele ediyoruz.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName,
    title: siteName,
    description: 'Modern ve güçlü bir sendika. Çalışan haklarını koruyoruz, adalet için mücadele ediyoruz.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    handle: '@kultursanatis',
    site: '@kultursanatis',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#0f172a',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/kültür.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
}

export function generatePageSEO({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}) {
  const url = `${siteUrl}${path}`
  
  return {
    title,
    description,
    canonical: url,
    noindex: noIndex,
    openGraph: {
      title,
      description,
      url,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
    },
    twitter: {
      title,
      description,
      image,
    },
  }
}
