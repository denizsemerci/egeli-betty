'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RecipeForm from '@/components/admin/RecipeForm'
import { useToast, ToastContainer } from '@/components/admin/Toast'

export default function EditDraftPage() {
  const params = useParams()
  const router = useRouter()
  const draftId = params.id as string
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)
  const { toasts, error, removeToast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    if (!supabase || !draftId) return

    const loadDraft = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('drafts')
          .select('*')
          .eq('id', draftId)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setInitialData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            prep_time: data.prep_time || 0,
            servings: data.servings || 0,
            ingredients: data.ingredients || [],
            steps: data.steps || [],
            image_url: data.image_url,
            images: data.images && Array.isArray(data.images) && data.images.length > 0 
              ? data.images 
              : data.image_url 
                ? [data.image_url] 
                : [],
            current_step: data.current_step || 1,
          })
        }
      } catch (err: any) {
        console.error('Error loading draft:', err)
        error('Taslak yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadDraft()
  }, [supabase, draftId, error])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="text-center py-16">
        <p className="text-text/60 text-lg mb-4">Taslak bulunamadı</p>
        <button
          onClick={() => router.push('/admin/taslaklar')}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
        >
          Taslaklara Dön
        </button>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <RecipeForm initialData={initialData} draftId={draftId} />
    </>
  )
}

