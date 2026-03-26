'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Electronics', 'Fashion', 'Home', 'Food', 'Sports'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (sort) params.set('sort', sort);
        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());

        const res = await fetch(`/api/products?${params}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, category, sort, priceRange]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">All Products</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Explore our complete collection of premium products</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all">
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === '' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                All
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat === category ? '' : cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-500 whitespace-nowrap">Price: ${priceRange[0]} - ${priceRange[1]}</span>
              <input type="range" min="0" max="500" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-32 accent-violet-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6"><p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} found</p></div>

      {loading ? <LoadingSpinner /> : error ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
