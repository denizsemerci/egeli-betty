import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass morphism effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-warm-light/70 to-warm-light/60 backdrop-blur-xl border-b border-white/20 shadow-lg" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link href="/" className="group">
            <div className="relative w-48 h-16 md:w-64 md:h-20">
              <Image
                src="/egelibetty-logo.png"
                alt="Egeli Betty Logo"
                fill
                className="object-contain group-hover:opacity-90 transition-opacity drop-shadow-sm"
                priority
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

