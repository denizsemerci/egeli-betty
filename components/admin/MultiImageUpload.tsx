'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'
import Image from 'next/image'

interface MultiImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

// Compress image before upload
function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Image loading failed'))
    }
    reader.onerror = () => reject(new Error('File reading failed'))
  })
}

export default function MultiImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      alert(`Maksimum ${maxImages} fotoğraf ekleyebilirsiniz.`)
      return
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    setIsCompressing(true)
    const newImagePreviews: string[] = []

    try {
      for (const file of filesToProcess) {
        // Validate file type
        if (!validTypes.includes(file.type)) {
          alert(`${file.name}: Geçersiz dosya formatı. PNG, JPG veya WEBP formatında olmalıdır.`)
          continue
        }

        // Validate file size
        if (file.size > maxSize) {
          alert(`${file.name}: Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.`)
          continue
        }

        // Compress image if needed
        let processedFile = file
        if (file.size > 1024 * 1024) {
          // Only compress if larger than 1MB
          processedFile = await compressImage(file, 1920, 0.85)
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          const preview = reader.result as string
          newImagePreviews.push(preview)
          
          // Update images when all files are processed
          if (newImagePreviews.length === filesToProcess.length) {
            onImagesChange([...images, ...newImagePreviews])
            setIsCompressing(false)
          }
        }
        reader.readAsDataURL(processedFile)
      }
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Görseller işlenirken bir hata oluştu. Lütfen tekrar deneyin.')
      setIsCompressing(false)
    }
  }, [images, maxImages, onImagesChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (images.length < maxImages) {
      setIsDragging(true)
    }
  }, [images.length, maxImages])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (images.length >= maxImages) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [images.length, maxImages, handleFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFiles])

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }, [images, onImagesChange])

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-warm/30"
            >
              <Image
                src={image}
                alt={`Fotoğraf ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium">
                  {index === 0 && 'Ana Fotoğraf'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <label
          htmlFor="multi-image-input"
          className={`block cursor-pointer transition-all ${
            isDragging ? 'scale-105' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/5 scale-105'
                : 'border-warm/50 hover:border-primary bg-warm-light/30'
            }`}
          >
            {isCompressing ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="text-text font-medium">Görseller işleniyor...</p>
              </div>
            ) : (
              <>
                <Plus className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-text font-medium mb-2">
                  {isDragging
                    ? 'Görselleri buraya bırakın'
                    : 'Fotoğraf eklemek için tıkla veya sürükle'}
                </p>
                <p className="text-sm text-text/60">
                  PNG, JPG veya WEBP (Max 10MB) • {images.length}/{maxImages} fotoğraf
                </p>
                <p className="text-xs text-text/40 mt-2">
                  Büyük görseller otomatik olarak optimize edilir
                </p>
              </>
            )}
          </div>
          <input
            id="multi-image-input"
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </label>
      )}

      {images.length >= maxImages && (
        <div className="text-center py-4 px-4 bg-warm-light rounded-xl border border-warm/30">
          <p className="text-sm text-text/70">
            Maksimum {maxImages} fotoğraf eklenebilir. Daha fazla eklemek için mevcut fotoğraflardan birini silin.
          </p>
        </div>
      )}
    </div>
  )
}

