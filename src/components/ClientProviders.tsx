'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
