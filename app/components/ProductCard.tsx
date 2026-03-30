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
  const currency = product.priceRange?.minVariantPrice?.currencyCode || "USD";
  const image = product.featuredImage || product.images?.[0];
  const isAboveFold = index < 2;

  return (
    <Link href={`/product/${product.handle}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-200">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading={isAboveFold ? "eager" : "lazy"}
              priority={isAboveFold}
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-300">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {product.title}
          </h3>

          <p className="line-clamp-2 mt-2 text-sm text-gray-600">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${price}</span>
            <span className="text-xs text-gray-500">{currency}</span>
          </div>

          {/* Try On Button */}
          <button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            Try On
          </button>
        </div>
      </div>
    </Link>
  );
}
