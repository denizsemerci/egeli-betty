import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import IngredientsList from '@/components/IngredientsList'
import InstructionsList from '@/components/InstructionsList'
import ShareButton from '@/components/ShareButton'

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data: recipes } = await supabase.from('recipes').select('slug')

    return recipes?.map((recipe) => ({
      slug: recipe.slug,
    })) || []
  } catch {
    return []
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!recipe) {
    notFound()
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      {recipe.image_url && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Recipe Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">
            {recipe.title}
          </h1>
          <p className="text-lg text-text/80 mb-6">
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
            <div className="px-4 py-2 bg-secondary/30 rounded-full text-sm text-text/70">
              {recipe.category}
            </div>
          </div>
          <ShareButton recipe={recipe} />
        </div>

        {/* Ingredients */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold text-text mb-6">
            Malzemeler
          </h2>
          <IngredientsList ingredients={recipe.ingredients} />
        </section>

        {/* Instructions */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold text-text mb-6">
            Nasıl Yapılır?
          </h2>
          <InstructionsList steps={recipe.steps} />
        </section>
      </div>
    </div>
  )
}

