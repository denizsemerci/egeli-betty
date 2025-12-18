'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface IngredientsListProps {
  ingredients: string[] | null
}

export default function IngredientsList({ ingredients }: IngredientsListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  if (!ingredients || ingredients.length === 0) {
    return <p className="text-text/60">Malzeme listesi bulunmuyor.</p>
  }

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
    <div className="bg-surface rounded-2xl p-6 shadow-sm">
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index)
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => toggleCheck(index)}
            >
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
                className={`flex-grow text-text ${
                  isChecked ? 'line-through text-text/50' : ''
                }`}
              >
                {ingredient}
              </span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

