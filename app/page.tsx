import { createClient } from '@/lib/supabase/server'
import RecipeCard from '@/components/RecipeCard'
import CategoryPills from '@/components/CategoryPills'
import SearchBar from '@/components/SearchBar'
import { generateHomeMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Image from 'next/image'

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
      <main className="min-h-screen pt-20 md:pt-24">
      {/* Hero Section - Full Width Banner */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden -mt-20 md:-mt-24">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-feast.jpg"
            alt="Ege Mutfağı Sofrası - Egeli Betty"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
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
                href="https://www.instagram.com/egelibetty/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <span>Instagram&apos;da Takip Et</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
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

