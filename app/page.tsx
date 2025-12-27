import { createClient } from '@/lib/supabase/server'
import RecipeCard from '@/components/RecipeCard'
import CategoryPills from '@/components/CategoryPills'
import SearchBar from '@/components/SearchBar'
import { Heart } from 'lucide-react'
import { generateHomeMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateHomeMetadata()

const categories = [
  'Tümü',
  'Zeytinyağlılar',
  'Hamur İşi',
  'Tatlılar',
  'Salatalar',
  'Çorbalar',
  'Ana Yemekler',
]

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const supabase = await createClient()
  let query = supabase.from('recipes').select('*').order('created_at', { ascending: false })

  if (searchParams.category && searchParams.category !== 'Tümü') {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: recipes } = await query

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/20 to-primary/10 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
            Hoş geldin yavrum...
          </h1>
          <p className="text-lg text-text/80 mb-8 max-w-2xl mx-auto">
            Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <CategoryPills categories={categories} />
      </section>

      {/* Recipe Grid */}
      <section className="container mx-auto px-4 pb-16">
        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text/60 text-lg">
              Henüz tarif bulunmuyor. Yakında lezzetli tarifler burada olacak!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

