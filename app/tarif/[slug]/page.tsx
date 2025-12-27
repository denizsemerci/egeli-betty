import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import IngredientsList from '@/components/IngredientsList'
import InstructionsList from '@/components/InstructionsList'
import ShareButton from '@/components/ShareButton'
import RelatedRecipes from '@/components/RelatedRecipes'
import AuthorBadge from '@/components/AuthorBadge'
import { generateRecipeMetadata, generateRecipeStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'

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
        <main className="min-h-screen bg-background">
          {/* Hero Image - Full Width */}
          {recipe.image_url && (
            <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
              <Image
                src={recipe.image_url}
                alt={`${recipe.title} - Egeli Betty`}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="container mx-auto max-w-4xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {recipe.category}
                    </span>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prep_time} dk</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} kişilik</span>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3 drop-shadow-lg">
                    {recipe.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/95 max-w-3xl drop-shadow-md">
                    {recipe.description}
                  </p>
                </div>
              </div>
            </section>
          )}

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

