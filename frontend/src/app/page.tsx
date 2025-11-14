'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🎭 Parallel Self Simulator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Kendinizin alternatif bir versiyonunu oluşturun ve her gün deterministik kurallarla 
            üretilen olaylarla paralel hayatınızı keşfedin
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Başlayın</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">Giriş Yapın</Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle>🎲 Deterministik Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Aynı özellikler her zaman aynı olayları üretir. Rastgelelik yok, 
                tamamen öngörülebilir bir deneyim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 7 Olay Kategorisi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Başarı, Hata, Sosyal, Maddi, İçsel, Fikir ve Çatışma kategorilerinde 
                günlük olaylar yaşayın.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Detaylı İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Paralel benliğinizin gelişimini takip edin, trendleri analiz edin 
                ve ilerlemenizi görün.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Paralel Benliğinizi Oluşturun</h3>
                <p className="text-gray-600">
                  Ana özellik, zaaf, yetenek, günlük hedef ve karakter adı ile alternatif versiyonunuzu tanımlayın.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Benzersiz Seed Üretilir</h3>
                <p className="text-gray-600">
                  Girdiğiniz özelliklerden matematiksel bir seed üretilir. Bu seed, tüm olaylarınızı belirler.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Günlük Olaylar Yaşayın</h3>
                <p className="text-gray-600">
                  Her gün otomatik olarak bir olay üretilir. Olaylar özelliklerinize göre şekillenir ve 
                  kümülatif skorunuzu etkiler.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">İlerlemeni Takip Et</h3>
                <p className="text-gray-600">
                  Dashboard'da istatistiklerinizi görün, trendleri analiz edin ve paralel hayatınızın 
                  hikayesini keşfedin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary-500 to-purple-600">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Alternatif Hayatınızı Başlatın
              </h2>
              <p className="text-white/90 mb-6">
                Tamamen ücretsiz. Kayıt olun ve hemen paralel benliğinizi oluşturun.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Ücretsiz Başlayın →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Parallel Self Simulator. Eğitim ve araştırma amaçlıdır.</p>
        </div>
      </footer>
    </div>
  );
}
