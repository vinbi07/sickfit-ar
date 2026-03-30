"use client";

import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct } from "@/app/lib/types";

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const price = product.priceRange?.minVariantPrice?.amount || "N/A";
  const image = product.featuredImage || product.images?.[0];
  const isAboveFold = index < 2;

  return (
    <Link href={`/product/${product.handle}`}>
      <div className="group relative min-h-[420px] cursor-pointer overflow-hidden rounded-xl border border-white/15 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e72027]/25">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={isAboveFold ? "eager" : "lazy"}
            priority={isAboveFold}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_8%,rgba(231,32,39,0.35),transparent_46%)]" />

        <div className="absolute bottom-0 z-10 w-full p-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-white drop-shadow">
            {product.title}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-white">${price}</span>
          </div>

          <button className="mt-4 w-full rounded-md bg-[#e72027] px-4 py-2 text-white transition-colors hover:bg-[#c51c22]">
            Try On
          </button>
        </div>
      </div>
    </Link>
  );
}
