"use client";

export default function TryOnPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AR Try-On Experience</h1>
        <p className="text-xl text-gray-300 mb-8">
          Coming Soon - Virtual Sock Try-On Mode
        </p>

        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">🚧 In Development</h2>
          <p className="text-gray-400 mb-6">
            The AR try-on experience is currently being built. This feature will
            allow you to:
          </p>
          <ul className="text-left text-gray-400 space-y-2 mb-6">
            <li>✓ Use your device camera</li>
            <li>✓ Preview socks on your feet with AR</li>
            <li>✓ Move and scale the model with gestures</li>
            <li>✓ Capture screenshots</li>
          </ul>

          <div className="bg-blue-900 border border-blue-700 rounded p-4 mb-6">
            <p className="text-sm text-blue-300">
              <strong>Status:</strong> Phase 3-4 of implementation
            </p>
          </div>

          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    </div>
  );
}
