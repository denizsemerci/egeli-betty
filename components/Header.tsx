import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-warm-light border-b border-warm/30 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link href="/" className="group">
            <div className="relative w-48 h-16 md:w-64 md:h-20">
              <Image
                src="/egelibetty-logo.png"
                alt="Egeli Betty Logo"
                fill
                className="object-contain group-hover:opacity-90 transition-opacity"
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

