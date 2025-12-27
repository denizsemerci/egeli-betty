'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated - redirect to admin if logged in
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('admin_auth')
      if (auth === 'true') {
        router.replace('/admin')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (username.toLowerCase().trim() === 'betül' && password === '123') {
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin')
    } else {
      setAuthError('Kullanıcı adı veya şifre hatalı!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-xl p-8 border border-warm/30">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">
            Admin Girişi
          </h1>
          <p className="text-text/70">
            Egeli Betty Admin Paneli
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
              className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
              autoComplete="username"
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
              className="w-full px-4 py-3 rounded-xl border-2 border-warm/30 focus:border-primary focus:outline-none bg-background text-text"
              autoComplete="current-password"
            />
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-text/60 hover:text-primary transition-colors"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  )
}

