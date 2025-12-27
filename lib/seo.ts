import { Metadata } from 'next'

interface Recipe {
  title: string
  description: string
  image_url: string | null
  slug: string
  category: string
  prep_time: number
  servings: number
  ingredients: string[] | null
  steps: string[] | null
}

export function generateRecipeMetadata(recipe: Recipe): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr'
  const imageUrl = recipe.image_url || `${siteUrl}/og-image.jpg`

  return {
    title: `${recipe.title} - Egeli Betty`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} - Egeli Betty`,
      description: recipe.description,
      url: `${siteUrl}/tarif/${recipe.slug}`,
      siteName: 'Egeli Betty',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
      locale: 'tr_TR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} - Egeli Betty`,
      description: recipe.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/tarif/${recipe.slug}`,
    },
  }
}

export function generateHomeMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr'

  return {
    title: 'Egeli Betty - Ege Mutfağı Tarifleri | Ev Yapımı Lezzetler',
    description:
      'Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi. Zeytinyağlılar, hamur işi, tatlılar ve daha fazlası.',
    keywords: [
      'Ege mutfağı',
      'tarif',
      'yemek tarifi',
      'ev yapımı',
      'zeytinyağlılar',
      'hamur işi',
      'tatlı',
      'Türk mutfağı',
      'geleneksel yemek',
    ],
    openGraph: {
      title: 'Egeli Betty - Ege Mutfağı Tarifleri',
      description:
        'Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi.',
      url: siteUrl,
      siteName: 'Egeli Betty',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Egeli Betty - Ege Mutfağı Tarifleri',
        },
      ],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Egeli Betty - Ege Mutfağı Tarifleri',
      description:
        'Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

export function generateRecipeStructuredData(recipe: Recipe) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr'
  const imageUrl = recipe.image_url || `${siteUrl}/og-image.jpg`

  // Handle ingredients - can be string[] or null
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : []

  // Handle steps - can be string[] or null
  const steps = Array.isArray(recipe.steps) 
    ? recipe.steps 
    : []

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: 'Betül',
    },
    datePublished: new Date().toISOString(),
    prepTime: `PT${recipe.prep_time}M`,
    recipeYield: `${recipe.servings} kişilik`,
    recipeCategory: recipe.category,
    recipeCuisine: 'Turkish',
    recipeIngredient: ingredients,
    recipeInstructions: steps.map((step: string, index: number) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
  }
}

export function generateWebsiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Egeli Betty',
    description: 'Ege mutfağının sıcacık tarifleri',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

