"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, User, Home, Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isHome = pathname === "/";

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
      scrolled || !isHome ? "bg-black bg-opacity-90 backdrop-blur-sm shadow-lg shadow-blue-900/20" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo e nome */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative h-12 w-12 mr-3 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo Zentorno" 
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-wide group-hover:text-blue-400 transition-colors duration-300">ZENTORNO</span>
              <span className="text-blue-500 text-xs uppercase tracking-widest">Premium Auto</span>
            </div>
          </Link>
        </div>

        {/* Menu para telas maiores com destaque para item ativo */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/"
            className={`text-white text-sm uppercase tracking-widest font-medium hover:text-blue-400 transition-colors duration-300 px-2 py-1 flex items-center ${
              pathname === '/' ? 'text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:bg-blue-500 after:h-0.5 after:w-full' : ''
            }`}>
            <Home size={16} className="mr-1" />
            <span>Home</span>
          </Link>
          <Link href="/comprar"
            className={`text-white text-sm uppercase tracking-widest font-medium hover:text-blue-400 transition-colors duration-300 px-2 py-1 flex items-center ${
              pathname === '/comprar' ? 'text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:bg-blue-500 after:h-0.5 after:w-full' : ''
            }`}>
            <Car size={16} className="mr-1" />
            <span>Catálogo</span>
          </Link>
          
          <Link href="/login"
            className={`text-white text-sm flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 px-4 py-2 rounded-md shadow-md shadow-blue-900/30 hover:shadow-blue-500/30 ${
              pathname === '/login' ? 'ring-2 ring-blue-400' : ''
            }`}>
            <User size={16} className="mr-1" />
            <span>Login</span>
          </Link>
          
          {/* Botão de pesquisa */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:text-blue-400 transition-colors duration-300"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Campo de pesquisa expandível */}
        <div className={`absolute right-20 top-1/2 -translate-y-1/2 transition-all duration-300 overflow-hidden ${
          searchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        }`}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar modelos..." 
              className="w-full bg-gray-900 border border-blue-500 rounded-full px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <X 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" 
              onClick={() => setSearchOpen(false)}
            />
          </div>
        </div>

        {/* Botão para mobile animado */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white focus:outline-none p-2 rounded-md hover:bg-blue-900/30 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X size={24} className="text-blue-400" />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile com animação */}
      <div className={`md:hidden absolute w-full bg-gradient-to-b from-black to-gray-900 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-80 opacity-100 shadow-xl shadow-blue-900/20' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-2">
          <Link href="/" 
            className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${
              pathname === '/' ? 'text-blue-400' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={18} className="mr-2" />
            <span>Home</span>
          </Link>
          <Link href="/comprar" 
            className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${
              pathname === '/comprar' ? 'text-blue-400' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Car size={18} className="mr-2" />
            <span>Catálogo</span>
          </Link>
          <Link href="/personalizar" 
            className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${
              pathname === '/personalizar' ? 'text-blue-400' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Personalizar</span>
          </Link>
          <a href="#sobre-nos" 
            className="flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800"
            onClick={() => setIsMenuOpen(false)}>
            <span>Sobre</span>
          </a>
          <Link href="/login" 
            className={`flex items-center py-3 mt-2 text-white hover:text-blue-400 ${
              pathname === '/login' ? 'text-blue-400' : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={18} className="mr-2" />
            <span>Login</span>
          </Link>
          
          {/* Campo de pesquisa no menu mobile */}
          <div className="py-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar modelos..." 
                className="w-full bg-gray-900 border border-blue-500 rounded-full px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}