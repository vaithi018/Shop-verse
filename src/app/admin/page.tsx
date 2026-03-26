'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

const emptyForm = { name: '', price: '', description: '', image: '', category: 'Electronics', rating: '4.0', stock: '10' };

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products').then(r => r.json()).then(d => { setProducts(d); setLoading(false); }).catch(() => setLoading(false));
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-gray-500 mb-6">Please login with admin credentials to access this page.</p>
          <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg">Sign In as Admin</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description) return alert('Fill required fields');
    setSaving(true);
    try {
      if (editing !== null) {
        await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...form }) });
      } else {
        await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      setForm(emptyForm); setEditing(null); setShowForm(false); fetchProducts();
    } catch { alert('Error saving product'); }
    setSaving(false);
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: p.price.toString(), description: p.description, image: p.image, category: p.category, rating: p.rating.toString(), stock: p.stock.toString() });
    setEditing(p.id); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const categories = ['Electronics', 'Fashion', 'Home', 'Food', 'Sports'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your products</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg transition-all hover:scale-105">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 animate-in">
          <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/50 focus:outline-none resize-none" required />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg transition-all hover:scale-105 disabled:opacity-50">
            {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {/* Product Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Product</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Category</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">Stock</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell"><span className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium">{p.category}</span></td>
                    <td className="px-6 py-4 font-semibold">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4 hidden md:table-cell">{p.stock}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
