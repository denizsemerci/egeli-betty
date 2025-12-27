'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, FileText, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Recipe {
  id: string
  title: string
  slug: string
  category: string
  created_at: string
  image_url: string | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    recentRecipes: [] as Recipe[],
    categoriesCount: {} as Record<string, number>,
  })
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchStats = async () => {
      try {
        // Get total recipes
        const { count: totalCount } = await supabase
          .from('recipes')
          .select('*', { count: 'exact', head: true })

        // Get recent recipes
        const { data: recent } = await supabase
          .from('recipes')
          .select('id, title, slug, category, created_at, image_url')
          .order('created_at', { ascending: false })
          .limit(5)

        // Get category counts
        const { data: allRecipes } = await supabase
          .from('recipes')
          .select('category')
        
        const categoriesCount: Record<string, number> = {}
        allRecipes?.forEach((recipe) => {
          categoriesCount[recipe.category] = (categoriesCount[recipe.category] || 0) + 1
        })

        setStats({
          totalRecipes: totalCount || 0,
          recentRecipes: recent || [],
          categoriesCount,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-text mb-2">
          Genel Bakış
        </h1>
        <p className="text-text/60">
          Egeli Betty admin paneline hoş geldiniz
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Tarif"
          value={stats.totalRecipes}
          icon={FileText}
          color="primary"
        />
        <StatCard
          title="Kategoriler"
          value={Object.keys(stats.categoriesCount).length}
          icon={LayoutDashboard}
          color="accent"
        />
        <StatCard
          title="Bu Ay Eklenen"
          value={stats.recentRecipes.filter((r) => {
            const recipeDate = new Date(r.created_at)
            const now = new Date()
            return recipeDate.getMonth() === now.getMonth() && 
                   recipeDate.getFullYear() === now.getFullYear()
          }).length}
          icon={TrendingUp}
          color="secondary"
        />
        <StatCard
          title="Son 7 Gün"
          value={stats.recentRecipes.filter((r) => {
            const recipeDate = new Date(r.created_at)
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - recipeDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 7
          }).length}
          icon={Clock}
          color="primary"
        />
      </div>

      {/* Recent Recipes */}
      <div className="bg-surface rounded-2xl p-6 shadow-lg border border-warm/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-text">
            Son Eklenen Tarifler
          </h2>
          <Link
            href="/admin/tarifler"
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Tümünü Gör →
          </Link>
        </div>

        {stats.recentRecipes.length === 0 ? (
          <p className="text-text/60 text-center py-8">
            Henüz tarif eklenmemiş
          </p>
        ) : (
          <div className="space-y-4">
            {stats.recentRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/tarif/${recipe.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-warm-light transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-warm/30">
                  {recipe.image_url ? (
                    <Image
                      src={recipe.image_url}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text/40">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text group-hover:text-primary transition-colors truncate">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-text/60">{recipe.category}</span>
                    <span className="text-xs text-text/40">
                      {new Date(recipe.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Category Distribution */}
      {Object.keys(stats.categoriesCount).length > 0 && (
        <div className="bg-surface rounded-2xl p-6 shadow-lg border border-warm/30">
          <h2 className="text-2xl font-heading font-bold text-text mb-6">
            Kategori Dağılımı
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.categoriesCount).map(([category, count]) => (
              <div
                key={category}
                className="p-4 bg-warm-light rounded-xl border border-warm/30"
              >
                <p className="font-semibold text-text mb-1">{category}</p>
                <p className="text-2xl font-bold text-primary">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'primary' | 'secondary' | 'accent'
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/20 text-secondary-dark',
    accent: 'bg-accent/10 text-accent',
  }

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-lg border border-warm/30">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-bold text-text mb-1">{value}</p>
      <p className="text-sm text-text/60">{title}</p>
    </div>
  )
}

