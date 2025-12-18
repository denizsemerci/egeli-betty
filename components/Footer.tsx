import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-secondary/20 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text/70 text-center md:text-left">
            © {new Date().getFullYear()} Egeli Betty. Tüm hakları saklıdır.
          </p>
          <Link
            href="/admin/yeni-tarif"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Yeni Tarif Ekle
          </Link>
        </div>
      </div>
    </footer>
  )
}

