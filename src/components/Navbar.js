// components/Navbar.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const isHome = router.pathname === "/"; // se estiver na página inicial

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${isHome ? "bg-transparent" : "bg-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo e nome */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo Zentorno" className="h-20 w-20 mr-2" />
          <Link href="/" className="text-white font-bold text-xl">Zentorno</Link>
        </div>

        {/* Menu para telas maiores */}
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300 cursor-pointer">
            Menu
          </Link>
          <a href="#sobre-nos" className="text-white hover:text-gray-300">
            Sobre nós
          </a>
          <Link href="/comprar" className="text-white hover:text-gray-300 cursor-pointer">
            Comprar
          </Link>
          <Link href="/login" className="text-white hover:text-gray-300 cursor-pointer">
            Login
          </Link>
        </div>

        {/* Botão para mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-black">
          <Link href="/" className="block px-4 py-2 text-white hover:bg-gray-700 cursor-pointer">
            Menu
          </Link>
          <a href="#sobre-nos" className="block px-4 py-2 text-white hover:bg-gray-700">
            Sobre nós
          </a>
          <Link href="/comprar" className="block px-4 py-2 text-white hover:bg-gray-700 cursor-pointer">
            Comprar
          </Link>
          <Link href="/login" className="block px-4 py-2 text-white hover:bg-gray-700 cursor-pointer">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
