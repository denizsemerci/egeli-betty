import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="relative z-50">
      {/* Glass morphism effect with darker gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/40 via-primary/30 to-secondary/20 backdrop-blur-xl border-b border-primary/20 shadow-lg" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link href="/" className="group">
            <div className="relative w-48 h-16 md:w-64 md:h-20">
              <Image
                src="/egelibetty-logo.png"
                alt="Egeli Betty Logo"
                fill
                className="object-contain group-hover:opacity-90 transition-opacity drop-shadow-lg"
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

