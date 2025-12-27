import { createStaticClient } from '@/lib/supabase/static'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RelatedRecipesProps {
  currentRecipeId: string
  category: string
  limit?: number
}

export default async function RelatedRecipes({
  currentRecipeId,
  category,
  limit = 3,
}: RelatedRecipesProps) {
  try {
    const supabase = createStaticClient()
    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, title, slug, description, prep_time, servings, image_url, category')
      .eq('category', category)
      .neq('id', currentRecipeId)
      .limit(limit + 1) // Get one extra to ensure we have enough after filtering

    if (!recipes || recipes.length === 0) {
      return null
    }

    // Filter out current recipe and limit
    const relatedRecipes = recipes
      .filter((recipe) => recipe.id !== currentRecipeId)
      .slice(0, limit)

    if (relatedRecipes.length === 0) {
      return null
    }

    return (
      <aside className="mt-16 pt-12 border-t-2 border-warm/30">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-text mb-2">
              Egeli Betty&apos;den Diğer Öneriler
            </h2>
            <p className="text-text/60">
              Aynı kategorideki diğer lezzetli tarifler
            </p>
          </div>
          <Link
            href={`/?category=${encodeURIComponent(category)}`}
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Tümünü Gör
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href={`/?category=${encodeURIComponent(category)}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Tümünü Gör
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    )
  } catch (error) {
    console.error('Error fetching related recipes:', error)
    return null
  }
}

