'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface CategoryPillsProps {
  categories: string[]
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'Tümü'

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" aria-label="Tarif kategorileri">
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => {
          const params = new URLSearchParams(searchParams.toString())
          if (category === 'Tümü') {
            params.delete('category')
          } else {
            params.set('category', category)
          }
          const href = `/?${params.toString()}`
          const isActive = selectedCategory === category

          return (
            <Link
              key={category}
              href={href}
              className={cn(
                'px-6 py-3 rounded-full whitespace-nowrap transition-all font-medium text-sm relative',
                isActive
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-surface text-text border-2 border-warm/40 hover:border-primary/60 hover:bg-warm-light'
              )}
            >
              {category}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

