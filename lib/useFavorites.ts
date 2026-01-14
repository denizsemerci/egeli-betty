'use client'

import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load favorites from localStorage
    const stored = localStorage.getItem('egeli-betty-favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
      
      // Save to localStorage
      localStorage.setItem('egeli-betty-favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (recipeId: string) => favorites.includes(recipeId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  }
}

