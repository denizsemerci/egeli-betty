'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ChefHat } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Tarifler', href: '/#recipes' },
  { name: 'Hakkımızda', href: '/hakkimizda' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-warm/20 transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative flex-shrink-0">
              <div 
                className={`relative transition-all duration-300 group-hover:scale-105 ${
                  isScrolled 
                    ? 'w-32 h-10 md:w-40 md:h-12' 
                    : 'w-40 h-12 md:w-56 md:h-16'
                }`}
              >
                <Image
                  src="/egelibetty-logo.png"
                  alt="Egeli Betty - Ege Mutfağı Tarifleri"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 160px, 224px"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative text-base font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-text'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                )
              })}
              <Link
                href="/#recipes"
                className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                <span>Bugün Ne Pişirsem?</span>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text hover:text-primary transition-colors"
              aria-label="Menüyü aç"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-warm/20">
            <span className="text-lg font-heading font-bold text-primary">Menü</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-text hover:text-primary transition-colors"
              aria-label="Menüyü kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-6 py-3 text-base font-medium transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/5 border-l-4 border-primary' 
                      : 'text-text hover:bg-warm/20 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-warm/20">
            <Link
              href="/#recipes"
              className="w-full px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>Bugün Ne Pişirsem?</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-24" />
    </>
  )
}

