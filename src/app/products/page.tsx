'use client';

import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import dynamic from 'next/dynamic';

const ProductsContent = dynamic(() => import('@/components/ProductsContent'), { ssr: false });

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsContent />
    </Suspense>
  );
}
