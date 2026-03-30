"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProductByHandle } from "@/app/lib/shopify";
import { useARStore } from "@/app/store/arStore";
import type { ShopifyProduct } from "@/app/lib/types";

interface ProductDetailProps {
  handle: string;
}

export function ProductDetail({ handle }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { setSelectedProduct } = useARStore();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setIsDescriptionExpanded(false);

      try {
        const fetchedProduct = await fetchProductByHandle(handle);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 h-12 w-12" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-center">
        <h3 className="font-semibold text-red-900">Error Loading Product</h3>
        <p className="mt-2 text-red-700">{error || "Product not found"}</p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-[#e72027] hover:text-[#c51c22]"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[selectedImage] || product.images?.[0];
  const price = product.priceRange?.minVariantPrice?.amount || "N/A";
  const currency = product.priceRange?.minVariantPrice?.currencyCode || "USD";
  const descriptionPreviewLimit = 240;
  const hasLongDescription =
    product.description.length > descriptionPreviewLimit;
  const displayedDescription =
    isDescriptionExpanded || !hasLongDescription
      ? product.description
      : `${product.description.slice(0, descriptionPreviewLimit).trimEnd()}...`;

  const handleTryOn = () => {
    setSelectedProduct(product);
    router.push("/try-on");
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center text-[#e72027] hover:text-[#c51c22]"
        >
          ← Back to products
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-200">
              {mainImage?.url ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-300">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx
                        ? "border-[#e72027]"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">${price}</span>
              <span className="ml-2 text-gray-600">{currency}</span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {displayedDescription}
              </p>
              {hasLongDescription && (
                <button
                  type="button"
                  onClick={() =>
                    setIsDescriptionExpanded((previous) => !previous)
                  }
                  className="mt-2 text-sm font-semibold text-[#e72027] hover:text-[#c51c22]"
                >
                  {isDescriptionExpanded ? "Read less" : "Show more"}
                </button>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Sizes
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        variant.available
                          ? "border-gray-200 bg-white"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <p className="font-medium text-gray-900 truncate">
                        {variant.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        {variant.available ? "In stock" : "Out of stock"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Try On Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleTryOn}
                className="flex-1 rounded-lg bg-[#e72027] py-3 font-semibold text-white transition-colors hover:bg-[#c51c22]"
              >
                Try On with AR
              </button>
              <button className="flex-1 rounded-lg border-2 border-black py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white">
                Add to Cart
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 rounded-lg border border-[#e72027]/30 bg-[#e72027]/10 p-4">
              <p className="text-sm text-[#7d1115]">
                <strong>Pro Tip:</strong> Use Portrait mode on your device and
                good lighting for the best AR experience. Make sure your feet
                are fully visible in the camera frame.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
