'use client';

import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-earth-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-leaf-500 to-leaf-600 rounded-xl flex items-center justify-center shadow-lg shadow-leaf-500/30 group-hover:shadow-leaf-500/50 transition-shadow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-display font-bold text-gradient">AgriAdvisor</span>
              <span className="hidden sm:block text-xs text-earth-500">Ağıllı Kənd Təsərrüfatı</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-earth-600 hover:text-leaf-600 font-medium transition-colors"
            >
              Ana Səhifə
            </Link>
            <Link
              href="/recommendations"
              className="text-earth-600 hover:text-leaf-600 font-medium transition-colors"
            >
              Tövsiyələr
            </Link>
            <Link
              href="/chatbot"
              className="text-earth-600 hover:text-leaf-600 font-medium transition-colors"
            >
              Chatbot
            </Link>
            <Link
              href="/farm"
              className="text-earth-600 hover:text-leaf-600 font-medium transition-colors"
            >
              Fermam
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/recommendations" className="btn-primary text-sm">
              Tövsiyə Al
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-earth-600 hover:text-leaf-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-earth-200/50">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block px-4 py-2 text-earth-600 hover:bg-leaf-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Səhifə
            </Link>
            <Link
              href="/recommendations"
              className="block px-4 py-2 text-earth-600 hover:bg-leaf-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tövsiyələr
            </Link>
            <Link
              href="/chatbot"
              className="block px-4 py-2 text-earth-600 hover:bg-leaf-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chatbot
            </Link>
            <Link
              href="/farm"
              className="block px-4 py-2 text-earth-600 hover:bg-leaf-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fermam
            </Link>
            <Link
              href="/recommendations"
              className="block btn-primary text-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tövsiyə Al
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
