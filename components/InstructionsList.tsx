'use client'

import { motion } from 'framer-motion'

interface InstructionsListProps {
  steps: string[] | null
}

export default function InstructionsList({ steps }: InstructionsListProps) {
  if (!steps || steps.length === 0) {
    return <p className="text-text/60">Yapılış tarifi bulunmuyor.</p>
  }

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-surface rounded-2xl p-6 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold">
              {index + 1}
            </div>
            <p className="text-text leading-relaxed pt-1">{step}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

