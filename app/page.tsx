'use client';

import { ProductGrid } from './components/ProductGrid';
import { CameraPermission } from './components/CameraPermission';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SickFit AR</h1>
              <p className="mt-1 text-sm text-gray-600">
                Try on socks virtually with Augmented Reality
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                📱 Best on mobile • 🎥 Camera required
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Available Socks
          </h2>
          <p className="text-gray-600">
            Click on any sock to view details and try it on with AR
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid />
      </main>

      {/* Camera Permission Dialog */}
      <CameraPermission />

      {/* Footer */}
      <footer className="bg-white mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">About AR Try-On</h3>
              <p className="mt-4 text-sm text-gray-600">
                Use your device camera to see how socks look on your feet in real-time.
                Works on most modern smartphones and tablets.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Supported Devices</h3>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li>✅ iPhone 12+</li>
                <li>✅ Android 9+</li>
                <li>✅ iPad Air (2020+)</li>
                <li>✅ Samsung Galaxy S21+</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Need Help?</h3>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li>📖 How it works</li>
                <li>❓ FAQ</li>
                <li>📧 Contact Support</li>
                <li>🔒 Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              © 2026 SickFit AR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
