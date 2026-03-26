'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products to get started!</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart <span className="text-lg font-normal text-gray-500">({cart.length} items)</span>
      </h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="128px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`} className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-violet-600 transition-colors line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">−</button>
                    <span className="px-4 py-1.5 text-sm font-semibold bg-gray-50 dark:bg-gray-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span className="text-emerald-500 font-medium">Free</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Tax (8%)</span><span>${(cartTotal * 0.08).toFixed(2)}</span></div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">${(cartTotal * 1.08).toFixed(2)}</span></div>
            </div>
            <Link href="/checkout" className="block mt-6 w-full text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-xl transition-all duration-300 hover:scale-[1.02]">
              Proceed to Checkout
            </Link>
            <Link href="/products" className="block mt-3 w-full text-center py-3 text-sm text-gray-500 hover:text-violet-600">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
