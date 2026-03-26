'use client';

import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import dynamic from 'next/dynamic';

const OrdersContent = dynamic(() => import('@/components/OrdersContent'), { ssr: false });

export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrdersContent />
    </Suspense>
  );
}
