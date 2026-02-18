'use client';

import Link from 'next/link';
import { Leaf, Wheat, Trees, Beef, ArrowRight, Sparkles, Shield, Clock, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const features = [
  {
    icon: Sparkles,
    title: '127+ Ağıllı Qayda',
    description: 'Azərbaycan iqlimi və şəraitinə uyğunlaşdırılmış kənd təsərrüfatı qaydaları',
    color: 'from-leaf-400 to-leaf-600',
  },
  {
    icon: Shield,
    title: 'Erkən Xəbərdarlıq',
    description: 'Xəstəlik, zərərverici və kritik şərait haqqında vaxtında xəbərdarlıq',
    color: 'from-danger-400 to-danger-600',
  },
  {
    icon: Clock,
    title: 'Gündəlik Cədvəl',
    description: 'Prioritetlərə görə sıralanmış gündəlik iş planı',
    color: 'from-sky-400 to-sky-600',
  },
  {
    icon: Users,
    title: '5 Ferma Tipi',
    description: 'Taxıl, heyvandarlıq, meyvə bağı, tərəvəz və qarışıq təsərrüfat',
    color: 'from-wheat-400 to-wheat-600',
  },
];

const farmTypes = [
  { id: 'wheat', name: 'Taxıl', icon: Wheat, count: 31 },
  { id: 'livestock', name: 'Heyvandarlıq', icon: Beef, count: 22 },
  { id: 'orchard', name: 'Meyvə bağı', icon: Trees, count: 26 },
  { id: 'vegetable', name: 'Tərəvəz', icon: Leaf, count: 31 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf-100 rounded-full text-leaf-700 text-sm font-medium mb-8 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>Ağıllı Kənd Təsərrüfatı Həlli</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-earth-900 mb-6 animate-slide-up">
                Fermerlər üçün{' '}
                <span className="text-gradient">Ağıllı Məsləhətçi</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-earth-600 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Azərbaycan kənd təsərrüfatı üçün hazırlanmış qayda əsaslı tövsiyə sistemi.
                Hava şəraitinə, torpağa və məhsulunuza uyğun real zamanlı tövsiyələr.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link href="/recommendations" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Tövsiyə Al
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/farm" className="btn-secondary text-lg px-8 py-4">
                  Fermamı Qur
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-leaf-200/50 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-wheat-200/50 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </section>

        {/* Features */}
        <section className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
                Niyə AgriAdvisor?
              </h2>
              <p className="text-xl text-earth-600 max-w-2xl mx-auto">
                Yerli şəraitə uyğunlaşdırılmış, etibarlı kənd təsərrüfatı məsləhətləri
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="card-hover p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-earth-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-earth-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Farm Types */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
                Dəstəklənən Ferma Tipləri
              </h2>
              <p className="text-xl text-earth-600">
                Hər bir ferma tipi üçün xüsusi qaydalar toplusu
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {farmTypes.map((farm, index) => (
                <Link
                  key={farm.id}
                  href={`/recommendations?type=${farm.id}`}
                  className="card-hover p-6 text-center group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-leaf-100 to-leaf-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <farm.icon className="w-8 h-8 text-leaf-600" />
                  </div>
                  <h3 className="font-semibold text-earth-800 mb-1">{farm.name}</h3>
                  <p className="text-sm text-earth-500">{farm.count} qayda</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-leaf-600 to-leaf-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 decorative-dots" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Fermanızı İndi Rəqəmsallaşdırın
            </h2>
            <p className="text-xl text-leaf-100 mb-10">
              Hava şəraitini daxil edin, dərhal tövsiyələr alın.
              Heç bir qeydiyyat tələb edilmir.
            </p>
            <Link 
              href="/recommendations" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-leaf-700 font-semibold rounded-xl hover:bg-leaf-50 transition-colors shadow-xl"
            >
              Başla
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
