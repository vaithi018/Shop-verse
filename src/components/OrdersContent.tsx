'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrdersContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [orders, setOrders] = React.useState<Array<{
    id: string; total: number; date: string; status: string;
    items: Array<{ product: { name: string; price: number }; quantity: number }>;
    customer: { name: string; email: string; address: string };
  }>>([]);

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders).catch(() => {});
  }, []);

  const currentOrder = orderId ? orders.find(o => o.id === orderId) : null;

  if (orderId && currentOrder) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
          <p className="text-gray-500 mt-2">Your order has been placed successfully</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 space-y-4">
          <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono font-semibold text-violet-600">{currentOrder.id}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{new Date(currentOrder.date).toLocaleDateString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold capitalize">{currentOrder.status}</span></div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <h3 className="font-semibold">Items</h3>
          {currentOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm"><span>{item.product.name} ×{item.quantity}</span><span>${(item.product.price * item.quantity).toFixed(2)}</span></div>
          ))}
          <hr className="border-gray-200 dark:border-gray-700" />
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">${currentOrder.total.toFixed(2)}</span></div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <h3 className="font-semibold">Shipping To</h3>
          <p className="text-sm text-gray-500">{currentOrder.customer.name}<br/>{currentOrder.customer.email}<br/>{currentOrder.customer.address}</p>
        </div>
        <div className="text-center mt-6">
          <Link href="/products" className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg transition-all hover:scale-105">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/products" className="text-violet-600 font-semibold">Start Shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders?id=${order.id}`} className="block p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-mono text-sm text-violet-600 font-semibold">{order.id}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()} • {order.items.length} items</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold capitalize">{order.status}</span>
                  <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
