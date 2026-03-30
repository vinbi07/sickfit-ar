"use client";

import { useEffect } from "react";
import { fetchProducts, transformProducts } from "@/app/lib/shopify";
import { useARStore } from "@/app/store/arStore";
import { ProductCard } from "./ProductCard";
import { SHOPIFY_CONFIG } from "@/app/lib/constants";

export function ProductGrid() {
  const {
    products,
    productsLoading,
    productsError,
    setProducts,
    setProductsLoading,
    setProductsError,
  } = useARStore();

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError(undefined);

      try {
        const connection = await fetchProducts(
          SHOPIFY_CONFIG.PRODUCTS_PER_PAGE,
        );
        if (connection) {
          const transformedProducts = transformProducts(connection);
          setProducts(transformedProducts);
        } else {
          setProductsError("Failed to fetch products from Shopify");
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProductsError(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setProductsLoading(false);
      }
    };

    if (products.length === 0 && !productsLoading) {
      loadProducts();
    }
  }, [
    products,
    productsLoading,
    setProducts,
    setProductsLoading,
    setProductsError,
  ]);

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 h-12 w-12" />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-center">
        <h3 className="font-semibold text-red-900">Error Loading Products</h3>
        <p className="mt-2 text-red-700">{productsError}</p>
        <p className="mt-4 text-sm text-red-600">
          Make sure your Shopify API credentials are configured in .env.local
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
