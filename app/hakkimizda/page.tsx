import Image from 'next/image'
import { Heart, Wind, MapPin, Sparkles, Users, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda - Egeli Betty\'nin Hikayesi',
  description: 'Kuzey Ege\'nin iki yakasından sofranıza. Kuşaktan kuşağa aktarılan lezzet mirası ve Egeli Betty\'nin hikayesi.',
  openGraph: {
    title: 'Hakkımızda - Egeli Betty\'nin Hikayesi',
    description: 'Kuzey Ege\'nin iki yakasından sofranıza. Kuşaktan kuşağa aktarılan lezzet mirası.',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden -mt-20 md:-mt-24">
        <Image
          src="/hero-feast.jpg"
          alt="Egeli Betty - Kuzey Ege'nin Lezzetleri"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="text-sm font-medium">Kuşaktan Kuşağa Bir Lezzet Mirası</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight drop-shadow-lg">
              Egeli Betty&apos;nin Hikayesi
            </h1>
            <p className="text-xl md:text-2xl text-white/95 font-light drop-shadow-md">
              Kuzey Ege&apos;nin İki Yakasından Sofranıza
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Introduction */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Wind className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold text-text">
              Kuzey Ege&apos;nin Rüzgarı ve Anne Eli
            </h2>
          </div>
          <p className="text-lg text-text/80 leading-relaxed mb-6">
            Her şey, Kuzey Ege&apos;nin zeytin ağaçları arasında, deniz kokusunun kekik kokusuna karıştığı o bereketli topraklarda başladı. <span className="font-semibold text-primary">&ldquo;Egeli Betty&rdquo;</span>, aslında sadece bir web sitesi değil; yıllar içinde demlenmiş, kuşaktan kuşağa aktarılmış ve iki yakanın –hem Anadolu&apos;nun hem de karşı kıyının– lezzet sırlarıyla harmanlanmış bir mutfak mirasıdır.
          </p>
        </div>

        {/* Story Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Köklerimiz */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-warm/30">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold text-text mb-3">Köklerimiz</h3>
            <p className="text-sm text-text/70 leading-relaxed">
              Yunanistan&apos;dan Kuzey Ege kıyılarına uzanan göçmen bir ailenin mutfak geleneğini yaşatıyoruz. Zeytinyağının en hası, otların en tazesi bizim mutfağımızın baş tacıdır.
            </p>
          </div>

          {/* Şefimiz */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-warm/30">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-heading font-bold text-text mb-3">Şefimiz: Betty</h3>
            <p className="text-sm text-text/70 leading-relaxed">
              Emekli ama mutfaktan asla emekli olmayan, el lezzetiyle yiyen herkesi kendine hayran bırakan annem. &ldquo;Egeli Betty&rdquo; ismi, onun yıllar önce başlattığı serüvenin bugünkü yankısıdır.
            </p>
          </div>

          {/* Amacımız */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-warm/30">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-secondary-dark" />
            </div>
            <h3 className="text-xl font-heading font-bold text-text mb-3">Amacımız</h3>
            <p className="text-sm text-text/70 leading-relaxed">
              Bu tarifsiz lezzetler gizli kalmasın, Ege güneşi dünyanın dört bir yanındaki sofraları ısıtsın diye; anne tecrübesini dijital dünyayla buluşturuyoruz.
            </p>
          </div>
        </div>

        {/* Detailed Story */}
        <div className="bg-gradient-to-br from-warm-light to-white rounded-3xl p-8 md:p-12 shadow-xl mb-16 border border-warm/40">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold text-text">
              Bir Blogdan Fazlası: Geçmişten Bugüne
            </h2>
          </div>

          <div className="space-y-6 text-text/80 leading-relaxed">
            <p className="text-lg">
              Ben daha dünyaya gelmeden önce, annem <span className="font-semibold text-primary">&ldquo;Egeli Betty&rdquo;</span> adıyla bir blogda yazıya döküyordu mutfağının sırlarını. O zamanlar dijital dünya bu kadar büyük değildi belki ama annemin sofrasındaki lezzetlerin ünü, ekranların ötesine taşıyordu.
            </p>

            <p className="text-lg">
              Şimdi emekli olsa da, mutfak önlüğünü hiç çıkarmadı. Yunanistan göçmeni bir ailenin kızı olarak, genlerinde taşıdığı o eşsiz damak tadını, Kuzey Ege&apos;nin taptaze otları ve altın sarısı zeytinyağıyla birleştirerek sanatını icra etmeye devam ediyor.
            </p>

            <div className="bg-white/60 rounded-2xl p-6 my-8 border-l-4 border-primary">
              <h3 className="text-2xl font-heading font-bold text-text mb-4">Neden Şimdi?</h3>
              <p className="text-lg">
                Ben, o meşhur yemeklerle büyüyen şanslı kızı olarak, bu lezzetlerin sadece bizim soframızda kalmasına gönlüm razı olmadı. Annemin <span className="italic">&ldquo;el lezzeti&rdquo;</span> dediğimiz o tarifsiz büyüsünü, unutulmaya yüz tutmuş göçmen tariflerini ve Ege&apos;nin şifalı mutfağını tüm dünya ile paylaşmak istedim.
              </p>
            </div>

            <p className="text-lg">
              Bu web sitesi, annemin yıllar önce yarım bıraktığı o bloğun modern bir devamı, bir nevi saygı duruşudur. Burada bulacağınız her tarifte; bir tutam anne sevgisi, biraz Kuzey Ege rüzgarı ve çokça yaşanmışlık var.
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center py-12 px-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-6">
            Hoş Geldiniz!
          </h2>
          <p className="text-xl text-text/80 mb-4 max-w-2xl mx-auto leading-relaxed">
            Bizim mutfağımızda ölçüler <span className="font-semibold text-primary">&ldquo;göz kararı&rdquo;</span> değil, <span className="font-semibold text-primary">&ldquo;gönül kararı&rdquo;</span>dır.
          </p>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            Sofraların birleştirici gücüne inanan herkesi, Egeli Betty&apos;nin lezzet yolculuğuna davet ediyoruz.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/#recipes"
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Tarifleri Keşfet
            </a>
          </div>
          <p className="mt-8 text-lg font-heading text-primary/80 italic">
            Afiyet, şifa ve muhabbetle...
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-3 text-primary/30">
          <Heart className="w-8 h-8 fill-current" />
          <Wind className="w-8 h-8" />
          <Sparkles className="w-8 h-8" />
        </div>
      </article>
    </main>
  )
}

