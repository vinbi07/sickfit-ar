"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/app/components/ProductGrid";
import { CameraPermission } from "@/app/components/CameraPermission";

export default function ShopPage() {
  return (
    <div className="athletic-bg min-h-screen text-white">
      <header className="glass-subtle border-b border-white/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-red.png"
              alt="SickFit"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                AR Try-On Collection
              </h1>
              <p className="mt-1 text-sm text-zinc-300">
                Browse socks and launch the mobile try-on experience.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-md bg-[#e72027] px-3 py-2 text-sm font-semibold text-white hover:bg-[#c51c22]"
          >
            Back to Landing
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductGrid />
      </main>

      <CameraPermission />
    </div>
  );
}
