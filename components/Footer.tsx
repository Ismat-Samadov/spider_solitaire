'use client';

import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-earth-200/50 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">AgriAdvisor</span>
            </div>
            <p className="text-earth-600 text-sm">
              Azərbaycan fermerləri üçün ağıllı kənd təsərrüfatı məsləhət sistemi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-earth-800 mb-4">Bölmələr</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-earth-600 hover:text-leaf-600 text-sm transition-colors">
                  Ana Səhifə
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-earth-600 hover:text-leaf-600 text-sm transition-colors">
                  Tövsiyələr
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-earth-600 hover:text-leaf-600 text-sm transition-colors">
                  Chatbot
                </Link>
              </li>
              <li>
                <Link href="/farm" className="text-earth-600 hover:text-leaf-600 text-sm transition-colors">
                  Fermam
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-earth-800 mb-4">Haqqında</h3>
            <p className="text-earth-600 text-sm">
              Ağıllı kənd təsərrüfatı məsləhət sistemi - fermerlərin gündəlik qərarlarına dəstək.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-earth-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-earth-500 text-sm">
            © 2025 AgriAdvisor. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
}
