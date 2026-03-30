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

  const { setSelectedProduct } = useARStore();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

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
          href="/"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[selectedImage] || product.images?.[0];
  const price = product.priceRange?.minVariantPrice?.amount || "N/A";
  const currency = product.priceRange?.minVariantPrice?.currencyCode || "USD";

  const handleTryOn = () => {
    setSelectedProduct(product);
    router.push("/try-on");
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
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
                        ? "border-blue-600"
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
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Sizes
                </h2>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {variant.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {variant.available
                            ? "✅ In Stock"
                            : "❌ Out of Stock"}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${variant.price}
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
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🎥 Try On with AR
              </button>
              <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Add to Cart
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 Pro Tip:</strong> Use Portrait mode on your device
                and good lighting for the best AR experience. Make sure your
                feet are fully visible in the camera frame.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
