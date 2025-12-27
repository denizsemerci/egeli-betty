'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RecipeForm from '@/components/admin/RecipeForm'
import { useToast, ToastContainer } from '@/components/admin/Toast'

export default function EditRecipePage() {
  const params = useParams()
  const recipeId = params.id as string
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
    if (!supabase || !recipeId) return

    const loadRecipe = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setInitialData({
            title: data.title,
            description: data.description,
            category: data.category,
            prep_time: data.prep_time,
            servings: data.servings,
            ingredients: data.ingredients || [],
            steps: data.steps || [],
            image_url: data.image_url,
          })
        }
      } catch (err: any) {
        console.error('Error loading recipe:', err)
        error('Tarif yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [supabase, recipeId, error])

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
        <p className="text-text/60 text-lg mb-4">Tarif bulunamadı</p>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <RecipeForm recipeId={recipeId} initialData={initialData} />
    </>
  )
}

