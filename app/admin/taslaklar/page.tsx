'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Search, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'

interface Draft {
  id: string
  title: string | null
  description: string | null
  category: string | null
  prep_time: number | null
  servings: number | null
  ingredients: string[]
  steps: string[]
  images: string[] | null
  image_url: string | null
  current_step: number
  created_at: string
  updated_at: string
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [filteredDrafts, setFilteredDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()
  const errorRef = useRef(error)
  errorRef.current = error

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchDrafts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('drafts')
          .select('*')
          .order('updated_at', { ascending: false })

        if (fetchError) throw fetchError

        setDrafts(data || [])
        setFilteredDrafts(data || [])
      } catch (err) {
        console.error('Error fetching drafts:', err)
        errorRef.current('Taslaklar yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchDrafts()
  }, [supabase])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDrafts(drafts)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = drafts.filter(
      (draft) =>
        (draft.title?.toLowerCase().includes(query)) ||
        (draft.category?.toLowerCase().includes(query)) ||
        (draft.description?.toLowerCase().includes(query))
    )
    setFilteredDrafts(filtered)
  }, [searchQuery, drafts])

  const handleDelete = (draft: Draft) => {
    setDraftToDelete(draft)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!draftToDelete || !supabase) return

    try {
      const { error: deleteError } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftToDelete.id)

      if (deleteError) throw deleteError

      setDrafts((prev) => prev.filter((d) => d.id !== draftToDelete.id))
      setFilteredDrafts((prev) => prev.filter((d) => d.id !== draftToDelete.id))
      
      success('Taslak başarıyla silindi')
      setDeleteModalOpen(false)
      setDraftToDelete(null)
    } catch (err: any) {
      console.error('Error deleting draft:', err)
      error(err.message || 'Taslak silinirken bir hata oluştu')
    }
  }

  const getDraftPreview = (draft: Draft) => {
    if (draft.images && draft.images.length > 0) {
      return draft.images[0]
    }
    return draft.image_url
  }

  const getStepName = (step: number) => {
    const steps = ['Genel Bilgiler', 'Malzemeler', 'Yapılış', 'Fotoğraf']
    return steps[step - 1] || 'Bilinmeyen'
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
          setDraftToDelete(null)
        }}
        onConfirm={confirmDelete}
        recipeTitle={draftToDelete?.title || 'Taslak'}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2">
              Taslaklar
            </h1>
            <p className="text-text/60">
              Kaydedilmiş taslakları görüntüleyin, düzenleyin veya silin
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-xl p-4 border border-warm/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
            <input
              type="text"
              placeholder="Taslak ara... (başlık, kategori veya açıklama)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
            />
          </div>
        </div>

        {/* Drafts Grid */}
        {filteredDrafts.length === 0 ? (
          <div className="bg-surface rounded-xl shadow-lg border border-warm/30 p-12 text-center">
            <FileText className="w-16 h-16 text-text/30 mx-auto mb-4" />
            <p className="text-text/60 mb-4 text-lg">
              {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz taslak bulunmuyor'}
            </p>
            {!searchQuery && (
              <p className="text-text/40 text-sm">
                Yeni tarif eklerken &quot;Taslağı Kaydet&quot; butonunu kullanarak taslak oluşturabilirsiniz.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-surface rounded-xl shadow-lg border border-warm/30 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-warm/30">
                  {getDraftPreview(draft) ? (
                    <Image
                      src={getDraftPreview(draft)!}
                      alt={draft.title || 'Taslak'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text/40">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium">
                      Adım {draft.current_step}/4
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-text mb-1 line-clamp-2">
                      {draft.title || 'İsimsiz Taslak'}
                    </h3>
                    {draft.description && (
                      <p className="text-sm text-text/70 line-clamp-2">
                        {draft.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {draft.category && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {draft.category}
                      </span>
                    )}
                    {draft.prep_time && (
                      <span className="px-2 py-1 bg-warm/30 text-text/70 rounded-full text-xs">
                        {draft.prep_time} dk
                      </span>
                    )}
                    {draft.servings && (
                      <span className="px-2 py-1 bg-warm/30 text-text/70 rounded-full text-xs">
                        {draft.servings} kişi
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-warm/30 flex items-center justify-between">
                    <div className="text-xs text-text/50">
                      {new Date(draft.updated_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/taslaklar/${draft.id}/duzenle`)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(draft)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {filteredDrafts.length > 0 && (
          <p className="text-sm text-text/60 text-center">
            {filteredDrafts.length} taslak gösteriliyor
          </p>
        )}
      </div>
    </>
  )
}

