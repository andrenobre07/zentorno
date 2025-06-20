"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Car, User, Home, Menu, X, LogOut, Settings } from "lucide-react";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  const isHome = pathname === "/";

  const { currentUser, loading, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled || !isHome ? "bg-black bg-opacity-90 backdrop-blur-sm shadow-lg shadow-blue-900/20" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
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
            </div>
          </Link>
        </div>

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

          {!loading && currentUser && currentUser.isAdmin && (
            <Link href="/admin"
              className={`text-white text-sm uppercase tracking-widest font-medium hover:text-purple-400 transition-colors duration-300 px-2 py-1 flex items-center ${
                pathname.startsWith('/admin') ? 'text-purple-400 relative after:absolute after:bottom-0 after:left-0 after:bg-purple-500 after:h-0.5 after:w-full' : ''
              }`}
              title="Painel de Administrador"
            >
              <Settings size={16} className="mr-1" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <span className="text-white text-sm">A carregar...</span>
          ) : currentUser ? (
            <div className="flex items-center space-x-3">
              <Link href="/perfil"
                className="text-white text-sm uppercase tracking-widest font-medium hover:text-blue-400 transition-colors duration-300 px-2 py-1 flex items-center gap-2"
                title={`Ver perfil de ${currentUser.name || currentUser.email.split('@')[0]}`}
              >
                {/* --- ALTERAÇÃO AQUI: Mostra a foto ou o ícone --- */}
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Perfil" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <User size={16} />
                )}
                <span>{currentUser.name || currentUser.email.split('@')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300 shadow-md"
                title="Sair da conta"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login"
                className={`text-white text-sm flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 px-4 py-2 rounded-md shadow-md shadow-blue-900/30 hover:shadow-blue-500/30 ${
                  pathname === '/login' ? 'ring-2 ring-blue-400' : ''
                }`}>
                <User size={16} className="mr-1" />
                <span>Login</span>
              </Link>
              <Link href="/registrar"
                className="text-white text-sm flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-300 px-4 py-2 rounded-md shadow-md shadow-green-900/30 hover:shadow-green-500/30">
                <span>Registar</span>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none p-2 rounded-md hover:bg-blue-900/30 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} className="text-blue-400" /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-gradient-to-b from-black to-gray-900 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100 shadow-xl shadow-blue-900/20' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-2">
          <Link href="/" className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${ pathname === '/' ? 'text-blue-400' : '' }`} onClick={() => setIsMenuOpen(false)}>
            <Home size={18} className="mr-2" />
            <span>Home</span>
          </Link>
          <Link href="/comprar" className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${ pathname === '/comprar' ? 'text-blue-400' : '' }`} onClick={() => setIsMenuOpen(false)}>
            <Car size={18} className="mr-2" />
            <span>Catálogo</span>
          </Link>
          {!loading && currentUser && currentUser.isAdmin && (
            <Link href="/admin" className={`flex items-center py-3 text-white hover:text-purple-400 border-b border-gray-800 ${ pathname.startsWith('/admin') ? 'text-purple-400' : '' }`} onClick={() => setIsMenuOpen(false)}>
              <Settings size={18} className="mr-2" />
              <span>Painel Admin</span>
            </Link>
          )}
          {loading ? (
            <span className="flex items-center py-3 text-white">A carregar...</span>
          ) : currentUser ? (
            <>
              {/* --- ALTERAÇÃO AQUI: Link para a página de perfil no menu mobile --- */}
              <Link href="/perfil" className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${ pathname === '/perfil' ? 'text-blue-400' : '' }`} onClick={() => setIsMenuOpen(false)}>
                {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Perfil" className="w-7 h-7 rounded-full object-cover mr-2" />
                ) : (
                    <User size={18} className="mr-2" />
                )}
                <span>Meu Perfil</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center py-3 text-red-400 hover:text-red-500 w-full text-left">
                <LogOut size={18} className="mr-2" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`flex items-center py-3 text-white hover:text-blue-400 border-b border-gray-800 ${ pathname === '/login' ? 'text-blue-400' : '' }`} onClick={() => setIsMenuOpen(false)}>
                <User size={18} className="mr-2" />
                <span>Login</span>
              </Link>
              <Link href="/registrar" className="flex items-center py-3 mt-2 text-white hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>
                <span>Registar</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}