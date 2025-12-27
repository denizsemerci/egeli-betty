'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface InstructionsListProps {
  steps: string[] | null
}

export default function InstructionsList({ steps }: InstructionsListProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  if (!steps || steps.length === 0) {
    return <p className="text-text/60">Yapılış tarifi bulunmuyor.</p>
  }

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSteps(newCompleted)
  }

  return (
    <article className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isLast = index === steps.length - 1

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`bg-surface rounded-2xl p-6 shadow-lg border-2 transition-all cursor-pointer group hover:shadow-xl ${
                  isCompleted
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-warm/30 hover:border-primary/40'
                }`}
                onClick={() => toggleStep(index)}
              >
                <div className="flex gap-4">
                  {/* Step Number / Checkbox */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-lg transition-all ${
                        isCompleted
                          ? 'bg-primary text-white shadow-lg scale-110'
                          : 'bg-primary/10 text-primary border-2 border-primary/30 group-hover:border-primary group-hover:bg-primary/20'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {/* Timeline connector (hidden on last item) */}
                    {!isLast && (
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-primary/20 hidden md:block" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow pt-1">
                    <p
                      className={`text-text leading-relaxed text-lg ${
                        isCompleted ? 'line-through text-text/50' : ''
                      }`}
                    >
                      {step}
                    </p>
                    {isCompleted && (
                      <p className="text-sm text-primary font-medium mt-2 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Tamamlandı
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Progress Indicator */}
      {completedSteps.size > 0 && (
        <div className="mt-6 p-4 bg-warm-light rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text">
              İlerleme
            </span>
            <span className="text-sm font-bold text-primary">
              {completedSteps.size} / {steps.length} adım tamamlandı
            </span>
          </div>
          <div className="w-full bg-warm rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </article>
  )
}

