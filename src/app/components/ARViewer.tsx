"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ThreeARScene } from "@/app/ar/threeScene";
import { useARStore } from "@/app/store/arStore";
import { ARControls } from "@/app/components/ARControls";

interface ARViewerProps {
  modelUrl: string;
  onBack: () => void;
}

const defaultTransform = {
  position: { x: 0, y: -0.35, z: -1.6 },
  scale: 1,
  rotation: { x: 0, y: 0, z: 0 },
};

export function ARViewer({ modelUrl, onBack }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<ThreeARScene | null>(null);
  const lastGestureRef = useRef<{ distance: number; angle: number } | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { modelTransform, setModelTransform, resetModelTransform } =
    useARStore();

  const transform = useMemo(
    () => modelTransform || defaultTransform,
    [modelTransform],
  );

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    async function init() {
      if (!containerRef.current || !videoRef.current) return;

      setLoading(true);
      setError(null);

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const scene = new ThreeARScene(containerRef.current);
        sceneRef.current = scene;
        scene.init();
        await scene.loadModel(modelUrl);
        scene.applyTransform(transform);

        if (!mounted) return;
        setLoading(false);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Unable to start camera AR view",
        );
        setLoading(false);
      }
    }

    init();

    const onResize = () => {
      sceneRef.current?.resize();
    };

    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [modelUrl]);

  useEffect(() => {
    sceneRef.current?.applyTransform(transform);
  }, [transform]);

  const handleReset = () => {
    resetModelTransform();
    setModelTransform(defaultTransform);
    sceneRef.current?.applyTransform(defaultTransform);
  };

  const handleCapture = () => {
    const dataUrl = sceneRef.current?.captureFrame();
    if (!dataUrl) return;

    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `sickfit-tryon-${Date.now()}.png`;
    anchor.click();
  };

  const updateSingleTouch = (dx: number, dy: number) => {
    setModelTransform({
      position: {
        x: transform.position.x + dx * 0.0025,
        y: transform.position.y - dy * 0.0025,
        z: transform.position.z,
      },
    });
  };

  const updateMultiTouch = (distance: number, angle: number) => {
    const prev = lastGestureRef.current;
    if (!prev) {
      lastGestureRef.current = { distance, angle };
      return;
    }

    const scaleDelta = distance / Math.max(prev.distance, 1);
    const rotationDelta = angle - prev.angle;

    setModelTransform({
      scale: Math.min(5, Math.max(0.2, transform.scale * scaleDelta)),
      rotation: {
        x: transform.rotation.x,
        y: transform.rotation.y,
        z: transform.rotation.z + rotationDelta,
      },
    });

    lastGestureRef.current = { distance, angle };
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const target = touch.target as HTMLElement;
      const prevX = Number(target.dataset.prevX || touch.clientX);
      const prevY = Number(target.dataset.prevY || touch.clientY);
      updateSingleTouch(touch.clientX - prevX, touch.clientY - prevY);
      target.dataset.prevX = String(touch.clientX);
      target.dataset.prevY = String(touch.clientY);
      return;
    }

    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const dx = b.clientX - a.clientX;
      const dy = b.clientY - a.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      updateMultiTouch(distance, angle);
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    lastGestureRef.current = null;
  };

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black px-6 text-white">
        <div className="max-w-md rounded-xl bg-white/10 p-6 text-center">
          <h2 className="text-xl font-semibold">AR Camera Error</h2>
          <p className="mt-2 text-sm text-white/80">{error}</p>
          <button
            onClick={onBack}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div ref={containerRef} className="absolute inset-0" />

      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 text-white">
          Starting camera and loading 3D model...
        </div>
      )}

      <ARControls
        onBack={onBack}
        onReset={handleReset}
        onCapture={handleCapture}
      />
    </div>
  );
}
