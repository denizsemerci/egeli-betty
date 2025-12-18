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
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category === 'Tümü') {
          params.delete('category')
        } else {
          params.set('category', category)
        }
        const href = `/?${params.toString()}`

        return (
          <Link
            key={category}
            href={href}
            className={cn(
              'px-6 py-2 rounded-full whitespace-nowrap transition-all',
              selectedCategory === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface text-text border-2 border-secondary/30 hover:border-primary/50'
            )}
          >
            {category}
          </Link>
        )
      })}
    </div>
  )
}

