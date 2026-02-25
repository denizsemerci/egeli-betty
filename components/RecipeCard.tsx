'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, ChefHat, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFavorites } from '@/lib/useFavorites'

interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  prep_time: number
  servings: number
  image_url: string | null
  images?: string[] | null
  category: string
}

interface RecipeCardProps {
  recipe: Recipe
}

// Zorluk seviyesi hesaplama (prep_time'a göre)
function getDifficultyLevel(prepTime: number): { level: string; color: string } {
  if (prepTime <= 30) return { level: 'Kolay', color: 'bg-green-100 text-green-700' }
  if (prepTime <= 60) return { level: 'Orta', color: 'bg-yellow-100 text-yellow-700' }
  return { level: 'Zor', color: 'bg-red-100 text-red-700' }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const difficulty = getDifficultyLevel(recipe.prep_time)
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
  const favorite = isLoaded && isFavorite(recipe.id)

  // Get first image from images array or fallback to image_url
  const displayImage = 
    (recipe.images && Array.isArray(recipe.images) && recipe.images.length > 0)
      ? recipe.images[0]
      : recipe.image_url

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(recipe.id)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link href={`/tarif/${recipe.slug}`} className="block h-full">
        <div className="bg-surface rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-warm/30 hover:border-primary/50">
          {/* Image Section */}
          <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10">
            {displayImage ? (
              <>
                <Image
                  src={displayImage}
                  alt={`${recipe.title} - Egeli Betty`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Multiple images indicator */}
                {recipe.images && Array.isArray(recipe.images) && recipe.images.length > 1 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium">
                    {recipe.images.length} fotoğraf
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ChefHat className="w-16 h-16 text-primary/30" />
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-dark rounded-full text-xs font-semibold shadow-md">
                {recipe.category}
              </span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all shadow-md hover:scale-110 ${
                favorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-text/60 hover:text-red-500'
              }`}
              aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Heart 
                className={`w-5 h-5 transition-all ${favorite ? 'fill-current' : ''}`} 
              />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-heading font-bold text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {recipe.title}
            </h2>
            <p className="text-text/70 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
              {recipe.description}
            </p>
            
            {/* Meta Information */}
            <div className="flex items-center justify-between pt-4 border-t border-warm/30">
              <div className="flex items-center gap-4 text-sm text-text/60">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">{recipe.prep_time} dk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium">{recipe.servings} kişi</span>
                </div>
              </div>
              
              {/* Read More Arrow */}
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

