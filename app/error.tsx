'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-heading font-bold text-text mb-2">
          Bir şeyler ters gitti
        </h2>
        <p className="text-text/70 mb-6">
          Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-surface text-text border-2 border-secondary/30 rounded-2xl hover:border-primary/50 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  )
}

