"use client";

import { useEffect, useState } from "react";
import { useARStore } from "@/app/store/arStore";

export function CameraPermission() {
  const { arSession, setARSession } = useARStore();
  const [requestInProgress, setRequestInProgress] = useState(false);

  const requestCameraPermission = async () => {
    setRequestInProgress(true);
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      // Success - stop the stream and mark permission as granted
      stream.getTracks().forEach((track) => track.stop());
      setARSession({
        cameraPermissionGranted: true,
        cameraPermissionDenied: false,
      });
    } catch (error) {
      console.error("Camera permission denied:", error);
      setARSession({
        cameraPermissionGranted: false,
        cameraPermissionDenied: true,
      });
    } finally {
      setRequestInProgress(false);
    }
  };

  if (arSession.cameraPermissionGranted) {
    return null; // Permission already granted, don't show prompt
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 rounded-lg bg-white p-6 shadow-lg max-w-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Camera Access Required
        </h2>

        <p className="mt-4 text-gray-600">
          To use the AR try-on feature, we need access to your camera to show
          you how the socks look on your feet.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() =>
              setARSession({
                cameraPermissionDenied: true,
              })
            }
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            disabled={requestInProgress}
          >
            Dismiss
          </button>
          <button
            onClick={requestCameraPermission}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={requestInProgress}
          >
            {requestInProgress ? "Requesting..." : "Allow Camera"}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          You can change this in your browser settings at any time.
        </p>
      </div>
    </div>
  );
}
