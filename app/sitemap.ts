import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/static'

export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr'

  try {
    const supabase = createStaticClient()
    const { data: recipes } = await supabase
      .from('recipes')
      .select('slug, updated_at')
      .order('created_at', { ascending: false })

    const recipeEntries: MetadataRoute.Sitemap = (recipes || []).map((recipe) => ({
      url: `${siteUrl}/tarif/${recipe.slug}`,
      lastModified: recipe.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...recipeEntries,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}

