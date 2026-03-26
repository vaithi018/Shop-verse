'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-violet-600 dark:text-violet-400 backdrop-blur-sm shadow-sm">
            {product.category}
          </span>
        </div>
        {/* Rating */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-400/90 text-amber-900 backdrop-blur-sm flex items-center gap-1 shadow-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {product.rating}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
