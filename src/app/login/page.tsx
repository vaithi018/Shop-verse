'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-2xl text-white font-bold">{user.name[0]}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-500 mb-1">Email: {user.email}</p>
          <p className="text-gray-500 mb-6">Role: <span className="capitalize font-semibold text-violet-600">{user.role}</span></p>
          <Link href="/products" className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg transition-all hover:scale-105">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@store.com" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-gray-900 dark:text-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-gray-900 dark:text-white" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-violet-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <p className="text-sm font-semibold mb-2">Demo Admin account:</p>
          <div className="space-y-1 text-xs opacity-70">
            <p><span className="font-medium text-violet-600">Email:</span> admin@store.com</p>
            <p><span className="font-medium text-violet-600">Password:</span> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
