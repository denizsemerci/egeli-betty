'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  recipeTitle: string
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  recipeTitle,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-6 border border-warm/30"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold text-text mb-2">
                    Tarifi Sil
                  </h3>
                  <p className="text-text/70 mb-4">
                    <strong className="text-text">{recipeTitle}</strong> adlı tarifi silmek istediğinize emin misiniz?
                  </p>
                  <p className="text-sm text-text/60 mb-6">
                    Bu işlem geri alınamaz. Tarif ve görseli kalıcı olarak silinecektir.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={onConfirm}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                    >
                      Evet, Sil
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 bg-warm-light text-text rounded-xl hover:bg-warm transition-colors font-medium border border-warm/30"
                    >
                      İptal
                    </button>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-text/40 hover:text-text hover:bg-warm-light rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

