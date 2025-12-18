import Link from 'next/link'
import { ChefHat } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-surface border-b border-secondary/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <ChefHat className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <h1 className="text-2xl font-heading font-bold text-primary">
            Egeli Betty
          </h1>
        </Link>
      </div>
    </header>
  )
}

