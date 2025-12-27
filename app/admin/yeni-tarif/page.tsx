'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const recipeSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  description: z.string().min(1, 'Açıklama gereklidir'),
  category: z.string().min(1, 'Kategori seçilmelidir'),
  prep_time: z.number().min(1, 'Hazırlık süresi gereklidir'),
  servings: z.number().min(1, 'Porsiyon sayısı gereklidir'),
  ingredients: z.array(z.object({ value: z.string().min(1, 'Malzeme adı gereklidir') })).min(1, 'En az bir malzeme eklenmelidir'),
  steps: z.array(z.object({ value: z.string().min(1, 'Adım açıklaması gereklidir') })).min(1, 'En az bir adım eklenmelidir'),
})

type RecipeFormData = z.infer<typeof recipeSchema>

const categories = [
  'Zeytinyağlılar',
  'Hamur İşi',
  'Tatlılar',
  'Salatalar',
  'Çorbalar',
  'Ana Yemekler',
]

export default function NewRecipePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const imageFileRef = useRef<File | null>(null) // Ref to track current image file
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)

  // Initialize Supabase client only on client side to avoid build-time errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setSupabase(createClient())
      } catch (error) {
        console.error('Failed to initialize Supabase client:', error)
      }
      // Her zaman false başlat, localStorage kontrolü yapma
      // Kullanıcı her seferinde giriş yapmalı
      setIsAuthenticated(false)
      setIsChecking(false)
    }
  }, [])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ value: '' }],
      steps: [{ value: '' }],
    },
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: 'steps',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (username.toLowerCase().trim() === 'betül' && password === '123') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
    } else {
      setAuthError('Kullanıcı adı veya şifre hatalı!')
    }
  }

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/60">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-text mb-2">
              Admin Girişi
            </h1>
            <p className="text-text/70">
              Devam etmek için giriş yapın
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="betül"
                className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Şifrenizi girin"
                className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors font-medium"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-text/60 hover:text-primary transition-colors"
            >
              Ana sayfaya dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.target.files?.[0]
    
    if (!file) {
      console.warn('No file selected')
      imageFileRef.current = null
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Geçersiz dosya formatı. Lütfen PNG, JPG veya WEBP formatında bir görsel seçin.')
      e.target.value = '' // Reset input
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.')
      e.target.value = '' // Reset input
      return
    }

    console.log('Image file selected:', file.name, file.size, file.type)
    
    // Set file to state and ref
    setImageFile(file)
    imageFileRef.current = file
    
    // Create preview
    const reader = new FileReader()
    reader.onerror = () => {
      console.error('Error reading file')
      alert('Görsel okunurken bir hata oluştu. Lütfen başka bir görsel deneyin.')
      setImageFile(null)
      imageFileRef.current = null
      setImagePreview(null)
      e.target.value = ''
    }
    reader.onloadend = () => {
      if (reader.result) {
        setImagePreview(reader.result as string)
        console.log('Image preview set successfully')
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    if (!fileToUpload) {
      throw new Error('Dosya bulunamadı')
    }

    if (!supabase) {
      throw new Error('Supabase client başlatılamadı')
    }

    try {
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (fileToUpload.size > maxSize) {
        throw new Error('Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.')
      }

      const fileExt = fileToUpload.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `recipes/${fileName}`

      console.log('Uploading to:', filePath, 'File:', fileToUpload.name, fileToUpload.size)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        console.error('Error message:', uploadError.message)
        
        // More specific error messages
        if (uploadError.message?.includes('new row violates row-level security')) {
          throw new Error('Storage policy hatası: Lütfen Supabase\'de storage policy\'lerini kontrol edin.')
        } else if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('Storage bucket bulunamadı. Lütfen Supabase\'de "recipe-images" bucket\'ını oluşturun.')
        } else {
          throw new Error(`Fotoğraf yüklenemedi: ${uploadError.message || 'Bilinmeyen hata'}`)
        }
      }

      if (!uploadData) {
        throw new Error('Upload başarısız: Veri alınamadı')
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('recipe-images').getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Public URL oluşturulamadı')
      }

      console.log('Public URL:', publicUrl)
      return publicUrl
    } catch (error: any) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  const onSubmit = async (data: RecipeFormData) => {
    // Only allow submission on step 4
    if (currentStep !== 4) {
      console.log('Form submission prevented - not on final step')
      return
    }
    
    if (uploading) return // Prevent double submission
    
    setUploading(true)
    try {
      console.log('Form submitted with data:', data)
      console.log('Image file state:', imageFile ? `${imageFile.name} (${imageFile.size} bytes, ${imageFile.type})` : 'null')
      console.log('Image preview state:', imagePreview ? 'exists' : 'null')
      
      // Validate required fields
      if (!data.title || !data.description || !data.category) {
        throw new Error('Lütfen tüm zorunlu alanları doldurun.')
      }

      if (!data.ingredients || data.ingredients.length === 0 || !data.ingredients[0]?.value) {
        throw new Error('En az bir malzeme eklemelisiniz.')
      }

      if (!data.steps || data.steps.length === 0 || !data.steps[0]?.value) {
        throw new Error('En az bir yapılış adımı eklemelisiniz.')
      }
      
      let imageUrl = null
      // Use ref to get the current image file (avoids closure issues)
      const currentImageFile = imageFileRef.current || imageFile
      console.log('Current image file from ref:', currentImageFile ? `${currentImageFile.name} (${currentImageFile.size} bytes)` : 'null')
      console.log('Current image file from state:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'null')
      
      if (currentImageFile) {
        console.log('Uploading image...', currentImageFile.name, currentImageFile.size, currentImageFile.type)
        setUploadProgress('Görsel yükleniyor...')
        try {
          imageUrl = await uploadImage(currentImageFile)
          if (!imageUrl) {
            throw new Error('Fotoğraf yüklenemedi: URL alınamadı')
          }
          console.log('Image uploaded successfully:', imageUrl)
          setUploadProgress('Görsel başarıyla yüklendi!')
        } catch (imageError: any) {
          console.error('Image upload error:', imageError)
          const errorMessage = imageError?.message || 'Fotoğraf yüklenemedi'
          console.error('Full error:', imageError)
          setUploadProgress('')
          
          // Show detailed error to user
          const shouldContinue = window.confirm(
            `Fotoğraf yüklenemedi!\n\nHata: ${errorMessage}\n\nFotoğraf olmadan devam etmek ister misiniz?`
          )
          if (!shouldContinue) {
            setUploading(false)
            setUploadProgress('')
            return
          }
          console.warn('Continuing without image...')
          imageUrl = null
        }
      } else {
        console.log('No image file to upload, continuing without image')
      }
      
      setUploadProgress('Tarif kaydediliyor...')

      const slug = generateSlug(data.title)
      console.log('Generated slug:', slug)

      const recipeData = {
        title: data.title.trim(),
        slug,
        description: data.description.trim(),
        category: data.category,
        prep_time: Number(data.prep_time),
        servings: Number(data.servings),
        ingredients: data.ingredients.map((i) => i.value.trim()).filter(Boolean),
        steps: data.steps.map((s) => s.value.trim()).filter(Boolean),
        image_url: imageUrl,
        user_email: 'deniz.semerci1036@gmail.com',
      }

      console.log('Inserting recipe:', recipeData)

      if (!supabase) {
        throw new Error('Supabase client başlatılamadı. Lütfen sayfayı yenileyin.')
      }

      const { data: insertedData, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Veritabanı hatası: ' + JSON.stringify(error))
      }

      if (!insertedData || insertedData.length === 0) {
        throw new Error('Tarif kaydedilemedi. Lütfen tekrar deneyin.')
      }

      console.log('Recipe inserted successfully:', insertedData)
      setUploadProgress('Tarif başarıyla kaydedildi!')
      
      // Success - redirect to recipe page after a short delay
      setTimeout(() => {
        router.push(`/tarif/${slug}`)
      }, 500)
    } catch (error: any) {
      console.error('Error creating recipe:', error)
      const errorMessage = error?.message || 'Tarif eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      alert(`Hata: ${errorMessage}`)
      setUploading(false)
      setUploadProgress('')
    } finally {
      // Ensure uploading state is reset if something goes wrong
      setTimeout(() => {
        if (uploading) {
          setUploading(false)
          setUploadProgress('')
        }
      }, 1000)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Show loading if Supabase client is not initialized (shouldn't happen in production)
  if (!supabase && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/60">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-text/60 hover:text-primary transition-colors mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </button>
          <h1 className="text-3xl font-heading font-bold text-text">
            Yeni Tarif Ekle
          </h1>
          <p className="text-text/70 mt-2">
            Adım {currentStep} / 4
          </p>
        </div>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            // Prevent form submission on Enter key unless on step 4
            if (e.key === 'Enter' && currentStep !== 4) {
              e.preventDefault()
            }
          }}
        >
          <div className="bg-surface rounded-3xl shadow-lg p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: General Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-heading font-semibold text-text mb-6">
                    Genel Bilgiler
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Tarif Adı *
                    </label>
                    <input
                      {...register('title')}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                      placeholder="Örn: Zeytinyağlı Enginar"
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                      placeholder="Bu tarif hakkında kısa bir açıklama yaz..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Kategori *
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                    >
                      <option value="">Kategori seç...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Hazırlık Süresi (dakika) *
                      </label>
                      <input
                        type="number"
                        {...register('prep_time', { valueAsNumber: true })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                        placeholder="30"
                      />
                      {errors.prep_time && (
                        <p className="text-red-600 text-sm mt-1">{errors.prep_time.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Kaç Kişilik? *
                      </label>
                      <input
                        type="number"
                        {...register('servings', { valueAsNumber: true })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                        placeholder="4"
                      />
                      {errors.servings && (
                        <p className="text-red-600 text-sm mt-1">{errors.servings.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Ingredients */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-heading font-semibold text-text mb-6">
                    Malzemeler neler?
                  </h2>

                  <div className="space-y-4">
                    {ingredientFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`ingredients.${index}.value`)}
                          className="flex-1 px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                          placeholder={`Malzeme ${index + 1}`}
                        />
                        {ingredientFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {errors.ingredients && (
                      <p className="text-red-600 text-sm">{errors.ingredients.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => appendIngredient({ value: '' })}
                    className="w-full py-3 border-2 border-dashed border-secondary/50 rounded-2xl text-text/60 hover:border-primary hover:text-primary transition-colors"
                  >
                    + Malzeme Ekle
                  </button>
                </motion.div>
              )}

              {/* Step 3: Instructions */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-heading font-semibold text-text mb-6">
                    Nasıl yapılıyor anlat bakalım
                  </h2>

                  <div className="space-y-4">
                    {stepFields.map((field, index) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium text-text">
                          Adım {index + 1}
                        </label>
                        <div className="flex gap-2">
                          <textarea
                            {...register(`steps.${index}.value`)}
                            rows={3}
                            className="flex-1 px-4 py-3 rounded-2xl border-2 border-secondary/30 focus:border-primary focus:outline-none bg-background text-text"
                            placeholder={`Adım ${index + 1} açıklaması...`}
                          />
                          {stepFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStep(index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors self-start"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {errors.steps && (
                      <p className="text-red-600 text-sm">{errors.steps.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => appendStep({ value: '' })}
                    className="w-full py-3 border-2 border-dashed border-secondary/50 rounded-2xl text-text/60 hover:border-primary hover:text-primary transition-colors"
                  >
                    + Adım Ekle
                  </button>
                </motion.div>
              )}

              {/* Step 4: Image Upload */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-heading font-semibold text-text mb-6">
                    Fotoğraf Ekle (İsteğe Bağlı)
                  </h2>

                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-warm/30">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setImageFile(null)
                            imageFileRef.current = null
                            setImagePreview(null)
                            // Reset file input
                            const fileInput = document.getElementById('recipe-image-input') as HTMLInputElement
                            if (fileInput) {
                              fileInput.value = ''
                            }
                          }}
                          className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg z-10"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2">
                          <p className="text-white text-sm font-medium">
                            {imageFile?.name || 'Görsel seçildi'}
                          </p>
                          <p className="text-white/80 text-xs">
                            {(imageFile?.size ? (imageFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <label 
                        htmlFor="recipe-image-input"
                        className="block cursor-pointer"
                      >
                        <div className="border-2 border-dashed border-secondary/50 rounded-2xl p-12 text-center hover:border-primary transition-colors bg-warm-light/30">
                          <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                          <p className="text-text font-medium mb-2">
                            Fotoğraf yüklemek için tıkla
                          </p>
                          <p className="text-sm text-text/60">
                            PNG, JPG veya WEBP (Max 5MB)
                          </p>
                        </div>
                        <input
                          id="recipe-image-input"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-secondary/20">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-2xl border-2 border-secondary/30 text-text hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  İleri
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {uploadProgress && (
                    <p className="text-sm text-primary font-medium">
                      {uploadProgress}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {uploadProgress || 'Kaydediliyor...'}
                      </>
                    ) : (
                      <>
                        Tarifi Kaydet
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

