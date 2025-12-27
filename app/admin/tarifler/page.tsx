'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Search, Plus, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'

interface Recipe {
  id: string
  title: string
  slug: string
  category: string
  created_at: string
  image_url: string | null
  prep_time: number
  servings: number
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchRecipes = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('id, title, slug, category, created_at, image_url, prep_time, servings')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setRecipes(data || [])
        setFilteredRecipes(data || [])
      } catch (err) {
        console.error('Error fetching recipes:', err)
        error('Tarifler yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [supabase, error])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query)
    )
    setFilteredRecipes(filtered)
  }, [searchQuery, recipes])

  const handleDelete = (recipe: Recipe) => {
    setRecipeToDelete(recipe)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!recipeToDelete || !supabase) return

    try {
      // Delete image from storage if exists
      if (recipeToDelete.image_url) {
        const imagePath = recipeToDelete.image_url.split('/').slice(-2).join('/')
        await supabase.storage.from('recipe-images').remove([imagePath])
      }

      // Delete recipe from database
      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeToDelete.id)

      if (deleteError) throw deleteError

      // Remove from local state
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id))
      setFilteredRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id))
      
      success('Tarif başarıyla silindi')
      setDeleteModalOpen(false)
      setRecipeToDelete(null)
    } catch (err: any) {
      console.error('Error deleting recipe:', err)
      error(err.message || 'Tarif silinirken bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setRecipeToDelete(null)
        }}
        onConfirm={confirmDelete}
        recipeTitle={recipeToDelete?.title || ''}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2">
              Tarif Listesi
            </h1>
            <p className="text-text/60">
              Tüm tarifleri görüntüleyin, düzenleyin veya silin
            </p>
          </div>
          <Link
            href="/admin/yeni-tarif"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Yeni Tarif Ekle
          </Link>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-xl p-4 border border-warm/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
            <input
              type="text"
              placeholder="Tarif ara... (başlık veya kategori)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-xl shadow-lg border border-warm/30 overflow-hidden">
          {filteredRecipes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text/60 mb-4">
                {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz tarif eklenmemiş'}
              </p>
              {!searchQuery && (
                <Link
                  href="/admin/yeni-tarif"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  İlk Tarifi Ekle
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-warm-light border-b border-warm/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                      Görsel
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                      Başlık
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                      Süre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                      Porsiyon
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                      Tarih
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-text">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm/30">
                  {filteredRecipes.map((recipe) => (
                    <tr
                      key={recipe.id}
                      className="hover:bg-warm-light/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-warm/30">
                          {recipe.image_url ? (
                            <Image
                              src={recipe.image_url}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text/40">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/tarif/${recipe.slug}`}
                          className="font-semibold text-text hover:text-primary transition-colors"
                        >
                          {recipe.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {recipe.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text/70">
                        {recipe.prep_time} dk
                      </td>
                      <td className="px-6 py-4 text-text/70">
                        {recipe.servings} kişi
                      </td>
                      <td className="px-6 py-4 text-text/70 text-sm">
                        {new Date(recipe.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/tarifler/${recipe.id}/duzenle`)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(recipe)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredRecipes.length > 0 && (
          <p className="text-sm text-text/60 text-center">
            {filteredRecipes.length} tarif gösteriliyor
          </p>
        )}
      </div>
    </>
  )
}

