'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-500 mt-2">Join ShopVerse today</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-gray-100 placeholder-gray-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john@example.com" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-gray-100 placeholder-gray-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-gray-100 placeholder-gray-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-gray-100 placeholder-gray-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
