import Image from 'next/image'
import { Heart, Wind, MapPin, Sparkles, Users, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda - Egeli Betty\'nin Hikayesi',
  description: 'Altınoluk kıyılarından Kazdağlarına, Edremit körfezinin lezzetleri sofranızda. Kuşaktan kuşağa aktarılan lezzet mirası ve Egeli Betty\'nin hikayesi.',
  openGraph: {
    title: 'Hakkımızda - Egeli Betty\'nin Hikayesi',
    description: 'Altınoluk kıyılarından Kazdağlarına, Kuzey Ege\'nin lezzetleri sofranızda. Kuşaktan kuşağa aktarılan lezzet mirası.',
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
              Altınoluk Kıyılarından Kazdağlarına
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
            Her şey, Altınoluk&apos;tan Edremit körfezine uzanan zeytin ağaçları arasında, Kazdağı&apos;nın şifalı otlarının kokusunun deniz esintisiyle birleştiği o bereketli topraklarda başladı. <span className="font-semibold text-primary">&ldquo;Egeli Betty&rdquo;</span>, aslında sadece bir web sitesi değil; yıllar içinde demlenmiş, kuşaktan kuşağa aktarılmış, Kuzey Ege&apos;nin lezzet sırlarıyla yoğrulmuş bir mutfak mirasıdır.
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
              Edremit körfezinin bereket dolu topraklarında, Kazdağı eteklerindeki zeytinlikler arasında yeşeren bir mutfak geleneğini yaşatıyoruz. Altınoluk&apos;un taze balıkları, Kaz Dağı&apos;nın şifalı otları bizim mutfağımızın baş tacıdır.
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
              Şimdi emekli olsa da, mutfak önlüğünü hiç çıkarmadı. Kuzey Egeli bir ailenin kızı olarak, yıllarca süren deneyimiyle, Kazdağı&apos;nın taptaze otlarını, Edremit zeytinyağının altın sarısı bereketiyle ve Altınoluk&apos;un deniz ürünleriyle harmanlayarak sanatını icra etmeye devam ediyor.
            </p>

            <div className="bg-white/60 rounded-2xl p-6 my-8 border-l-4 border-primary">
              <h3 className="text-2xl font-heading font-bold text-text mb-4">Neden Şimdi?</h3>
              <p className="text-lg">
                Ben, o meşhur yemeklerle büyüyen şanslı kızı olarak, bu lezzetlerin sadece bizim soframızda kalmasına gönlüm razı olmadı. Annemin <span className="italic">&ldquo;el lezzeti&rdquo;</span> dediğimiz o tarifsiz büyüsünü, Kuzey Ege&apos;nin unutulmaya yüz tutmuş geleneksel tariflerini ve Kazdağı&apos;nın şifalı mutfağını tüm dünya ile paylaşmak istedim.
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
            <a
              href="https://www.instagram.com/egelibetty/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <span>Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
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

