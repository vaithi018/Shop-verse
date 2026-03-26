'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!form.expiry.trim()) newErrors.expiry = 'Expiry is required';
    if (!form.cvv.trim()) newErrors.cvv = 'CVV is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: cartTotal * 1.08,
          customer: { name: form.name, email: form.email, address: `${form.address}, ${form.city} ${form.zip}` },
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      const order = await res.json();
      clearCart();
      router.push(`/orders?id=${order.id}`);
    } catch {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
          <Link href="/products" className="text-violet-600 font-semibold">← Browse Products</Link>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border ${errors[field] ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Info */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className={inputClass('name')} placeholder="John Doe" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className={inputClass('address')} placeholder="123 Main St" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className={inputClass('city')} placeholder="New York" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ZIP Code</label>
                  <input name="zip" value={form.zip} onChange={handleChange} className={inputClass('zip')} placeholder="10001" />
                  {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                </div>
              </div>
            </div>
            {/* Payment */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-lg font-bold mb-4">Payment Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Card Number</label>
                  <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={inputClass('cardNumber')} placeholder="4242 4242 4242 4242" />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Expiry</label>
                  <input name="expiry" value={form.expiry} onChange={handleChange} className={inputClass('expiry')} placeholder="MM/YY" />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">CVV</label>
                  <input name="cvv" value={form.cvv} onChange={handleChange} className={inputClass('cvv')} placeholder="123" />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="font-medium whitespace-nowrap">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-gray-200 dark:border-gray-700 my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-emerald-500">Free</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>${(cartTotal * 0.08).toFixed(2)}</span></div>
              </div>
              <hr className="border-gray-200 dark:border-gray-700 my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
              <button type="submit" disabled={loading} className="mt-6 w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
