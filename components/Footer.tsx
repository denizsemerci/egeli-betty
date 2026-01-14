'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Youtube, Mail, Heart } from 'lucide-react'
import { useState } from 'react'

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
  { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
]

const quickLinks = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Tarifler', href: '/#recipes' },
  { name: 'Hakkımızda', href: '/hakkimizda' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate newsletter subscription
    setTimeout(() => {
      setMessage('Teşekkürler! Yeni tariflerimizden haberdar olacaksınız.')
      setEmail('')
      setIsSubmitting(false)
      setTimeout(() => setMessage(''), 3000)
    }, 1000)
  }

  return (
    <footer className="bg-gradient-to-b from-surface to-warm-light border-t border-warm/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative w-40 h-12">
                <Image
                  src="/egelibetty-logo.png"
                  alt="Egeli Betty Logo"
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            </Link>
            <p className="text-sm text-text/70 leading-relaxed">
              Kuzey Ege'nin lezzetlerini, anne eli değmişçesine sofranıza taşıyoruz.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text/70 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {['Zeytinyağlılar', 'Hamur İşi', 'Tatlılar', 'Ana Yemekler'].map((category) => (
                <li key={category}>
                  <Link
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="text-sm text-text/70 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text mb-4">Bülten</h3>
            <p className="text-sm text-text/70 mb-4">
              Yeni tariflerimizden ilk siz haberdar olun!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-warm/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Abone Ol'}
              </button>
              {message && (
                <p className="text-xs text-primary font-medium animate-fade-in">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-warm/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text/60 text-center md:text-left flex items-center gap-2">
              © {new Date().getFullYear()} Egeli Betty. Tüm hakları saklıdır.
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Sevgiyle yapıldı <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              </span>
            </p>
            <Link
              href="/admin/giris"
              className="px-4 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-medium"
            >
              Anne Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

