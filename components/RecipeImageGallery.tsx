'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, Users, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface RecipeImageGalleryProps {
  images: string[]
  title: string
  description: string
  category: string
  prepTime: number
  servings: number
}

export default function RecipeImageGallery({
  images,
  title,
  description,
  category,
  prepTime,
  servings,
}: RecipeImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!images || images.length === 0) return null

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden -mt-20 md:-mt-24">
        {/* Main Image */}
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`${title} - Fotoğraf ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
                aria-label="Önceki fotoğraf"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
                aria-label="Sonraki fotoğraf"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium z-10">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {category}
                </span>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{prepTime} dk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{servings} kişilik</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3 drop-shadow-lg">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-3xl drop-shadow-md">
                {description}
              </p>
            </div>
          </div>

          {/* Thumbnail Strip (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 px-4 md:px-8">
              <div className="container mx-auto max-w-4xl">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? 'border-white scale-110'
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Click to open lightbox */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute inset-0 z-0"
            aria-label="Fotoğraf galerisini aç"
          />
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
                  aria-label="Önceki fotoğraf"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
                  aria-label="Sonraki fotoğraf"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex]}
                alt={`${title} - Fotoğraf ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

