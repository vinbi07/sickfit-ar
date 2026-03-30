"use client";

interface ARControlsProps {
  onReset: () => void;
  onCapture: () => void;
  onBack: () => void;
}

export function ARControls({ onReset, onCapture, onBack }: ARControlsProps) {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-20 px-4">
      <div className="mx-auto flex max-w-xl items-center justify-center gap-3 rounded-xl bg-black/50 p-3 backdrop-blur">
        <button
          onClick={onBack}
          className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
        >
          Back
        </button>
        <button
          onClick={onReset}
          className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
        >
          Reset
        </button>
        <button
          onClick={onCapture}
          className="rounded-lg bg-[#e72027] px-3 py-2 text-sm font-semibold text-white hover:bg-[#c51c22]"
        >
          Snapshot
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-white/80">
        Drag to move • Pinch to scale • Two-finger rotate
      </p>
    </div>
  );
}
