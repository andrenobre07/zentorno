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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-default ${
        isHome ? "bg-transparent" : "bg-white shadow-md"
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo e nome */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo Zentorno" className="h-10 w-10" />
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Zentorno
          </Link>
        </div>

        {/* Menu para telas maiores */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-default">
            Menu
          </Link>
          <Link href="/comprar" className="text-gray-700 hover:text-indigo-600 transition-default">
            Comprar
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition-default">
            Login
          </Link>
        </div>

        {/* Botão para mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none transition-default"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-default"
          >
            Menu
          </Link>
          <Link
            href="/comprar"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-default"
          >
            Comprar
          </Link>
          <Link
            href="/login"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-default"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
