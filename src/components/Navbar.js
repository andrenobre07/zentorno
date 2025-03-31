"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const isHome = router.pathname === "/";

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled || !isHome ? "bg-black bg-opacity-90 shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo e nome */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo Zentorno" className="h-16 w-16 mr-2 transition-transform duration-300 hover:scale-110" />
            <span className="text-white font-bold text-xl tracking-wide">ZENTORNO</span>
          </Link>
        </div>

        {/* Menu para telas maiores com destaque para item ativo */}
        <div className="hidden md:flex space-x-8">
          <Link href="/"
            className={`text-white text-sm uppercase tracking-widest font-medium hover:text-blue-400 transition-colors duration-300 border-b-2 ${
              router.pathname === '/' ? 'border-blue-500' : 'border-transparent'
            }`}>
            Home
          </Link>
          <Link href="/comprar"
            className={`text-white text-sm uppercase tracking-widest font-medium hover:text-blue-400 transition-colors duration-300 border-b-2 ${
              router.pathname === '/comprar' ? 'border-blue-500' : 'border-transparent'
            }`}>
            Catálogo
          </Link>
          <Link href="/login"
            className={`text-white text-sm uppercase tracking-widest font-medium hover:text-blue-400 transition-colors duration-300 border-b-2 ${
              router.pathname === '/login' ? 'border-blue-500' : 'border-transparent'
            }`}>
            Login
          </Link>
        </div>

        {/* Botão para mobile animado */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white focus:outline-none p-2"
          >
            <div className="w-6 flex flex-col justify-center items-center">
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
              }`} />
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile com animação */}
      <div className={`md:hidden absolute w-full bg-black bg-opacity-95 transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-2">
          <Link href="/" 
            className={`block py-3 text-white hover:text-blue-400 border-b border-gray-800 ${
              router.pathname === '/' ? 'text-blue-400' : ''
            }`}>
            Home
          </Link>
          <Link href="/comprar" 
            className={`block py-3 text-white hover:text-blue-400 border-b border-gray-800 ${
              router.pathname === '/comprar' ? 'text-blue-400' : ''
            }`}>
            Catálogo
          </Link>
          <a href="#sobre-nos" 
            className="block py-3 text-white hover:text-blue-400 border-b border-gray-800"
            onClick={() => setIsMenuOpen(false)}>
            Sobre
          </a>
          <Link href="/login" 
            className={`block py-3 text-white hover:text-blue-400 ${
              router.pathname === '/login' ? 'text-blue-400' : ''
            }`}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}