'use client'

import { Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Recipe {
  title: string
  slug: string
}

interface ShareButtonProps {
  recipe: Recipe
}

export default function ShareButton({ recipe }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const handleShare = () => {
    const message = `Egeli Betty'den harika bir tarif: ${recipe.title}\n\n${shareUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
    >
      <Share2 className="w-5 h-5" />
      <span>WhatsApp&apos;ta Paylaş</span>
    </button>
  )
}

