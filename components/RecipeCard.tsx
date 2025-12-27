'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  prep_time: number
  servings: number
  image_url: string | null
  category: string
}

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/tarif/${recipe.slug}`} className="block h-full">
        <article className="bg-surface rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
          {recipe.image_url && !imageError ? (
            <div className="relative w-full h-48 overflow-hidden bg-secondary/20">
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center group-hover:from-secondary/40 group-hover:to-primary/30 transition-colors">
              <span className="text-text/40 text-4xl">🍽️</span>
            </div>
          )}
          <div className="p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-heading font-semibold text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {recipe.title}
            </h2>
            <p className="text-text/70 text-sm mb-4 line-clamp-2 flex-grow">
              {recipe.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-text/60 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prep_time} dk</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} kişi</span>
              </div>
              <div className="px-3 py-1 bg-secondary/20 rounded-full text-xs">
                {recipe.category}
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

