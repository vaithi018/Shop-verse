'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featuredProducts = products.slice(0, 4);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-950 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                New Collection 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Discover
                <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Premium Style
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Explore our curated collection of premium products designed for modern living.
                Quality meets style in every purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 shadow-2xl shadow-white/20 transition-all duration-300 hover:scale-105 hover:shadow-white/30"
                >
                  Shop Now
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Browse Collection
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold">12+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.7★</div>
                  <div className="text-sm text-gray-400">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-2xl h-48 relative">
                  <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Headphones" fill className="object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl h-64 relative">
                  <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="Watch" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-2xl h-64 relative">
                  <Image src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" alt="Backpack" fill className="object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl h-48 relative">
                  <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" alt="Shoes" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">Find what you need in our diverse collection</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">
                  {cat === 'Electronics' ? '⚡' : cat === 'Fashion' ? '👗' : cat === 'Home' ? '🏠' : cat === 'Food' ? '☕' : '🏃'}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Handpicked products just for you</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 sm:p-12 lg:p-16 text-white">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Shop?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join thousands of happy customers. Sign up today and get exclusive deals and offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-violet-700 font-bold hover:bg-gray-100 shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
