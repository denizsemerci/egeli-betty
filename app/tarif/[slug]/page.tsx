import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import IngredientsList from '@/components/IngredientsList'
import InstructionsList from '@/components/InstructionsList'
import ShareButton from '@/components/ShareButton'
import RelatedRecipes from '@/components/RelatedRecipes'
import AuthorBadge from '@/components/AuthorBadge'
import { generateRecipeMetadata, generateRecipeStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'
import RecipeImageGallery from '@/components/RecipeImageGallery'

export async function generateStaticParams() {
  try {
    const supabase = createStaticClient()
    const { data: recipes, error } = await supabase.from('recipes').select('slug')

    if (error) {
      console.error('Error fetching recipes for static params:', error)
      return []
    }

    return recipes?.map((recipe) => ({
      slug: recipe.slug,
    })) || []
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const supabase = createStaticClient()
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !recipe) {
      console.error('Error fetching recipe for metadata:', error)
      return {
        title: 'Tarif Bulunamadı',
        description: 'Aradığınız tarif bulunamadı.',
      }
    }

    return generateRecipeMetadata(recipe)
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'Tarif Bulunamadı',
      description: 'Aradığınız tarif bulunamadı.',
    }
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const supabase = await createClient()
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !recipe) {
      console.error('Error fetching recipe:', error)
      notFound()
    }

    const structuredData = generateRecipeStructuredData(recipe)

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main className="min-h-screen bg-background pt-20 md:pt-24">
          {/* Hero Image Gallery - Full Width */}
          {(recipe.images && Array.isArray(recipe.images) && recipe.images.length > 0) || recipe.image_url ? (
            <RecipeImageGallery
              images={recipe.images && Array.isArray(recipe.images) && recipe.images.length > 0 
                ? recipe.images 
                : recipe.image_url 
                  ? [recipe.image_url] 
                  : []}
              title={recipe.title}
              description={recipe.description}
              category={recipe.category}
              prepTime={recipe.prep_time}
              servings={recipe.servings}
            />
          ) : null}

          <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
            {/* Recipe Meta - If no hero image */}
            {!recipe.image_url && (
              <header className="mb-8 pb-8 border-b border-warm/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    {recipe.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
                  {recipe.title}
                </h1>
                <p className="text-xl text-text/80 mb-6">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-text/70">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium">{recipe.prep_time} dakika</span>
                  </div>
                  <div className="flex items-center gap-2 text-text/70">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">{recipe.servings} kişilik</span>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <AuthorBadge />
                  <ShareButton recipe={recipe} />
                </div>
              </header>
            )}

            {/* Share Button and Author - If hero image exists */}
            {recipe.image_url && (
              <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <AuthorBadge />
                <ShareButton recipe={recipe} />
              </div>
            )}

            {/* Ingredients */}
            <section className="mb-12" aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-3xl font-heading font-bold text-text mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-primary rounded-full" />
                Malzemeler
              </h2>
              <IngredientsList ingredients={recipe.ingredients} defaultServings={recipe.servings} />
            </section>

            {/* Instructions */}
            <section className="mb-12" aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="text-3xl font-heading font-bold text-text mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-primary rounded-full" />
                Nasıl Yapılır?
              </h2>
              <InstructionsList steps={recipe.steps} />
            </section>

            {/* Related Recipes */}
            <RelatedRecipes
              currentRecipeId={recipe.id}
              category={recipe.category}
              limit={3}
            />
          </article>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error rendering recipe page:', error)
    notFound()
  }
}

