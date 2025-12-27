'use client'

import { useState, useEffect } from 'react'
import { Check, Users, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

interface IngredientsListProps {
  ingredients: string[] | null
  defaultServings?: number
}

// Malzeme miktarını parse et ve çarpan uygula
function parseIngredient(ingredient: string, multiplier: number): string {
  // Sayıları ve birimleri bul
  const numberRegex = /(\d+[\.,]?\d*)\s*([a-zA-ZğüşıöçĞÜŞİÖÇ]+)?/g
  const matches = [...ingredient.matchAll(numberRegex)]
  
  if (matches.length === 0) return ingredient
  
  let result = ingredient
  matches.forEach((match) => {
    const originalNumber = parseFloat(match[1].replace(',', '.'))
    const newNumber = (originalNumber * multiplier).toFixed(1).replace(/\.0$/, '')
    result = result.replace(match[0], `${newNumber}${match[2] ? ' ' + match[2] : ''}`)
  })
  
  return result
}

// Malzeme ikonu belirle
function getIngredientIcon(ingredient: string): string {
  const lower = ingredient.toLowerCase()
  if (lower.includes('zeytin') || lower.includes('yağ')) return '🫒'
  if (lower.includes('domates') || lower.includes('biber')) return '🍅'
  if (lower.includes('soğan') || lower.includes('sarımsak')) return '🧅'
  if (lower.includes('et') || lower.includes('tavuk')) return '🍗'
  if (lower.includes('balık')) return '🐟'
  if (lower.includes('peynir')) return '🧀'
  if (lower.includes('yumurta')) return '🥚'
  if (lower.includes('un') || lower.includes('hamur')) return '🌾'
  if (lower.includes('şeker') || lower.includes('tatlı')) return '🍯'
  return '🥄'
}

export default function IngredientsList({ ingredients, defaultServings = 4 }: IngredientsListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [servings, setServings] = useState(defaultServings)

  if (!ingredients || ingredients.length === 0) {
    return <p className="text-text/60">Malzeme listesi bulunmuyor.</p>
  }

  const multiplier = servings / defaultServings
  const servingOptions = [2, 4, 6, 8, 10]

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  return (
    <article className="bg-surface rounded-2xl p-6 shadow-lg border border-warm/30">
      {/* Porsiyon Ayarlayıcı */}
      <div className="mb-6 pb-6 border-b border-warm/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-text">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Porsiyon Sayısı</span>
          </div>
          <div className="flex items-center gap-2">
            {servingOptions.map((option) => (
              <button
                key={option}
                onClick={() => setServings(option)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  servings === option
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-warm-light text-text hover:bg-warm'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-text/60 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Malzeme miktarları {servings} kişilik için güncelleniyor
        </p>
      </div>

      {/* Malzemeler Listesi */}
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index)
          const adjustedIngredient = multiplier !== 1 ? parseIngredient(ingredient, multiplier) : ingredient
          const icon = getIngredientIcon(ingredient)

          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-warm-light transition-colors"
              onClick={() => toggleCheck(index)}
            >
              <div className="text-2xl flex-shrink-0" aria-hidden="true">
                {icon}
              </div>
              <div
                className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  isChecked
                    ? 'bg-primary border-primary'
                    : 'border-secondary/50 group-hover:border-primary'
                }`}
              >
                {isChecked && <Check className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`flex-grow text-text font-medium ${
                  isChecked ? 'line-through text-text/50' : ''
                }`}
              >
                {adjustedIngredient}
              </span>
            </motion.li>
          )
        })}
      </ul>
    </article>
  )
}

