'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChefHat
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
  { name: 'Tarif Listesi', href: '/admin/tarifler', icon: FileText },
  { name: 'Yeni Tarif', href: '/admin/yeni-tarif', icon: Plus },
  { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('admin_auth')
      const isAuth = auth === 'true'
      setIsAuthenticated(isAuth)
      setIsChecking(false)
      
      // Redirect to login if not authenticated and not on login page
      if (!isAuth && pathname && !pathname.includes('/admin/giris')) {
        router.push('/admin/giris')
      }
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    router.push('/admin/giris')
  }

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/60">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Don't show layout for login page
  if (pathname?.includes('/admin/giris')) {
    return <>{children}</>
  }

  // Don't show layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-warm/30 z-50 lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                onLogout={handleLogout}
                onClose={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-surface border-r border-warm/30 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
          isCollapsed={!sidebarOpen}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-surface border-b border-warm/30 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-warm-light transition-colors"
              >
                <Menu className="w-6 h-6 text-text" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-warm-light transition-colors"
              >
                <Menu className="w-6 h-6 text-text" />
              </button>
              <h1 className="text-xl font-heading font-bold text-text">
                Admin Paneli
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-text/60 hover:text-primary transition-colors text-sm"
              >
                Siteye Dön
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onLogout,
  onClose,
  isCollapsed = false,
}: {
  pathname: string | null
  onLogout: () => void
  onClose?: () => void
  isCollapsed?: boolean
}) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-warm/30">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-heading font-bold text-text">Egeli Betty</h2>
              <p className="text-xs text-text/60">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text/70 hover:bg-warm-light hover:text-text'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-warm/30">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
          title={isCollapsed ? 'Çıkış Yap' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Çıkış Yap</span>}
        </button>
      </div>
    </>
  )
}

