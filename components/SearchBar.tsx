'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)
  }

  const isHero = false // Can be passed as prop if needed

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ege otları, zeytinyağlılar, tatlılar ara..."
          className="w-full px-6 py-4 md:py-5 pr-14 rounded-full border-2 border-white/30 focus:border-white focus:outline-none bg-white/95 backdrop-blur-sm text-text placeholder:text-text/50 shadow-xl focus:shadow-2xl transition-all text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
          aria-label="Ara"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </form>
  )
}

