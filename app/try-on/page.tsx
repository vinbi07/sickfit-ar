"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { detectARCapabilities, type ARCapabilities } from "@/app/ar/detection";
import { ARViewer } from "@/app/components/ARViewer";
import { ModelViewer } from "@/app/components/ModelViewer";
import { useARStore } from "@/app/store/arStore";

export default function TryOnPage() {
  const selectedProduct = useARStore((state) => state.selectedProduct);
  const [capabilities, setCapabilities] = useState<ARCapabilities | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadCapabilities() {
      try {
        const result = await detectARCapabilities();
        if (active) setCapabilities(result);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCapabilities();
    return () => {
      active = false;
    };
  }, []);

  const modelUrl = useMemo(
    () => selectedProduct?.modelUrl || "/models/sock.glb",
    [selectedProduct?.modelUrl],
  );
  const shouldUseModelViewer =
    capabilities?.recommendedMode === "modelviewer" ||
    capabilities?.recommendedMode === "none";

  if (!selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="max-w-md rounded-xl bg-white/10 p-6 text-center">
          <h1 className="text-2xl font-bold">No Product Selected</h1>
          <p className="mt-3 text-sm text-white/80">
            Select a sock product first, then tap Try On.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium"
          >
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4">
        <p className="text-sm font-semibold">{selectedProduct.title}</p>
        <p className="text-xs text-white/75">
          {loading
            ? "Checking AR capabilities..."
            : shouldUseModelViewer
              ? "Fallback mode: 3D viewer"
              : "Pseudo AR mode: camera + manual alignment"}
        </p>
      </div>

      {loading ? (
        <div className="flex h-full items-center justify-center">
          Preparing try-on...
        </div>
      ) : shouldUseModelViewer ? (
        <ModelViewer modelUrl={modelUrl} title={selectedProduct.title} />
      ) : (
        <ARViewer modelUrl={modelUrl} onBack={() => window.history.back()} />
      )}
    </div>
  );
}
