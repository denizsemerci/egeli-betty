'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  imagePreview: string | null
  onImageChange: (file: File | null) => void
  onImageRemove: () => void
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

export default function ImageUpload({
  imagePreview,
  onImageChange,
  onImageRemove,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File | null) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Geçersiz dosya formatı. Lütfen PNG, JPG veya WEBP formatında bir görsel seçin.')
      return
    }

    // Validate file size (max 10MB before compression)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.')
      return
    }

    setIsCompressing(true)
    try {
      // Compress image if it's larger than 1MB
      let processedFile = file
      if (file.size > 1024 * 1024) {
        // Only compress if larger than 1MB
        processedFile = await compressImage(file, 1920, 0.85)
        console.log(`Image compressed: ${file.size} → ${processedFile.size} bytes`)
      }
      onImageChange(processedFile)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Görsel işlenirken bir hata oluştu. Lütfen başka bir görsel deneyin.')
    } finally {
      setIsCompressing(false)
    }
  }, [onImageChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFile])

  if (imagePreview) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-warm/30 group">
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onImageRemove()
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white text-sm font-medium">
              Görsel seçildi
            </p>
            <p className="text-white/80 text-xs">
              Yeni görsel seçmek için tekrar tıklayın
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <label
      htmlFor="recipe-image-input"
      className={`block cursor-pointer transition-all ${
        isDragging ? 'scale-105' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-warm/50 hover:border-primary bg-warm-light/30'
        }`}
      >
        {isCompressing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-text font-medium">Görsel sıkıştırılıyor...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-text font-medium mb-2">
              {isDragging ? 'Görseli buraya bırakın' : 'Fotoğraf yüklemek için tıkla veya sürükle'}
            </p>
            <p className="text-sm text-text/60">
              PNG, JPG veya WEBP (Max 10MB)
            </p>
            <p className="text-xs text-text/40 mt-2">
              Büyük görseller otomatik olarak optimize edilir
            </p>
          </>
        )}
      </div>
      <input
        id="recipe-image-input"
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </label>
  )
}

