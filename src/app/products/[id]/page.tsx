'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.id === Number(params.id));
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
          <Link href="/products" className="text-violet-600 hover:text-violet-700 font-semibold">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-violet-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/90 dark:bg-gray-900/90 text-violet-600 dark:text-violet-400 backdrop-blur-sm shadow-lg">
              {product.category}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{product.stock} in stock</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          {/* Separator */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  added
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => { handleAddToCart(); router.push('/cart'); }}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-violet-600 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Warranty</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Easy Returns</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
