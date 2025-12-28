import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-surface border-b border-secondary/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-32 h-12 md:w-40 md:h-14">
            <Image
              src="/logo.png"
              alt="Egeli Betty Logo"
              fill
              className="object-contain group-hover:opacity-90 transition-opacity"
              priority
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </Link>
      </div>
    </header>
  )
}

