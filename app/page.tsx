import { createClient } from '@/lib/supabase/server'
import RecipeCard from '@/components/RecipeCard'
import CategoryPills from '@/components/CategoryPills'
import SearchBar from '@/components/SearchBar'
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

  const { data: recipes, error } = await query

  if (error) {
    console.error('Error fetching recipes:', error)
  }

  return (
    <>
      <main className="min-h-screen">
      {/* Hero Section - Full Width Banner */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 via-primary/80 to-secondary/70">
          {/* Placeholder for hero image - can be replaced with actual image */}
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="container mx-auto max-w-5xl text-center text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight drop-shadow-lg">
              Egeli Betty ile Ege&apos;nin Güneşi Sofranızda
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-3xl mx-auto font-light drop-shadow-md">
              Geleneksel Lezzetlerin Modern Durağı
            </p>
            
            {/* Search Bar Integrated */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar />
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#recipes"
                className="px-8 py-4 bg-white text-primary-dark rounded-full font-semibold text-lg hover:bg-warm-light transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Tarifleri Keşfet
              </a>
              <a
                href="#recipes"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Bugün Ne Pişirsem?
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12 bg-background">
        <CategoryPills categories={categories} />
      </section>

      {/* Recipe Grid */}
      <section id="recipes" className="container mx-auto px-4 pb-16">
        {error ? (
          <div className="text-center py-16">
            <p className="text-text/60 text-lg mb-4">
              Tarifler yüklenirken bir hata oluştu.
            </p>
            <p className="text-text/40 text-sm">
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : searchParams.search || (searchParams.category && searchParams.category !== 'Tümü') ? (
          <div className="text-center py-16">
            <p className="text-text/60 text-lg mb-2">
              Aradığınız kriterlere uygun tarif bulunamadı.
            </p>
            <p className="text-text/40 text-sm">
              Farklı bir arama terimi veya kategori deneyin.
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text/60 text-lg">
              Henüz tarif bulunmuyor. Yakında lezzetli tarifler burada olacak!
            </p>
          </div>
        )}
      </section>
      </main>
    </>
  )
}

