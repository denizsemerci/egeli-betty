'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, X, Loader2, Save } from 'lucide-react'
import Image from 'next/image'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

const recipeSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  category: z.string().default(''),
  prep_time: z.number().default(0),
  servings: z.number().default(0),
  ingredients: z.array(z.object({ value: z.string() })).default([{ value: '' }]),
  steps: z.array(z.object({ value: z.string() })).default([{ value: '' }]),
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

interface RecipeFormProps {
  recipeId?: string // If provided, we're in edit mode
  draftId?: string // If provided, we're editing a draft
  initialData?: {
    title: string
    description: string
    category: string
    prep_time: number
    servings: number
    ingredients: string[]
    steps: string[]
    image_url: string | null
    images?: string[] // Multiple images
    current_step?: number // For drafts
  }
}

const DRAFT_STORAGE_KEY = (isEdit: boolean, id?: string) => 
  `egeli-betty-recipe-draft-${isEdit ? `edit-${id}` : 'new'}`

export default function RecipeForm({ recipeId, draftId, initialData }: RecipeFormProps) {
  const isEditMode = !!recipeId
  const isDraftMode = !!draftId
  const [currentStep, setCurrentStep] = useState(
    isDraftMode && initialData?.current_step ? initialData.current_step : 1
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [images, setImages] = useState<string[]>(
    initialData?.images || (initialData?.image_url ? [initialData.image_url] : [])
  )
  const [imageFiles, setImageFiles] = useState<Map<number, File>>(new Map())
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [savingDraft, setSavingDraft] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId || null)
  const imageFileRef = useRef<File | null>(null)
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  // Tarifi Kaydet butonunun takılı kalmasını önle: adım 4'e gelince veya uzun süre "yükleniyor" kalırsa sıfırla
  useEffect(() => {
    if (currentStep === 4) {
      setUploading(false)
      setUploadProgress('')
    }
  }, [currentStep])

  useEffect(() => {
    if (!uploading) return
    const t = setTimeout(() => {
      setUploading(false)
      setUploadProgress('')
    }, 90000)
    return () => clearTimeout(t)
  }, [uploading])

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          prep_time: initialData.prep_time,
          servings: initialData.servings,
          ingredients: initialData.ingredients.map((ing) => ({ value: ing })),
          steps: initialData.steps.map((step) => ({ value: step })),
        }
      : {
          ingredients: [{ value: '' }],
          steps: [{ value: '' }],
        },
  })

  // Watch all form values for draft saving
  const formValues = watch()

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

  // Save draft to database
  const saveDraft = useCallback(async () => {
    if (!supabase || isEditMode) return

    setSavingDraft(true)
    try {
      const draftData = {
        title: formValues.title?.trim() || null,
        description: formValues.description?.trim() || null,
        category: formValues.category || null,
        prep_time: formValues.prep_time || null,
        servings: formValues.servings || null,
        ingredients: formValues.ingredients?.map((ing: any) => ing.value?.trim()).filter(Boolean) || [],
        steps: formValues.steps?.map((step: any) => step.value?.trim()).filter(Boolean) || [],
        images: images.length > 0 ? images : null,
        image_url: images.length > 0 ? images[0] : null,
        current_step: currentStep,
        user_email: 'deniz.semerci1036@gmail.com',
        updated_at: new Date().toISOString(),
      }

      const targetId = isDraftMode ? draftId : currentDraftId
      if (targetId) {
        // Update existing draft
        const { error: updateError } = await supabase
          .from('drafts')
          .update(draftData)
          .eq('id', targetId)

        if (updateError) throw updateError
        success('Taslak güncellendi!')
      } else {
        // Create new draft
        const { data: insertedData, error: insertError } = await supabase
          .from('drafts')
          .insert(draftData)
          .select()
          .single()

        if (insertError) throw insertError
        if (insertedData) {
          setCurrentDraftId(insertedData.id)
          success('Taslak kaydedildi!')
        }
      }
    } catch (err: any) {
      console.error('Error saving draft:', err)
      error(err.message || 'Taslak kaydedilirken bir hata oluştu')
    } finally {
      setSavingDraft(false)
    }
  }, [formValues, currentStep, images, isEditMode, isDraftMode, supabase, draftId, currentDraftId, success, error])


  // Load recipe data if in edit mode
  useEffect(() => {
    if (isEditMode && !initialData && supabase) {
      const loadRecipe = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', recipeId)
            .single()

          if (fetchError) throw fetchError

          if (data) {
            reset({
              title: data.title,
              description: data.description,
              category: data.category,
              prep_time: data.prep_time,
              servings: data.servings,
              ingredients: (data.ingredients || []).map((ing: string) => ({ value: ing })),
              steps: (data.steps || []).map((step: string) => ({ value: step })),
            })
            // Load images array if exists, otherwise use image_url
            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
              setImages(data.images)
              setImagePreview(data.images[0])
            } else if (data.image_url) {
              setImages([data.image_url])
              setImagePreview(data.image_url)
            }
          }
        } catch (err) {
          console.error('Error loading recipe:', err)
          error('Tarif yüklenirken bir hata oluştu')
        }
      }

      loadRecipe()
    }
  }, [isEditMode, recipeId, initialData, supabase, reset, error])

  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    if (!fileToUpload || !supabase) {
      throw new Error('Dosya veya Supabase client bulunamadı')
    }

    try {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (fileToUpload.size > maxSize) {
        throw new Error('Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.')
      }

      const fileExt = fileToUpload.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `recipes/${fileName}`

      setUploadProgress('Görsel yükleniyor...')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        if (uploadError.message?.includes('new row violates row-level security')) {
          throw new Error('Storage policy hatası: Lütfen Supabase\'de storage policy\'lerini kontrol edin.')
        } else if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('Storage bucket bulunamadı.')
        } else {
          throw new Error(`Fotoğraf yüklenemedi: ${uploadError.message || 'Bilinmeyen hata'}`)
        }
      }

      if (!uploadData) {
        throw new Error('Upload başarısız: Veri alınamadı')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Public URL oluşturulamadı')
      }

      return publicUrl
    } catch (err: any) {
      console.error('Image upload failed:', err)
      throw err
    }
  }

  const onSubmit = async (data: RecipeFormData) => {
    if (currentStep !== 4) return
    if (uploading) return

    setUploading(true)
    setUploadProgress('')
    try {
      if (!supabase) {
        throw new Error('Supabase client başlatılamadı. Lütfen sayfayı yenileyin.')
      }

      // Upload multiple images
      const uploadedImages: string[] = []
      
      if (images.length > 0) {
        setUploadProgress(`Fotoğraflar yükleniyor... (0/${images.length})`)
        
        // Helper function to convert data URL to File
        const dataURLtoFile = (dataurl: string, filename: string): File => {
          const arr = dataurl.split(',')
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], filename, { type: mime })
        }

        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          if (typeof image !== 'string') continue

          // Check if it's a data URL (base64) or already uploaded URL
          if (image.startsWith('data:')) {
            // New image, needs to be uploaded
            try {
              setUploadProgress(`Fotoğraf ${i + 1}/${images.length} yükleniyor...`)
              const file = dataURLtoFile(image, `recipe-image-${i}.jpg`)
              const uploadedUrl = await uploadImage(file)
              if (uploadedUrl) {
                uploadedImages.push(uploadedUrl)
              }
            } catch (imageError: any) {
              console.error(`Error uploading image ${i + 1}:`, imageError)
              // Skip failed images, continue with others
              const shouldSkip = window.confirm(
                `Fotoğraf ${i + 1} yüklenemedi!\n\nHata: ${imageError?.message || 'Bilinmeyen hata'}\n\nBu fotoğrafı atlayıp devam etmek ister misiniz?`
              )
              if (!shouldSkip) {
                setUploading(false)
                setUploadProgress('')
                return
              }
            }
          } else {
            // Already uploaded URL, use directly
            uploadedImages.push(image)
          }
        }
        
        setUploadProgress('Fotoğraflar başarıyla yüklendi!')
      }

      // First image is the main image (for backward compatibility)
      const imageUrl = uploadedImages.length > 0 ? uploadedImages[0] : null

      setUploadProgress('Tarif kaydediliyor...')

      // Generate unique slug
      let baseSlug = generateSlug((data.title || '').trim() || 'tarif')
      let slug = baseSlug
      
      if (!isEditMode) {
        // Only check for duplicates when creating new recipe
        let slugCounter = 1
        while (true) {
          const { data: existingRecipe } = await supabase
            .from('recipes')
            .select('slug')
            .eq('slug', slug)
            .single()
          
          if (!existingRecipe) break
          
          slug = `${baseSlug}-${slugCounter}`
          slugCounter++
          
          if (slugCounter > 100) {
            slug = `${baseSlug}-${Date.now()}`
            break
          }
        }
      }

      const title = (data.title || '').trim() || 'İsimsiz Tarif'
      const description = (data.description || '').trim() || ''
      const category = (data.category || '').trim() || categories[0]
      const prepTime = Number(data.prep_time) || 0
      const servingsCount = Number(data.servings) || 0
      const ingredientsList = (data.ingredients || []).map((i) => (i?.value || '').trim()).filter(Boolean)
      const stepsList = (data.steps || []).map((s) => (s?.value || '').trim()).filter(Boolean)

      const recipeData: any = {
        title,
        slug: isEditMode ? undefined : slug, // Don't update slug when editing
        description,
        category,
        prep_time: prepTime >= 1 ? prepTime : 1,
        servings: servingsCount >= 1 ? servingsCount : 1,
        ingredients: ingredientsList.length > 0 ? ingredientsList : ['Malzeme belirtilmedi'],
        steps: stepsList.length > 0 ? stepsList : ['Yapılış belirtilmedi'],
        image_url: imageUrl,
        images: uploadedImages.length > 0 ? uploadedImages : null,
        user_email: 'deniz.semerci1036@gmail.com',
      }

      if (isEditMode) {
        // Update existing recipe
        const { error: updateError } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipeId)

        if (updateError) throw updateError

        // Clear draft on successful update
        if (typeof window !== 'undefined' && recipeId) {
          localStorage.removeItem(DRAFT_STORAGE_KEY(true, recipeId))
        }

        success('Tarif başarıyla güncellendi!')
        setTimeout(() => {
          router.push('/admin/tarifler')
        }, 1000)
      } else {
        // Create new recipe
        const { data: insertedData, error: insertError } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select()

        if (insertError) {
          let errorMessage = 'Tarif kaydedilirken bir hata oluştu.'
          if (insertError.message?.includes('duplicate key value violates unique constraint')) {
            errorMessage = 'Bu başlığa sahip bir tarif zaten mevcut. Lütfen tarif başlığını değiştirin.'
          } else if (insertError.message?.includes('images') || insertError.message?.includes('column')) {
            errorMessage = 'Çoklu fotoğraf için veritabanı güncellemesi gerekli. Supabase → SQL Editor’da supabase/add-images-field.sql dosyasını çalıştırın.'
          } else {
            errorMessage = insertError.message || errorMessage
          }
          throw new Error(errorMessage)
        }

        if (!insertedData || insertedData.length === 0) {
          throw new Error('Tarif kaydedilemedi. Lütfen tekrar deneyin.')
        }

        // Delete draft if exists
        const targetDraftId = isDraftMode ? draftId : currentDraftId
        if (targetDraftId && supabase) {
          await supabase.from('drafts').delete().eq('id', targetDraftId)
        }

        success('Tarif başarıyla eklendi!')
        setTimeout(() => {
          router.push(`/tarif/${slug}`)
        }, 1000)
      }
    } catch (err: any) {
      console.error('Error saving recipe:', err)
      error(err.message || 'Tarif kaydedilirken bir hata oluştu')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      // Save draft when moving to next step
      if (!isEditMode) {
        saveDraft()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Save draft when moving to previous step
      if (!isEditMode) {
        saveDraft()
      }
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">
            {isEditMode ? 'Tarif Düzenle' : 'Yeni Tarif Ekle'}
          </h1>
          <p className="text-text/60">
            {isEditMode ? 'Tarif bilgilerini güncelleyin' : 'Adım adım tarif ekleyin'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step
                      ? 'bg-primary text-white'
                      : 'bg-warm-light text-text/40'
                  }`}
                >
                  {step}
                </div>
                <p className="text-xs mt-2 text-text/60 text-center">
                  {step === 1 && 'Genel Bilgiler'}
                  {step === 2 && 'Malzemeler'}
                  {step === 3 && 'Yapılış'}
                  {step === 4 && 'Fotoğraf'}
                </p>
              </div>
              {step < 4 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all ${
                    currentStep > step ? 'bg-primary' : 'bg-warm-light'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (err: Record<string, unknown>) => {
            const firstKey = Object.keys(err || {})[0]
            const msg = firstKey
              ? `Eksik veya hatalı alan var. "Geri" ile ${currentStep > 1 ? 'önceki adımları' : 'formu'} kontrol edin.`
              : 'Lütfen tüm zorunlu alanları doldurun.'
            error(msg)
          })}
          className="bg-surface rounded-2xl p-6 lg:p-8 shadow-lg border border-warm/30"
        >
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
                    Tarif Başlığı
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    placeholder="Örn: Zeytinyağlı Enginar"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Açıklama
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    placeholder="Tarif hakkında kısa bir açıklama..."
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Kategori
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    >
                      <option value="">Seçiniz</option>
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

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Hazırlık Süresi (dk)
                    </label>
                    <input
                      {...register('prep_time', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    />
                    {errors.prep_time && (
                      <p className="text-red-600 text-sm mt-1">{errors.prep_time.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Porsiyon
                    </label>
                    <input
                      {...register('servings', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
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
                  Malzemeler
                </h2>

                <div className="space-y-4">
                  {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`ingredients.${index}.value`)}
                        type="text"
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                        placeholder={`Malzeme ${index + 1}...`}
                      />
                      {ingredientFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                  className="w-full py-3 border-2 border-dashed border-warm/50 rounded-xl text-text/60 hover:border-primary hover:text-primary transition-colors"
                >
                  + Malzeme Ekle
                </button>
              </motion.div>
            )}

            {/* Step 3: Steps */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-heading font-semibold text-text mb-6">
                  Yapılış Adımları
                </h2>

                <div className="space-y-4">
                  {stepFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <textarea
                        {...register(`steps.${index}.value`)}
                        rows={3}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                        placeholder={`Adım ${index + 1} açıklaması...`}
                      />
                      {stepFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors self-start"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {errors.steps && (
                    <p className="text-red-600 text-sm">{errors.steps.message}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => appendStep({ value: '' })}
                  className="w-full py-3 border-2 border-dashed border-warm/50 rounded-xl text-text/60 hover:border-primary hover:text-primary transition-colors"
                >
                  + Adım Ekle
                </button>
              </motion.div>
            )}

            {/* Step 4: Image */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-heading font-semibold text-text mb-6">
                  Fotoğraflar Ekle (İsteğe Bağlı)
                </h2>
                <p className="text-text/70 mb-6">
                  Tarifiniz için birden fazla fotoğraf ekleyebilirsiniz. İlk fotoğraf ana fotoğraf olarak kullanılacaktır.
                </p>

                <MultiImageUpload
                  images={images}
                  onImagesChange={(newImages) => {
                    setImages(newImages)
                    if (newImages.length > 0) {
                      setImagePreview(newImages[0])
                    } else {
                      setImagePreview(null)
                    }
                    // Save draft when images change
                    if (!isEditMode) {
                      setTimeout(() => saveDraft(), 500)
                    }
                  }}
                  maxImages={10}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-warm/30 gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-xl border-2 border-warm/30 text-text hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>

            <div className="flex items-center gap-3">
              {/* Save Draft Button - Show for new recipes and drafts */}
              {!isEditMode && (
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={savingDraft}
                  className="px-4 py-3 rounded-xl border-2 border-secondary text-secondary hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {savingDraft ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Taslağı Kaydet
                    </>
                  )}
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  İleri
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  {uploading && (
                    <p className="text-sm text-text/60">Lütfen bekleyin, kaydediliyor...</p>
                  )}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {uploadProgress || 'Kaydediliyor...'}
                      </>
                    ) : (
                      <>
                        {isEditMode ? 'Güncelle' : 'Tarifi Paylaş'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-text/50 max-w-[220px] text-right">
                    Kaydetmiyorsa: Geri ile önceki adımları kontrol edin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

