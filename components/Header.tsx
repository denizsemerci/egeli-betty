import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="relative z-50 bg-white/95 backdrop-blur-md border-b border-warm/20 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4 md:py-5">
          <Link href="/" className="group relative">
            <div className="relative w-40 h-12 md:w-56 md:h-16 transition-transform duration-300 group-hover:scale-105">
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
        </div>
      </div>
    </header>
  )
}

