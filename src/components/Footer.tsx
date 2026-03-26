import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                ShopVerse
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Discover premium products curated just for you. Quality meets style in every purchase at ShopVerse.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Products</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500 dark:text-gray-400">help@shopverse.com</span></li>
              <li><span className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</span></li>
              <li><span className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri 9AM-6PM</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} ShopVerse. All rights reserved. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
