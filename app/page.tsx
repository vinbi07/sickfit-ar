"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="athletic-bg athletic-grid min-h-screen text-white">
      <header className="border-b border-white/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-red.png"
              alt="SickFit"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <h1 className="text-xl font-bold tracking-wide">SickFit AR</h1>
          </div>
          <Link
            href="/shop"
            className="rounded-lg bg-[#e72027] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c51c22]"
          >
            Browse Socks
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full bg-[#e72027]/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#ff9da1]">
              Mobile AR Try-On
            </p>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              See how compression socks look before you buy.
            </h2>
            <p className="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
              SickFit AR lets you preview socks on your phone using camera-based
              pseudo AR. Smooth controls, fast load times, and realistic-enough
              alignment for a practical shopping experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-lg bg-[#e72027] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c51c22]"
              >
                Start Try-On
              </Link>
              <Link
                href="/shop"
                className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View Collection
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold">How It Works</h3>
            <ol className="mt-4 space-y-3 text-sm text-zinc-200">
              <li>1. Open the AR Try-On collection.</li>
              <li>2. Pick a sock product and tap Try On.</li>
              <li>3. Allow camera access on your phone.</li>
              <li>4. Drag, scale, and rotate the sock model manually.</li>
              <li>5. Capture a snapshot and compare options.</li>
            </ol>
            <div className="mt-6 rounded-lg border border-[#e72027]/40 bg-[#e72027]/15 p-3 text-xs text-[#ffd9da]">
              Built for practical mobile performance over perfect tracking.
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          <div className="glass-subtle rounded-xl p-4">
            <p className="text-sm font-semibold">Camera AR Preview</p>
            <p className="mt-2 text-xs text-zinc-300">
              Live camera overlay with interactive 3D controls.
            </p>
          </div>
          <div className="glass-subtle rounded-xl p-4">
            <p className="text-sm font-semibold">Shopify Connected</p>
            <p className="mt-2 text-xs text-zinc-300">
              Products sync from your AR collection automatically.
            </p>
          </div>
          <div className="glass-subtle rounded-xl p-4">
            <p className="text-sm font-semibold">Fallback Included</p>
            <p className="mt-2 text-xs text-zinc-300">
              Unsupported devices switch to interactive 3D viewer.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
