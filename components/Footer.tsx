import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-secondary/20 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <div className="relative w-24 h-8 md:w-32 md:h-10">
                <Image
                  src="/egelibetty-logo.png"
                  alt="Egeli Betty Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              </div>
            </Link>
            <p className="text-sm text-text/70 text-center md:text-left">
              © {new Date().getFullYear()} Egeli Betty. Tüm hakları saklıdır.
            </p>
          </div>
          <Link
            href="/admin/giris"
            className="px-4 py-2 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-sm font-medium"
          >
            Anne Girişi
          </Link>
        </div>
      </div>
    </footer>
  )
}

