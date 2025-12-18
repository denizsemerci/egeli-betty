'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/tarif/${recipe.slug}`}>
        <article className="bg-surface rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
          {recipe.image_url ? (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
              <span className="text-text/40 text-4xl">🍽️</span>
            </div>
          )}
          <div className="p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-heading font-semibold text-text mb-2 line-clamp-2">
              {recipe.title}
            </h2>
            <p className="text-text/70 text-sm mb-4 line-clamp-2 flex-grow">
              {recipe.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-text/60">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prep_time} dk</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} kişi</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

