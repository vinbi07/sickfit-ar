"use client";

import { useEffect } from "react";

interface ModelViewerProps {
  modelUrl: string;
  title: string;
}

export function ModelViewer({ modelUrl, title }: ModelViewerProps) {
  const ModelViewerTag = "model-viewer" as any;

  useEffect(() => {
    const existing = document.querySelector('script[data-model-viewer="true"]');
    if (existing) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.dataset.modelViewer = "true";
    document.head.appendChild(script);
  }, []);

  return (
    <div className="h-full w-full bg-black">
      <ModelViewerTag
        src={modelUrl}
        ar
        camera-controls
        touch-action="pan-y"
        auto-rotate
        shadow-intensity="1"
        style={{ width: "100%", height: "100%" }}
        alt={`3D preview for ${title}`}
      />
    </div>
  );
}
