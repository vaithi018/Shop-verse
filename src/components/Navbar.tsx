'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              ShopVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
            >
              Products
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hi, <span className="font-semibold text-violet-600 dark:text-violet-400">{user.name.split(' ')[0]}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Products
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Admin
              </Link>
            )}
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Signed in as <span className="font-semibold text-violet-600">{user.name}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
