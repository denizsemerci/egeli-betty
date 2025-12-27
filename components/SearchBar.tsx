'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [isFocused, setIsFocused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearch()
  }

  const updateSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleClear = () => {
    setSearch('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/?${params.toString()}`)
  }

  // Debounce search on input change (optional - can be enabled if needed)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    // Uncomment below to enable auto-search on typing (with debounce)
    // timeoutRef.current = setTimeout(() => {
    //   if (search !== searchParams.get('search')) {
    //     updateSearch()
    //   }
    // }, 500)
    // return () => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current)
    //   }
    // }
  }, [search])

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Tarif ara... (örn: zeytinyağlı, börek)"
          className="w-full px-6 py-4 pr-12 rounded-2xl border-2 transition-all bg-surface text-text placeholder:text-text/50 shadow-sm focus:border-primary focus:outline-none focus:shadow-md"
          aria-label="Tarif ara"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-text/40 hover:text-text/70 transition-colors"
              aria-label="Aramayı temizle"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="p-2 text-primary hover:text-primary/80 transition-colors"
            aria-label="Ara"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  )
}

