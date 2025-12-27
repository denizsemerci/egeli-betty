'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import { User, Mail, Lock, LogOut, Save, Eye, EyeOff } from 'lucide-react'

interface AdminSettings {
  username: string
  email: string
  displayName: string | null
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    username: 'betül',
    email: 'deniz.semerci1036@gmail.com',
    displayName: null,
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
      loadSettings()
    }
  }, [])

  const loadSettings = async () => {
    try {
      // Load settings from localStorage or Supabase
      const savedDisplayName = localStorage.getItem('admin_displayName')
      const savedEmail = localStorage.getItem('admin_email')
      
      setSettings({
        username: 'betül',
        email: savedEmail || 'deniz.semerci1036@gmail.com',
        displayName: savedDisplayName,
      })
    } catch (err) {
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(settings.email)) {
        error('Geçerli bir e-posta adresi girin')
        setSaving(false)
        return
      }

      // Call API endpoint
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: settings.email,
          displayName: settings.displayName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Profil güncellenirken bir hata oluştu')
      }

      // Save to localStorage
      localStorage.setItem('admin_email', settings.email)
      if (settings.displayName) {
        localStorage.setItem('admin_displayName', settings.displayName)
      } else {
        localStorage.removeItem('admin_displayName')
      }

      success('Profil bilgileri başarıyla güncellendi!')
    } catch (err: any) {
      console.error('Error updating profile:', err)
      error(err.message || 'Profil güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate passwords
      if (!currentPassword) {
        error('Mevcut şifrenizi girin')
        setSaving(false)
        return
      }

      if (newPassword.length < 4) {
        error('Yeni şifre en az 4 karakter olmalıdır')
        setSaving(false)
        return
      }

      if (newPassword !== confirmPassword) {
        error('Yeni şifreler eşleşmiyor')
        setSaving(false)
        return
      }

      // Call API endpoint
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Şifre değiştirilirken bir hata oluştu')
      }

      success('Şifre başarıyla değiştirildi!')
      
      // Clear password fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Error changing password:', err)
      error(err.message || 'Şifre değiştirilirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      localStorage.removeItem('admin_auth')
      localStorage.removeItem('admin_displayName')
      localStorage.removeItem('admin_email')
      router.replace('/admin/giris')
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
      
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2">
              Ayarlar
            </h1>
            <p className="text-text/60">
              Profil bilgilerinizi ve güvenlik ayarlarınızı yönetin
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-surface rounded-2xl p-6 shadow-lg border border-warm/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text">
                Profil Bilgileri
              </h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={settings.username}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 bg-warm-light text-text/60 cursor-not-allowed"
                />
                <p className="text-xs text-text/50 mt-1">
                  Kullanıcı adı değiştirilemez
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Yazar Başlığı (Display Name)
                </label>
                <p className="text-xs text-text/60 mb-2">
                  Bu isim sitede tariflerin altında yazar adı olarak görünecek. Boş bırakırsanız kullanıcı adı gösterilir.
                </p>
                <input
                  type="text"
                  value={settings.displayName || ''}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value || null })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                  placeholder="Örn: Betty"
                />
                <p className="text-xs text-text/50 mt-1">
                  Örnek: &quot;Betty&quot; yazarsanız, sitede &quot;Betty&quot; görünecek
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Profil Bilgilerini Kaydet
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-surface rounded-2xl p-6 shadow-lg border border-warm/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text">
                Güvenlik
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Mevcut Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    placeholder="Mevcut şifrenizi girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    placeholder="Yeni şifrenizi girin"
                    required
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Yeni Şifre Tekrar
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
                    placeholder="Yeni şifrenizi tekrar girin"
                    required
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Değiştiriliyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Şifreyi Değiştir
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

