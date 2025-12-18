import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold text-text mb-4">
          Tarif Bulunamadı
        </h1>
        <p className="text-text/70 mb-8">
          Aradığınız tarif bulunamadı veya kaldırılmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

